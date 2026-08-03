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
| CV5 | Criar `resume/translate.py` (mBART-large-50 + glossário + overrides) | ✅ |
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
| CV16 | ~~Bug: tradução MarianMT com artefatos de encoding ("experienceCIa")~~ Resolvido: trocado para mBART-large-50 | ✅ |
| CV17 | Qualidade mBART: frases curtas sem contexto ainda paraphraseiam (ex: "Formacao" → "Academic Formula") — usar overrides.en.yml/es.yml | ⬜ |
---

### 🚨 Hotfix — Deploy quebrado: mBART tokenizer sem protobuf/tiktoken (2026-07-28)

| # | Tarefa | Status |
|---|--------|--------|
| D1 | Adicionar `protobuf` e `tiktoken` ao `pip install` no `deploy.yml` | ✅ |

**Causa:** O tokenizer do `facebook/mbart-large-50-many-to-many-mmt` precisa de `protobuf` (SentencePieceExtractor) e `tiktoken` (leitura do arquivo `.tiktoken`) em tempo de execução. O CI instalava apenas `transformers torch sentencepiece sacremoses jinja2 python-frontmatter pyyaml playwright` — sem esses dois pacotes, o `resume/build.py` quebrava com `ImportError` e `ModuleNotFoundError`.

---

### 🧰 TechStack — Agrupamento + Grade Responsiva (2026-08-02)

| # | Tarefa | Status |
|---|--------|--------|
| T1 | Agrupar 28 techs em 6 grupos (Linguagens, IA/ML, Data Science, Frontend, Backend, DevOps) | ✅ |
| T2 | Adicionar labels dos grupos em i18n pt/en/es (`techstack.groups.*`) | ✅ |
| T3 | Grade responsiva dos cards: mobile 2×3 (`grid-cols-2`), desktop/tablet 3×2 (`md:grid-cols-3`), sem card, `items-start` | ✅ |
| T4 | Verificar typecheck e build | ✅ |
| T5 | Título dos grupos com altura fixa (`min-h-12`) + centralizado verticalmente — alinha a 1ª linha de ícones entre cards (fix Data Science × Frontend no mobile) | ✅ |
| T6 | Grade interna de ícones por card: 3 por linha (md+) / 2 por linha (mobile), colunas `auto` + `justify-center` (ícones agrupados, não esticados) | ✅ |
| T7 | Forçar exatamente 2 linhas de ícones por card no desktop (`lg:grid-rows-[repeat(2,4rem)]`) | ✅ |
| T8 | Aplicar 2 linhas + 3 colunas também no tablet (`md:`), com `md:gap-2` para caber em 768px | ✅ |
| T9 | Verificar typecheck e build | ✅ |
| T10 | Remover Power BI do grupo Data Science (5 techs no grupo) — sem evidência de uso em projetos | ✅ |
| T11 | Remover import `FaChartBar` (agora sem uso) e verificar typecheck e build | ✅ |

---

### 🎬 BootScreen — Preloader Proporcional ao Carregamento (2026-08-02)

| # | Tarefa | Status |
|---|--------|--------|
| B1 | Pacing proporcional: `CHAR_DELAY` derivado do total de caracteres para preencher piso de 2500ms (legível, nunca flash) | ✅ |
| B2 | `loaded` via `document.readyState`/`window.load` + fallback — boot só termina após página carregada | ✅ |
| B3 | Auto-proceed `loaded && elapsed >= MIN_BOOT_MS` (intervalo 100ms) + skip manual preservado (tecla/clique) | ✅ |
| B4 | Animações de entrada: Nav `y:-80`, Hero `y:60`, Footer `y:40 + scale:.97` (ease `[0.16,1,0.3,1]`) | ✅ |
| B5 | Nav/Hero/Footer montados apenas após `booted` (`{booted && ...}` — sem flash de seções durante o boot) | ✅ |
| B6 | Centralizar prontidão no `App.tsx`: `resourcesReady` = `window.load` + todos os chunks lazy (Companies→Contact) + fallback 8s | ✅ |
| B7 | BootScreen recebe prop `ready` (removeu controle `loaded` interno duplicado); auto-proceed agora `ready && elapsed >= 2500ms` | ✅ |
| B8 | Verificar typecheck e build | ✅ |

---

### 🎬 BootScreen — Overhaul: Tela Cheia, CRT, Som e Conteúdo (2026-08-02)

#### 🔴 Fix — Assimetria / Bugs
| # | Tarefa | Status |
|---|--------|--------|
| F1 | Normalizar indentação das linhas de módulos — `jobmatch-ai`/`cd-price-tracker` com 4 espaços extras vs. demais | ✅ |
| F2 | Unificar áudio: reusar `window.__bootAudioCtx` (index.html) em vez de criar AudioContext paralelo; ouvir `pointerdown`+`keydown` | ✅ |

#### 🖥️ Tela Cheia Ponta a Ponta (Responsive)
| # | Tarefa | Status |
|---|--------|--------|
| R1 | Trocar container `max-w-xl` por `w-full` com padding responsivo (`px-3 sm:px-8 lg:px-16 py-8 sm:py-12`) | ✅ |
| R2 | Fonte responsiva por viewport: `text-[11px] sm:text-sm md:text-base lg:text-lg` — linha mais longa não estoura no mobile | ✅ |
| R3 | Moldura de "monitor": frame inset com `border` + glow em `--primary` | ✅ |

#### 🎨 Visual CRT (Paleta do Portfólio)
| # | Tarefa | Status |
|---|--------|--------|
| V1 | Scanlines: overlay `repeating-linear-gradient`, `pointer-events-none` | ✅ |
| V2 | Vignette CRT: `radial-gradient` escurecendo cantos | ✅ |
| V3 | Flicker sutil em keyframes + desabilitado em `prefers-reduced-motion` | ✅ |
| V4 | Glow do texto: `text-shadow` em hsl `--primary` | ✅ |
| V5 | `[OK]` ciano com pop de escala ao aparecer (separado do texto digitado) | ✅ |

#### 📝 Conteúdo das Linhas
| # | Tarefa | Status |
|---|--------|--------|
| C1 | Adicionar `linktree-cavalcante [Next.js + Three.js]` (16º módulo, alinha com `projects.json` id 16) | ✅ |
| C2 | Bump de versão da última linha: `v2.4.1` → `v2.5.0` | ✅ |
| C3 | Linhas estruturadas `{ text, dots, ok, type }` com indentação consistente | ✅ |

#### 🔊 Som — POST + Chime, Mutável
| # | Tarefa | Status |
|---|--------|--------|
| S1 | Criar `bootSound.ts`: `beep(freq, dur, type, vol)` com envelope de ganho | ✅ |
| S2 | Beep de POST (~1kHz, 100ms) ao completar o POST | ✅ |
| S3 | Chime de boas-vindas (3 tons) quando o boot termina | ✅ |
| S4 | Mudo com botão `Volume2`/`VolumeX`, persistido em `localStorage` | ✅ |
| S5 | Áudio só inicia após 1º gesto (`pointerdown`/`keydown`) — autoplay preservado | ✅ |

#### ⏱️ Timing / Pacing
| # | Tarefa | Status |
|---|--------|--------|
| T1 | Velocidade por tipo de linha: hardware mais lento, módulos/headers rápidos (steps fixos por tipo) | ✅ |
| T2 | `[OK]` com delay: digitar nome + dots → pausa → `[OK]` ciano com pop | ✅ |
| T3 | Pacing determinístico com `TICK_MS` (4ms) + `TYPE_STEP` por tipo — corrige clamp de setTimeout; piso de 2800ms | ✅ |
| T4 | Manter auto-proceed `ready && elapsed >= MIN_BOOT_MS` + skip manual | ✅ |

#### 🧪 Verificação
| # | Tarefa | Status |
|---|--------|--------|
| B1 | `npm run typecheck` e `npm run build` | ✅ |
| B2 | Atualizar `CHANGELOG.md` (bump `1.6.1` → `1.7.0`) | ✅ |

---

### 🎯 Hero — Layout Tablet (2 colunas) + Mobile (ordem preservada) (2026-08-02)

| # | Tarefa | Status |
|---|--------|--------|
| H1 | Grid `lg:grid-cols-2` → `md:grid-cols-2` (2 colunas a partir de 768px) | ✅ |
| H2 | Foto mobile `lg:hidden` → `md:hidden` (some no tablet) | ✅ |
| H3 | Foto desktop `hidden lg:block` → `hidden md:block` (aparece no tablet, coluna direita) | ✅ |
| H4 | Nome `text-4xl md:text-6xl` → `text-4xl lg:text-6xl` (text-6xl estoura coluna do tablet; desktop mantém 6xl) | ✅ |
| H5 | Título `text-xl lg:text-lg lg:whitespace-nowrap` → `text-xl md:text-lg md:whitespace-nowrap` | ✅ |
| H6 | Desktop inalterado (classes de foto/fonte mantidas) | ✅ |
| H7 | Verificar typecheck, build e Playwright DOM (375px / 768px / 1024px, sem overflow) | ✅ |

---

### 🎯 Hero — Mobile centralizado + Badge acima do nome + Bio colapsável + Título curto + Efeito foto LinkTree (2026-08-03)

| # | Tarefa | Status |
|---|--------|--------|
| M1 | Badge "Disponível para projetos" movido para acima do nome em todos os viewports, menor (`text-xs`, `px-3.5 py-1.5`) | ✅ |
| M2 | Mobile: tudo centralizado (`text-center md:text-left` + botões `justify-center md:justify-start`) | ✅ |
| M3 | Mobile: nome "Lucas Cavalcante" abaixo da foto (foto movida para antes do `h1`) | ✅ |
| M4 | Título alterado para "Analista de Dados & IA" em todos os viewports (i18n pt/en/es) | ✅ |
| M5 | Bio mobile com expand/collapse animado, acionada pelo próprio título "Analista de Dados & IA" (chefão + chevron rotaciona, hover scale, estado selected em primary) | ✅ |
| M6 | Desktop/tablet: descrição sempre visível, gatilho/toggle oculto (`md:hidden`) | ✅ |
| M7 | Efeito foto de perfil do LinkTree (`.glow-hover` + overlay escuro com ícone GitHub no hover) aplicado na foto mobile e na lateral, todas as viewports | ✅ |
| M8 | Verificar typecheck, build e Playwright DOM (375px / 768px / 1024px) | ✅ |

---

### 🎯 Hero — Botões (grid 1×2), WhatsApp, efeito foto e badge (2026-08-03)

| # | Tarefa | Status |
|---|--------|--------|
| N1 | Grid de botões 1 coluna × 2 linhas em todas as viewports: linha 1 só email, linha 2 os demais | ✅ |
| N2 | Botão WhatsApp adicionado (`wa.me/5585996859051`, ícone MessageCircle) | ✅ |
| N3 | Garantir exatamente 2 linhas (sem wrap): mobile = círculos de ícone; md+ = pills com texto | ✅ |
| N4 | Desktop/tablet: pills com texto (`text-[10px] lg:text-xs`); email expandido (`px-5 py-3.5`, `max-w-xs md:max-w-md`) | ✅ |
| N5 | Linha 2 com `justify-between` distribuída na mesma largura do email; mobile alinhado à mesma largura (`max-w-xs`) | ✅ |
| N6 | Distância entre as linhas aumentada (`gap-y-6`) | ✅ |
| N7 | Mobile: grid de botões movido para dentro do expand/collapse da bio (0 → 296px); desktop/tablet wrapper `hidden md:block` | ✅ |
| N8 | Efeito foto LinkTree respeita bordas arredondadas — `rounded-2xl` no anchor (glow acompanha os cantos) | ✅ |
| N9 | Badge da assinatura centralizada na borda/quia inferior direita em todas as viewports | ✅ |
| N10 | Verificar typecheck, build e Playwright DOM (320/375/768/1024px) | ✅ |

---

### 🎬 BootScreen — Digitação mais rápida + texto borda a borda + Glow 3x (2026-08-03)

| # | Tarefa | Status |
|---|--------|--------|
| B1 | Acelerar digitação mantendo auto-avanço: `TICK_MS` 4→3ms, steps por tipo (hw 5→7, module/info/footer 8→12, header 10→14), `OK_DELAY` 40→24, `SECTION_PAUSE` 80→60, `LINE_GAP` 12→8, `PROMPT_DELAY` 200→160; `MIN_BOOT_MS` continua 2800ms (prompt ~1.35s antes ~2.18s) | ✅ |
| B2 | Texto borda a borda — remover moldura de "monitor" (frame inset + glow) e paddings laterais (`px-3 sm:px-8 lg:px-16`); container `w-full` edge-to-edge | ✅ |
| B3 | Glow do mouse 3x durante o boot — `PoolEffect` com prop `intense` (tamanho 288→864px, alphas ×3, blur 25→60px, z-[65] sobre a tela de boot); `App.tsx` passa `intense={!booted}` | ✅ |
| B4 | Bump versão do boot `v2.5.0` → `v2.6.0` (BootScreen + CONTENT.md) | ✅ |
| B5 | `CHANGELOG.md` bump `1.8.0` → `1.9.0` | ✅ |
| B6 | Verificar typecheck e build | ✅ |

---

### ✨ Revelação coordenada ao fim do boot — Focus Reveal (2026-08-03)

| # | Tarefa | Status |
|---|--------|--------|
| R1 | Background fade-in (foco de câmera): `<main>` → `motion.main` com `opacity 0→1`, `scale 1.03→1`, `blur(8px)→0` (0.9s, ease `[0.16,1,0.3,1]`) acionado por `booted` | ✅ |
| R2 | Crossfade escuro → tema: overlay `fixed inset-0 z-[45]` cor do boot (`hsl(215 45% 8%)`), `opacity 1→0` (0.8s, delay 0.05) — abaixo do glow intenso (z-65) e do boot (z-50) | ✅ |
| R3 | Glow do mouse "assenta" sem pop: `PoolEffect` com 2 camadas cross-fade (864px/×3/blur 60 ↔ 288px/blur 25, 0.6s) + estado `settling` (container z-[65] por 600ms → z-0) | ✅ |
| R4 | Nav desliza de fora da tela: `y:'-100%'→0` (antes `y:-80`), 0.7s, delay 0.05 | ✅ |
| R5 | Hero com subida + assentamento: `y:80→0` + `scale 0.99→1` (0.8s, delay 0.1); delays dos filhos reduzidos (~0.05s) | ✅ |
| R6 | Footer sobe de baixo (`y:60→0`, delay 0.15) com ícones em stagger de ~30ms | ✅ |
| R7 | Reduced-motion global: `<MotionConfig reducedMotion="user">` no App (opacidade mantida, transform/layout desativados) | ✅ |
| R8 | `CHANGELOG.md` bump `1.9.0` → `1.10.0` | ✅ |
| R9 | Verificar typecheck e build | ✅ |
