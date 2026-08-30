import { getSupabase, listServices, insertOrcamento, getOrcamento, updateStatus, listOrcamentos } from './supabase';
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
}

const GITHUB_PAGES_ORIGIN = 'https://cavalcanteprofissional.github.io';

const LANG = 'pt'; // orcamento sempre gerado em pt para o cliente

function originAllowed(origin: string | null, env: Env): boolean {
  if (!origin) return false;
  const allowed = (env.ALLOWED_ORIGINS ?? GITHUB_PAGES_ORIGIN)
    .split(',')
    .map((o) => o.trim());
  return allowed.includes(origin);
}

function langFrom(req: QuoteRequest): 'pt' | 'en' | 'es' {
  return LANG;
}

async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error('Body invalido');
  }
}

async function requireAdmin(req: Request, db: ReturnType<typeof getSupabase>): Promise<void> {
  const auth = req.headers.get('Authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('Não autorizado');
  const { data, error } = await db.auth.getUser(token);
  if (error || !data?.user) throw new Error('Não autorizado');
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

      // GET /services — lista publica de servicos p/ o form
      if (req.method === 'GET' && path === '/services') {
        const services = await listServices(db);
        return json(services);
      }

      // GET /orcamento/:codigo — status/publico do pedido
      if (req.method === 'GET' && path.startsWith('/orcamento/')) {
        const codigo = path.split('/')[2];
        const orc = await getOrcamento(db, codigo);
        if (!orc) return error('Orcamento nao encontrado', 404);
        return json({ codigo: orc.codigo, status: orc.status, valor: orc.valor });
      }

      // POST /orcamento — submit unico: registra dados + confirma solicitacao
      if (req.method === 'POST' && path === '/orcamento') {
        const body = await readJson<QuoteRequest>(req);
        if (!body?.nome || !body?.email || !Array.isArray(body?.itens) || body.itens.length === 0) {
          return error('Campos obrigatorios: nome, email, itens');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
          return error('Email invalido');
        }

        const services = await listServices(db);
        const { lines, subtotal, urgenciaFactor, total } = computeTotal(body, services, langFrom(body));

        if (lines.length === 0) {
          return error('Nenhum item valido na solicitacao', 422);
        }

        const codigo = shortCode();
        const orcamento = {
          codigo,
          nome: body.nome,
          email: body.email,
          whatsapp: body.whatsapp ?? null,
          cpf_cnpj: body.cpf_cnpj ?? null,
          status: 'PENDENTE' as const,
          itens: body.itens,
          valor: Math.round(total * 100) / 100,
          urgencia: body.urgencia ?? 'normal',
          descricao: body.descricao ?? null,
        };

        await insertOrcamento(db, orcamento);

        // Aviso ao dono por email
        await sendEmail(env.BREVO_API_KEY, env.FROM_EMAIL, {
          ...buildOwnerNotice({ orcamento }),
          to: env.OWNER_EMAIL,
        });

        return json({
          codigo,
          status: 'PENDENTE',
          valor: orcamento.valor,
          subtotal,
          urgenciaFactor,
          lines,
        }, 201);
      }

      // GET /admin/orcamentos — protegido por Supabase Auth (admin)
      if (req.method === 'GET' && path === '/admin/orcamentos') {
        await requireAdmin(req, db);
        const orcs = await listOrcamentos(db);
        return json(orcs);
      }

      // POST /admin/aprovar — aprova/rejeita e, se aprovado, envia PDF por email
      if (req.method === 'POST' && path === '/admin/aprovar') {
        await requireAdmin(req, db);
        const body = await readJson<{ codigo?: string; status?: string }>(req);
        if (!body?.codigo || !['APROVADO', 'RECUSADO'].includes(body.status ?? '')) {
          return error('Campos obrigatorios: codigo, status (APROVADO|RECUSADO)');
        }

        const orc = await getOrcamento(db, body.codigo!);
        if (!orc) return error('Orcamento nao encontrado', 404);

        await updateStatus(db, orc.codigo, body.status as OrcamentoRow['status']);

        if (body.status === 'APROVADO') {
          const { lines, total, subtotal, urgenciaFactor } = await recomputePrice(orc, db);
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

          // Aviso ao dono
          await sendEmail(env.BREVO_API_KEY, env.FROM_EMAIL, {
            ...buildOwnerNotice({ orcamento: orc }),
            to: env.OWNER_EMAIL,
          });
        }

        return json({ codigo: orc.codigo, status: body.status });
      }

      return error('Rota nao encontrada', 404);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro interno';
      return error(msg, 500);
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
