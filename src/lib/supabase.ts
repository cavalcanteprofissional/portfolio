import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Client de AUTENTICACAO (Admin). Usa a key anon publica.
// Dados sensiveis (orcamentos) NAO passam por este client (sem RLS);
// o Admin le/grava atraves do Worker com o token de sessao.
export const supabase = url && anon ? createClient(url, anon) : null;

export function getSupabaseClient() {
  if (!supabase) throw new Error('Supabase não configurado (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY)');
  return supabase;
}
