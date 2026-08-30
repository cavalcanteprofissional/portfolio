import { SERVICES } from '../data/services';
import type { Service } from '../data/services';
import type { Urgencia } from './pricing';

const WORKER_URL = (import.meta.env.VITE_WORKER_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export interface SubmitQuoteInput {
  nome: string;
  email: string;
  whatsapp?: string;
  cpf_cnpj?: string;
  itens: { slug: string; qtd: number }[];
  urgencia: Urgencia;
  descricao?: string;
}

export interface SubmitQuoteResult {
  codigo: string;
  status: string;
  valor: number;
}

function available(): boolean {
  return Boolean(WORKER_URL) && WORKER_URL.startsWith('http');
}

export async function fetchServices(): Promise<Service[]> {
  if (!available()) return SERVICES;
  try {
    const res = await fetch(`${WORKER_URL}/services`);
    if (!res.ok) return SERVICES;
    const data = (await res.json()) as Array<Service & Record<string, unknown>>;
    if (!Array.isArray(data) || data.length === 0) return SERVICES;
    // Remove qualquer campo sensivel (precos) retornado pelo Worker —
    // o front nunca deve expor valores de servicos.
    return data
      .filter((s) => s.active !== false)
      .map(({ base_price: _bp, complexity: _c, estimated_days: _ed, ...rest }) => ({
        slug: rest.slug,
        name: rest.name,
        description: rest.description,
        repo: rest.repo,
      }));
  } catch {
    return SERVICES;
  }
}

export async function submitOrcamento(input: SubmitQuoteInput): Promise<SubmitQuoteResult> {
  // Sem Worker configurado: responde localmente (demonstração)
  if (!available()) {
    const codigo = `ORC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await new Promise((r) => setTimeout(r, 600));
    return { codigo, status: 'PENDENTE', valor: 0 };
  }
  const res = await wf('/orcamento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return (await res.json()) as SubmitQuoteResult;
}

export interface AdminOrcamento {
  codigo: string;
  nome: string;
  email: string;
  whatsapp?: string | null;
  cpf_cnpj?: string | null;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  itens: { slug: string; qtd: number }[];
  valor: number;
  urgencia: string;
  descricao?: string | null;
  created_at: string;
}

async function wf(path: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${WORKER_URL}${path}`, init);
  } catch {
    throw new Error(
      `Não foi possível conectar ao servidor de orçamentos (${WORKER_URL}). ` +
        `Verifique sua conexão ou o CORS — origem atual: ${window.location.origin}`,
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Erro do servidor (${res.status})`);
  }
  return res;
}

export async function adminListOrcamentos(token: string): Promise<AdminOrcamento[]> {
  const res = await wf('/admin/orcamentos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await res.json()) as AdminOrcamento[];
}

export async function adminAprovar(
  token: string,
  codigo: string,
  status: 'APROVADO' | 'RECUSADO',
): Promise<void> {
  const res = await wf('/admin/aprovar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ codigo, status }),
  });
  await res.json().catch(() => ({}));
}
