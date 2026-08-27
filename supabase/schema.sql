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

create policy "services_public_read"
  on public.services
  for select
  using (true);

-- -----------------------------------------------------------------------------
-- orcamentos  (sem policies — acesso somente via service_role)
-- -----------------------------------------------------------------------------
create table if not exists public.orcamentos (
  id          uuid primary key default gen_random_uuid(),
  codigo      text unique not null,              -- código de pedido ex.: ORC-XXXX
  nome        text not null,
  email       text not null,
  whatsapp    text,
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
