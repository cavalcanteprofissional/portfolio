# Plano de Melhorias — 2ª Onda: Performance, SEO, i18n e Qualidade

## Data: 2026-06-15

## Objetivo
Corrigir issues críticas de performance, SEO, internacionalização e qualidade de código.

---

## Progresso

### 🔴 Críticas

| # | Tarefa | Status |
|----|--------|--------|
| C1 | Deletar `src/data/projects. json` (arquivo duplicado com espaço) | ✅ |
| C2 | Expandir Hero description EN/ES (13 → 38 palavras como PT) | ✅ |
| C3 | Traduzir Showcase — usar chaves i18n em vez de hardcoded PT | ✅ |
| C4 | Otimizar foto de perfil — PNG 2.3MB removido, só WebP 28KB | ✅ |
| C5 | Desligar sourcemaps em produção (`vite.config.ts`) | ✅ |
| C6 | Corrigir JSON-LD image URL (faltando `/images/`) | ✅ |
| C7 | **BootScreen fix** — splash fora da `#root` trava "Booting_" + img quebrada | ✅ |
| C7a | ┣ Mover splash para dentro de `#root` (React limpa naturalmente) | ✅ |
| C7b | ┣ Trocar img externa por texto "LC" no preloader CSS (elimina path quebrado) | ✅ |
| C7c | ┣ Remover `useEffect` de remoção da splash do `BootScreen.tsx` | ✅ |
| C7d | ┣ Fallback timeout 5s no `<script>` inline (segurança) | ✅ |
| C7e | ┗ Removido logo do componente (autenticidade de POST de placa-mãe) | ✅ |

### 🟡 Altas

| # | Tarefa | Status |
|---|--------|--------|
| H1 | Adicionar `loading="lazy"` + `width`/`height` em todas imagens | ✅ |
| H2 | Traduzir skip-to-content link + scroll-to-top aria-label | ✅ |
| H3 | Adicionar Error Boundary | ✅ |
| H4 | Corrigir OG meta tags (width/height, URL absoluta) | ✅ |
| H5 | Otimizar `mako.svg` (388KB → 216KB, svgo aplicado) | ✅ |
| H6 | Usar `experience.companyKey` para traduzir nome da empresa | ✅ |

### 🆕 Novos

| # | Tarefa | Status |
|---|--------|--------|
| N1 | Adicionar JobMatch AI ao portfólio (projeto id 14) | ✅ |
| N2 | BootScreen — tela de inicialização estilo BIOS | ✅ |
| N2a | ┣ Criar `BootScreen.tsx` com 30 linhas sequenciais (80ms) e 14 projetos | ✅ |
| N2b | ┣ Integrar em `App.tsx` com `AnimatePresence` + `sessionStorage` | ✅ |
| N2c | ┣ Fundo `bg-background` + overlay `bg-gradient-blue-dark` (match Hero) | ✅ |
| N2d | ┣ Logo `logo-navbar-darkmode.png` centralizada no topo | ✅ |
| N2e | ┣ Preloader CSS inline no `index.html` (sem flash de tela branca) | ✅ |
| N2f | ┣ BootScreen refatorado para BIOS POST autêntico (CPU/RAM/GPU/dispositivos) | ✅ |
| N2g | ┗ Barrel export + TODO.md + build aprovado | ✅ |

### 🔵 Médias

| # | Tarefa | Status |
|---|--------|--------|
| M1 | Code splitting com `React.lazy()` para seções abaixo da dobra | ✅ |
| M2 | Scripts npm: `test`, `typecheck`, `format` | ✅ |
| M3 | Corrigir `Companies.tsx` dark mode — dead code removido | ✅ |
| M4 | Stats derivados dos dados reais em vez de hardcoded | ✅ (substituído por fixo 6+) |
| M5 | Framer Motion respeitar `prefers-reduced-motion` | ✅ |
| M6 | Showcase description completa no i18n (2 frases como CONTENT.md) | ✅ |

### ⚪ Baixas

| # | Tarefa | Status |
|---|--------|--------|
| N3 | Desabilitar seção Showcase temporariamente (removida de App.tsx e Nav) | ✅ |
| N4 | Corrigir anos experiência no Stats — fixo "6+" em vez de cálculo dinâmico | ✅ |
| N5 | Adicionar CD Price Tracker (project.15) — projects.json, i18n, Portfolio, BootScreen, CONTENT.md | ✅ |
| N6 | Mobile UX: aumentar touch targets Hero (px-3 py-2 → px-4 py-3) e Nav (p-2 → p-2.5) | ✅ |
| N7 | Mobile UX: aria-hidden em todos os ícones decorativos (lucide-react) | ✅ |
| N8 | Mobile UX: TechStack tooltip com suporte a click/touch | ✅ |
| N9 | Mobile UX: touch-pan-y no scroll horizontal do Experience | ✅ |
| N10 | Mobile UX: reduzir py-24 → py-16 md:py-24 em seções leves (Languages) | ✅ |
| N11 | Mobile UX: TechStack ícones 64px uniformes (w-16 h-16) + w-8 h-8 | ✅ |
| N12 | Hero: reordenar mobile — Nome → Foto → demais elementos (availability/title/desc/buttons) | ✅ |
| N13 | Nav: logo agora faz smooth scroll ao topo (igual ScrollToTop) | ✅ |
| N14 | BootScreen: AudioContext adiado para primeiro gesto do usuário (elimina warning) | ✅ |

### ⚪ Baixas

| # | Tarefa | Status |
|----|--------|--------|
| L1 | Trocar `key={index}` no TechStack por `tech.name` | ✅ |
| L2 | Inline style do Experience → classe CSS | ✅ |
| L3 | Juntar imports do Footer num único statement | ✅ |
| L4 | Version `1.0.0` no package.json | ✅ |
| R1 | Renomear rota `#portfolio` → `#projects` (Portfolio.tsx, Nav.tsx, e2e) | ✅ |

---

### 🌟 PoolEffect — Glow Background com Mouse Tracking

| # | Tarefa | Status |
|---|--------|--------|
| P1 | Criar `PoolEffect.tsx` — radial-gradient azul seguindo o mouse com lerp suave | ✅ |
| P2 | Export no barrel `components/index.ts` | ✅ |
| P3 | Integrar no `App.tsx` antes do `<main>` | ✅ |
| P4 | Usar `hsl(var(--primary) / X)` para alinhar com tema claro/escuro | ✅ |
| P5 | Verificar typecheck e build | ✅ |

---

### 🗺️ Mapa Blueprint de Fortaleza no Hero

| # | Tarefa | Status |
|---|--------|--------|
| M1 | Mover SVG para `public/images/map/fortaleza-blueprint.svg` | ✅ |
| M2 | Adicionar como background no Hero com opacidade (10% light / 5% dark) | ✅ |
| M3 | Adicionar location card (Fortaleza/CE) na coluna direita (desktop) | ✅ |
| M4 | Trocar cor do ping dot de verde para `bg-primary` | ✅ |
| M5 | Reorganizar Hero: unificar imports, remover foto duplicada, mobile/desktop | ✅ |
| M6 | Verificar typecheck e build | ✅ |

---

### 🚨 Hotfix — GitHub Pages Tela Branca (2026-07-25)

| # | Tarefa | Status |
|---|--------|--------|
| F1 | Merge do commit remoto `deb71ab` (status field) no branch local divergente | ✅ |
| F2 | Garantir `base: '/portfolio-cavalcante/'` no `vite.config.ts` (bate com nome do repo) | ✅ |
| F3 | Push para `origin/main` — workflow deploy corrige o GitHub Pages | ✅ |

**Causa:** branches divergidas — remoto tinha `base: '/portfolio/'` mas o site serve em `/portfolio-cavalcante/`, gerando 404 em todos os assets JS/CSS.

---

## V1 Concluída (17 tarefas)
- FAQ JSON-LD, icon map, dead code, Showcase section, Nav ativo, overlay, scroll-to-top, divisores, card width, dark mode logos, skip-to-content, reduced-motion, Nav/Hero separados, Playwright E2E, OG card image (WhatsApp thumbnail), robots.txt (permite facebookexternalhit), migrar URLs do domínio personalizado para github.io

---

### 🚀 Pipeline de Currículo (PT/EN/ES → PDF)

| # | Tarefa | Status |
|---|--------|--------|
| CV1 | Registrar plano no TODO.md | ✅ |
| CV2 | Mover `curriculo-fonte.md` e `SKILL-pipeline-curriculo.md` para `resume/` | ✅ |
| CV3 | Criar `resume/overrides.en.yml` e `resume/overrides.es.yml` (vazios) | ✅ |
| CV4 | Criar `resume/template.html` (layout CV HTML/CSS, paleta portfólio) | ✅ |
| CV5 | Criar `resume/translate.py` (MarianMT + glossário + overrides) | ✅ |
| CV6 | Criar `resume/render_pdf.py` (Playwright → PDF A4) | ✅ |
| CV7 | Criar `resume/build.py` (orquestrador: parse → traduz → renderiza) | ✅ |
| CV8 | Atualizar `.gitignore` (resume/output/, public/cv/*.pdf) | ✅ |
| CV9 | Remover PDFs antigos `public/documents/resumes/` | ✅ |
| CV10 | Integrar steps Python no `deploy.yml` (antes do npm ci) | ✅ |
| CV11 | Atualizar i18n paths dos CVs (`/cv/cv_{lang}.pdf`) | ✅ |
| CV12 | Atualizar `Hero.tsx` — botões CV por idioma (PT/EN/ES) | ✅ |
| CV13 | Validar PDFs gerados e links no frontend | ✅ |
| CV14 | Hero: voltar para 1 botão CV dinâmico por idioma (remover 3 botões) | ✅ |
| CV15 | Bug: `cargo` em experiencia_profissional não é traduzido (EN/ES) | ✅ |
| CV16 | Bug: tradução MarianMT com artefatos de encoding (ex: "experienceCIa", "EatCIal", "TechniCIan") — melhorar qualidade ou usar override manual | ⬜ |