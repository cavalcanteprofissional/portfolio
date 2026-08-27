export interface ServiceRow {
  id: string;
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string> | null;
  repo?: string | null;
  base_price: number;
  complexity: number;
  estimated_days?: number | null;
  active: boolean;
}

export interface QuoteItem {
  slug: string;
  qtd: number;
}

export interface QuoteRequest {
  nome: string;
  email: string;
  whatsapp?: string;
  itens: QuoteItem[];
  urgencia?: 'normal' | 'urgente' | 'muito_urgente';
  descricao?: string;
}

export interface OrcamentoRow {
  id: string;
  codigo: string;
  nome: string;
  email: string;
  whatsapp?: string | null;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  itens: QuoteItem[];
  valor: number;
  urgencia: string;
  descricao?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export const URGENCIA_FACTOR: Record<NonNullable<QuoteRequest['urgencia']>, number> = {
  normal: 1.0,
  urgente: 1.2,
  muito_urgente: 1.5,
};

export function shortCode(): string {
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORC-${rnd}`;
}
