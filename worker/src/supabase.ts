import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { OrcamentoRow, ServiceRow } from './types';

export function getSupabase(env: {
  SUPABASE_URL: string;
  SERVICE_ROLE_KEY: string;
}): SupabaseClient {
  // service_role: bypasseia RLS — usado SOMENTE no lado servidor (Worker).
  // A chave vem do secret `SERVICE_ROLE_KEY`, nunca do bundle.
  return createClient(env.SUPABASE_URL, env.SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function listServices(db: SupabaseClient): Promise<ServiceRow[]> {
  const { data, error } = await db
    .from('services')
    .select('*')
    .eq('active', true)
    .order('base_price');
  if (error) throw new Error(`listServices: ${error.message}`);
  return data as ServiceRow[];
}

export type OrcamentoInsert = Pick<
  OrcamentoRow,
  'codigo' | 'nome' | 'email' | 'itens' | 'valor'
> &
  Partial<Pick<OrcamentoRow, 'whatsapp' | 'urgencia' | 'descricao'>> & {
    status: OrcamentoRow['status'];
  };

export async function insertOrcamento(
  db: SupabaseClient,
  row: OrcamentoInsert,
): Promise<void> {
  const { error } = await db.from('orcamentos').insert(row);
  if (error) throw new Error(`insertOrcamento: ${error.message}`);
}

export async function getOrcamento(
  db: SupabaseClient,
  codigo: string,
): Promise<OrcamentoRow | null> {
  const { data, error } = await db
    .from('orcamentos')
    .select('*')
    .eq('codigo', codigo)
    .maybeSingle();
  if (error) throw new Error(`getOrcamento: ${error.message}`);
  return (data as OrcamentoRow) ?? null;
}

export async function updateStatus(
  db: SupabaseClient,
  codigo: string,
  status: OrcamentoRow['status'],
): Promise<void> {
  const { error } = await db
    .from('orcamentos')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('codigo', codigo);
  if (error) throw new Error(`updateStatus: ${error.message}`);
}
