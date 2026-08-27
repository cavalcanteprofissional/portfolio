import { SERVICES, type Service } from '../data/services';

export type Urgencia = 'normal' | 'urgente' | 'muito_urgente';

export const URGENCIA_FACTOR: Record<Urgencia, number> = {
  normal: 1.0,
  urgente: 1.2,
  muito_urgente: 1.5,
};

export interface LineItem {
  slug: string;
  name: string;
  unit: number;
  qtd: number;
  subtotal: number;
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function computeQuote(slugs: string[], urg: Urgencia, lang: 'pt' | 'en' | 'es') {
  const lines: LineItem[] = [];
  for (const slug of slugs) {
    const svc = getService(slug);
    if (!svc) continue;
    const unit = svc.base_price * svc.complexity;
    lines.push({
      slug,
      name: svc.name[lang] ?? svc.slug,
      unit,
      qtd: 1,
      subtotal: unit,
    });
  }
  const subtotal = lines.reduce((acc, l) => acc + l.subtotal, 0);
  const urgenciaFactor = URGENCIA_FACTOR[urg];
  const total = subtotal * urgenciaFactor;
  return { lines, subtotal, urgenciaFactor, total };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
