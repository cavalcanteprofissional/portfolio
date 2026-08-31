-- =============================================================================
-- Portfolio Cavalcante — Supabase schema
-- Princípio de segurança: RLS restritivo por padrão.
-- - `services`  : somente LEITURA pública (lista exibida no formulario).
-- - `orcamentos`: nenhuma policy -> anon/autenticado NÃO acessa.
--                 Somente o Cloudflare Worker (service_role, bypasseia RLS) lê/grava.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- services
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,          -- identificador do serviço (ex.: 'dashboard')
  name             jsonb not null,                -- { pt, en, es }
  description      jsonb,                         -- { pt, en, es }
  repo             text,                          -- repo público de origem (opcional)
  base_price       numeric not null,              -- R$ base
  complexity       numeric not null default 1.0,  -- 1.0 / 1.3 / 1.6
  estimated_days   int,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

alter table public.services enable row level security;

-- Leitura publica expoe SOMENTE campos publicos via view services_public.
-- Precos (base_price/complexity/estimated_days) NAO sao acessiveis ao anon/authenticated.
drop policy if exists "services_public_read" on public.services;

revoke all on table public.services from anon;
revoke all on table public.services from authenticated;

create or replace view public.services_public
  with (security_invoker = false) as
  select slug, name, description, repo, active
  from public.services
  where active = true;

grant select on public.services_public to anon;
grant select on public.services_public to authenticated;

-- -----------------------------------------------------------------------------
-- orcamentos  (sem policies — acesso somente via service_role)
-- -----------------------------------------------------------------------------
create table if not exists public.orcamentos (
  id          uuid primary key default gen_random_uuid(),
  codigo      text unique not null,              -- código de pedido ex.: ORC-XXXX
  nome        text not null,
  email       text not null,
  whatsapp    text,
  cpf_cnpj    text,                              -- CPF ou CNPJ do cliente
  status      text not null default 'PENDENTE'
              check (status in ('PENDENTE', 'APROVADO', 'RECUSADO')),
  itens       jsonb not null,                    -- [{ slug, qtd }]
  valor       numeric not null,                  -- total calculado em R$
  urgencia    text not null default 'normal',    -- normal / urgente / muito_urgente
  descricao   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz
);

alter table public.orcamentos enable row level security;
-- Intencionalmente sem policy: apenas o Worker (service_role) tem acesso.
-- (O Admin le/grava via /admin/* do Worker, autenticado por token Supabase Auth)
