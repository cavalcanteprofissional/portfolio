import { getSupabase, listServices, listPublicServices, insertOrcamento, getOrcamento, updateStatus, listOrcamentos } from './supabase';
import { computeTotal } from './pricing';
import { buildQuotePdf } from './pdf';
import { sendEmail, buildClientEmail, buildOwnerNotice } from './email';
import { shortCode } from './types';
import type { OrcamentoRow, QuoteRequest } from './types';

export interface Env {
  SUPABASE_URL: string;
  SERVICE_ROLE_KEY: string;
  BREVO_API_KEY: string;
  FROM_EMAIL: string;
  OWNER_EMAIL: string;
  ALLOWED_ORIGINS?: string;
  ADMIN_EMAILS?: string;
}

const GITHUB_PAGES_ORIGIN = 'https://cavalcanteprofissional.github.io';

const LANG = 'pt'; // orcamento sempre gerado em pt para o cliente

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URGENCIAS = new Set(['normal', 'urgente', 'muito_urgente']);

// Limitação simples por IP (em memória por isolate) p/ o POST /orcamento.
// Proteção suficiente p/ vazamento de emails; não bloqueia por nuvem (sem Turnstile).
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const rateHits = new Map<string, { count: number; resetAt: number }>();

class ApiError extends Error {
  constructor(message: string, readonly status: number = 400) {
    super(message);
  }
}

function originAllowed(origin: string | null, env: Env): boolean {
  if (!origin) return false;
  const allowed = (env.ALLOWED_ORIGINS ?? GITHUB_PAGES_ORIGIN)
    .split(',')
    .map((o) => o.trim());
  return allowed.includes(origin);
}

function langFrom(): 'pt' | 'en' | 'es' {
  return LANG;
}

async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError('Json invalido', 400);
  }
}

function assertAdminEmail(userEmail: string | null | undefined, env: Env): void {
  if (!userEmail) throw new ApiError('Acesso negado', 403);
  const allowlist = (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.length === 0) throw new ApiError('Acesso negado', 403);
  if (!allowlist.includes(userEmail.toLowerCase())) throw new ApiError('Acesso negado', 403);
}

async function requireAdmin(
  req: Request,
  db: ReturnType<typeof getSupabase>,
  env: Env,
): Promise<void> {
  const auth = req.headers.get('Authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new ApiError('Nao autorizado', 401);
  const { data, error } = await db.auth.getUser(token);
  if (error || !data?.user) throw new ApiError('Nao autorizado', 401);
  assertAdminEmail(data.user.email, env);
}

function assertQuoteValid(body: Partial<QuoteRequest> | null): asserts body is QuoteRequest {
  if (!body || typeof body !== 'object') throw new ApiError('Campos obrigatorios: nome, email, itens', 422);
  if (typeof body.nome !== 'string' || !body.nome.trim()) throw new ApiError('Campos obrigatorios: nome, email, itens', 422);
  if (body.nome.trim().length > 120) throw new ApiError('nome deve ter ate 120 caracteres', 422);
  if (typeof body.email !== 'string' || !body.email.trim()) throw new ApiError('Campos obrigatorios: nome, email, itens', 422);
  if (body.email.length > 254) throw new ApiError('email invalido', 422);
  if (!EMAIL_RE.test(body.email)) throw new ApiError('Email invalido', 422);
  if (!Array.isArray(body.itens) || body.itens.length === 0 || body.itens.length > 20) {
    throw new ApiError('itens: informe entre 1 e 20 servicos', 422);
  }
  for (const it of body.itens) {
    if (!it || typeof it.slug !== 'string' || !it.slug.trim()) throw new ApiError('item sem slug', 422);
    const qtd = Number(it.qtd);
    if (!Number.isInteger(qtd) || qtd < 1 || qtd > 500) throw new ApiError('qtd deve ser um inteiro entre 1 e 500', 422);
  }
  if (body.urgencia !== undefined && !URGENCIAS.has(body.urgencia)) throw new ApiError('urgencia invalida', 422);
  if (body.descricao !== undefined && (typeof body.descricao !== 'string' || body.descricao.length > 2000)) {
    throw new ApiError('descricao invalida', 422);
  }
  if (body.whatsapp !== undefined && (typeof body.whatsapp !== 'string' || body.whatsapp.length > 30)) {
    throw new ApiError('whatsapp invalido', 422);
  }
  if (body.cpf_cnpj !== undefined && (typeof body.cpf_cnpj !== 'string' || body.cpf_cnpj.length > 18)) {
    throw new ApiError('cpf_cnpj invalido', 422);
  }
}

// Retorna ms até liberar (retryAfter) ou null se dentro do limite
function checkRate(ip: string): number | null {
  const now = Date.now();
  const entry = rateHits.get(ip);
  if (!entry || now >= entry.resetAt) {
    if (rateHits.size > 5000) {
      for (const [key, hit] of rateHits) {
        if (Date.now() >= hit.resetAt) rateHits.delete(key);
      }
    }
    rateHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return null;
  }
  entry.count += 1;
  if (entry.count > RATE_MAX) return entry.resetAt - now;
  return null;
}

// Recompoe linhas/valor de um orcamento a partir do catalogo de servicos
async function recomputePrice(
  orc: OrcamentoRow,
  db: ReturnType<typeof getSupabase>,
) {
  const services = await listServices(db);
  const req: QuoteRequest = {
    nome: orc.nome,
    email: orc.email,
    itens: orc.itens,
    urgencia: (orc.urgencia as 'normal' | 'urgente' | 'muito_urgente') || 'normal',
  };
  return computeTotal(req, services, 'pt');
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get('Origin');
    const corsHeaders = (): Record<string, string> => {
      const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Vary': 'Origin',
        'Content-Type': 'application/json; charset=utf-8',
      };
      if (origin && originAllowed(origin, env)) headers['Access-Control-Allow-Origin'] = origin;
      return headers;
    };
    const json = (data: unknown, status = 200): Response =>
      new Response(JSON.stringify(data), { status, headers: corsHeaders() });
    const error = (msg: string, status = 400): Response => json({ error: msg }, status);

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const db = getSupabase(env);

    try {
      // GET /health — ping anti-pausa do Supabase (tambem usado por cron)
      if (req.method === 'GET' && path === '/health') {
        const { data } = await db.from('services').select('id').limit(1);
        return json({ ok: true, supabase: Array.isArray(data) }, 200);
      }

      // GET /services — catalogo PUBLICO p/ o form (sem precos)
      if (req.method === 'GET' && path === '/services') {
        const services = await listPublicServices(db);
        return json(services);
      }

      // GET /orcamento/:codigo — status/publico do pedido
      if (req.method === 'GET' && path.startsWith('/orcamento/')) {
        const codigo = path.split('/')[2];
        const orc = await getOrcamento(db, codigo);
        if (!orc) throw new ApiError('Orcamento nao encontrado', 404);
        return json({ codigo: orc.codigo, status: orc.status, valor: orc.valor });
      }

      // POST /orcamento — submit unico: registra dados + confirma solicitacao
      if (req.method === 'POST' && path === '/orcamento') {
        const body = await readJson<Partial<QuoteRequest>>(req);
        assertQuoteValid(body);

        const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
        const retryAfter = checkRate(ip);
        if (retryAfter !== null) {
          const resp = error('Muitas solicitacoes. Tente novamente em alguns minutos.', 429);
          resp.headers.set('Retry-After', String(Math.ceil(retryAfter / 1000)));
          return resp;
        }

        const services = await listServices(db);
        const { lines, subtotal, urgenciaFactor, total } = computeTotal(body, services, langFrom());

        if (lines.length === 0) throw new ApiError('Nenhum item valido na solicitacao', 422);

        const codigo = shortCode();
        const orcamento = {
          codigo,
          nome: body.nome.trim(),
          email: body.email.trim(),
          whatsapp: body.whatsapp?.trim() ?? null,
          cpf_cnpj: body.cpf_cnpj?.trim() ?? null,
          status: 'PENDENTE' as const,
          itens: body.itens,
          valor: Math.round(total * 100) / 100,
          urgencia: body.urgencia ?? 'normal',
          descricao: body.descricao?.trim() ?? null,
        };

        await insertOrcamento(db, orcamento);

        // Aviso ao dono por email — falha NAO derruba a solicitacao (evita duplicata em retry)
        try {
          await sendEmail(env.BREVO_API_KEY, env.FROM_EMAIL, {
            ...buildOwnerNotice({ orcamento }),
            to: env.OWNER_EMAIL,
          });
        } catch (e) {
          console.error('owner notice falhou:', e);
        }

        return json({
          codigo,
          status: 'PENDENTE',
          valor: orcamento.valor,
          subtotal,
          urgenciaFactor,
          lines,
        }, 201);
      }

      // GET /admin/orcamentos — protegido por Supabase Auth + allowlist de email
      if (req.method === 'GET' && path === '/admin/orcamentos') {
        await requireAdmin(req, db, env);
        const orcs = await listOrcamentos(db);
        return json(orcs);
      }

      // POST /admin/aprovar — aprova/rejeita e, se aprovado, envia PDF por email
      if (req.method === 'POST' && path === '/admin/aprovar') {
        await requireAdmin(req, db, env);
        const body = await readJson<{ codigo?: string; status?: string }>(req);
        if (!body?.codigo || !['APROVADO', 'RECUSADO'].includes(body.status ?? '')) {
          throw new ApiError('Campos obrigatorios: codigo, status (APROVADO|RECUSADO)', 422);
        }

        const orc = await getOrcamento(db, body.codigo!);
        if (!orc) throw new ApiError('Orcamento nao encontrado', 404);

        // Idempotencia/guarda de estado terminal: re-aprovar/re-recusar = no-op; transicao final->outro = 409
        if (orc.status !== 'PENDENTE') {
          if (orc.status === body.status) return json({ codigo: orc.codigo, status: orc.status });
          throw new ApiError(`Orcamento ja esta ${orc.status}`, 409);
        }

        const novoStatus = body.status as OrcamentoRow['status'];
        await updateStatus(db, orc.codigo, novoStatus);

        if (novoStatus === 'APROVADO') {
          // Emails/PDF apos persistir — falha NAO vira 500 (status ja comitado; sem duplicata em retry)
          try {
            const { lines, subtotal, urgenciaFactor } = await recomputePrice(orc, db);
            const urgenciaLabel =
              orc.urgencia === 'muito_urgente' ? 'muito urgente' : orc.urgencia === 'urgente' ? 'urgente' : 'normal';

            const pdf = await buildQuotePdf({
              codigo: orc.codigo,
              nome: orc.nome,
              email: orc.email,
              whatsapp: orc.whatsapp,
              cpfCnpj: orc.cpf_cnpj,
              lines,
              subtotal,
              urgenciaFactor,
              urgenciaLabel,
              total: orc.valor,
              descricao: orc.descricao,
              lang: 'pt',
            });

            const clientEmail = buildClientEmail({ orcamento: orc, lines, lang: 'pt' });
            await sendEmail(env.BREVO_API_KEY, env.FROM_EMAIL, {
              ...clientEmail,
              to: orc.email,
              attachmentData: pdf,
              attachmentName: `orcamento-${orc.codigo}.pdf`,
            });

            await sendEmail(env.BREVO_API_KEY, env.FROM_EMAIL, {
              ...buildOwnerNotice({ orcamento: orc }),
              to: env.OWNER_EMAIL,
            });
          } catch (e) {
            console.error('pdf/email de aprovacao falhou (status ja APROVADO):', e);
          }
        }

        return json({ codigo: orc.codigo, status: novoStatus });
      }

      throw new ApiError('Rota nao encontrada', 404);
    } catch (e) {
      if (e instanceof ApiError) return error(e.message, e.status);
      console.error('erro interno do worker:', e);
      return error('Erro interno do servidor', 500);
    }
  },
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    // Cron: mantem o projeto Supabase ativo (anti-pausa)
    try {
      const db = getSupabase(env);
      await db.from('services').select('id').limit(1);
    } catch {
      // falha silenciosa no cron
    }
  },
};