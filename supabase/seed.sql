-- =============================================================================
-- Portfolio Cavalcante — Seed da tabela `services`
-- Fonte da verdade de preços no backend. Rodar APÓS `schema.sql`.
-- Idempotente: ON CONFLICT (slug) DO NOTHING — não sobrescreve ajustes manuais.
-- Preços/multiplicadores aprovados pelo usuário (2026-08-29).
-- =============================================================================

insert into public.services (slug, name, description, repo, base_price, complexity, estimated_days, active)
values
  (
    'dashboard',
    '{"pt":"Dashboard Interativo","en":"Interactive Dashboard","es":"Dashboard Interactivo"}',
    '{"pt":"Dashboard com visualizações e KPIs sob medida.","en":"Custom dashboard with visualizations and KPIs.","es":"Dashboard con visualizaciones y KPIs a medida."}',
    'labgas-manager',
    1500, 1.0, 15, true
  ),
  (
    'chatbot-ia',
    '{"pt":"Chatbot IA (RAG)","en":"AI Chatbot (RAG)","es":"Chatbot IA (RAG)"}',
    '{"pt":"Chatbot com RAG para responder sobre sua base de conhecimento.","en":"RAG chatbot answering from your knowledge base.","es":"Chatbot RAG que responde desde tu base de conocimiento."}',
    'chatbot-oficina',
    2500, 1.0, 20, true
  ),
  (
    'analise-bi',
    '{"pt":"Análise de Dados / BI","en":"Data Analysis / BI","es":"Análisis de Datos / BI"}',
    '{"pt":"Análise exploratória e relatórios de inteligência.","en":"Exploratory analysis and intelligence reports.","es":"Análisis exploratorio e informes de inteligencia."}',
    null,
    1200, 1.0, 10, true
  ),
  (
    'automacao',
    '{"pt":"Automação / Pipeline","en":"Automation / Pipeline","es":"Automatización / Pipeline"}',
    '{"pt":"Pipeline de dados e automação de processos.","en":"Data pipeline and process automation.","es":"Pipeline de datos y automatización de procesos."}',
    null,
    1800, 1.0, 12, true
  )
on conflict (slug) do nothing;
