-- =============================================================================
-- Migração — ocultar preços do acesso público (2026-08-30)
-- Onda 1.21 / A7. Aplicar manualmente no SQL Editor do Supabase.
--
-- Antes: `services` tinha RLS "select using (true)" -> anon (chave publicavel do
-- deploy) listava base_price/complexity/estimated_days via REST.
-- Depois: tabela com acesso anonimo revogado + view services_public so com
-- campos publicos (slug, name, description, repo, active).
-- O Worker (service_role) continua lendo a tabela completa (bypasseia RLS/GRANT).
-- =============================================================================

-- 1) Remove a policy antiga (se ainda existir)
drop policy if exists "services_public_read" on public.services;

-- 2) Revoga acesso direto a tabela para as roles publicas
revoke all on table public.services from anon;
revoke all on table public.services from authenticated;

-- 3) View publica: apenas campos nao-sensiveis
create or replace view public.services_public
  with (security_invoker = false) as
  select slug, name, description, repo, active
  from public.services
  where active = true;

-- 4) Concede leitura SOMENTE da view
grant select on public.services_public to anon;
grant select on public.services_public to authenticated;

-- Valide: 
--   select * from public.services_public;            -- sem precos
--   select base_price from public.services;           -- deve falhar como anon (sem privilégio)