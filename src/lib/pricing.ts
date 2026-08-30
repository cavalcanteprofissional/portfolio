export type Urgencia = 'normal' | 'urgente' | 'muito_urgente';

// O valor dos serviços é calculado SOMENTE no Worker/Supabase.
// O front não conhece preços; `formatBRL` aqui é usado apenas no admin
// (que exibe valores vindos do backend).
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
