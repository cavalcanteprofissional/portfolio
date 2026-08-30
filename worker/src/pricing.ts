import { URGENCIA_FACTOR } from './types';
import type { QuoteItem, QuoteRequest, ServiceRow } from './types';

export interface LineItem {
  slug: string;
  name: string;
  unit: number;
  qtd: number;
  subtotal: number;
}

export function resolveItems(
  itens: QuoteItem[],
  services: ServiceRow[],
  lang: 'pt' | 'en' | 'es',
): LineItem[] {
  const map = new Map(services.map((s) => [s.slug, s]));
  const lines: LineItem[] = [];

  for (const item of itens) {
    const svc = map.get(item.slug);
    if (!svc) continue;
    const qtd = Math.max(1, Math.floor(item.qtd || 1));
    const unit = svc.base_price * svc.complexity;
    lines.push({
      slug: svc.slug,
      name: svc.name?.[lang] ?? svc.slug,
      unit,
      qtd,
      subtotal: unit * qtd,
    });
  }

  return lines;
}

export function computeTotal(
  req: Pick<QuoteRequest, 'itens' | 'urgencia'>,
  services: ServiceRow[],
  lang: 'pt' | 'en' | 'es',
): { lines: LineItem[]; subtotal: number; urgenciaFactor: number; total: number } {
  const lines = resolveItems(req.itens, services, lang);
  const subtotal = lines.reduce((acc, l) => acc + l.subtotal, 0);
  const urgenciaFactor = URGENCIA_FACTOR[req.urgencia ?? 'normal'];
  const total = subtotal * urgenciaFactor;
  return { lines, subtotal, urgenciaFactor, total };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
