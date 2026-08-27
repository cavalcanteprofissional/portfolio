import { SERVICES } from '../data/services';
import type { Service } from '../data/services';
import type { Urgencia } from './pricing';

const WORKER_URL = (import.meta.env.VITE_WORKER_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export interface SubmitQuoteInput {
  nome: string;
  email: string;
  whatsapp?: string;
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
    const data = (await res.json()) as Service[];
    if (!Array.isArray(data) || data.length === 0) return SERVICES;
    return data.filter((s) => s.active !== false);
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
  const res = await fetch(`${WORKER_URL}/orcamento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? 'Erro ao enviar solicitação');
  }
  return data as SubmitQuoteResult;
}
