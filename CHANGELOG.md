# Changelog

## [1.15.1] - 2026-08-21

### 🎨 Favicon da marca (esfera neon) + 🔊 Áudio do boot

- 🪩 **Ícones com arte própria** — monograma "LC" substituído pela esfera azul reluzente em neon desenhada no Illustrator (arte mestre `branding/favicon.ai`, export 512×512 `public/icons/logo-512.png`); abas mantêm a esfera flutuante com transparência
- ⚙️ **Pipeline de ícones** — novo `scripts/generate-icons.mjs` (script `npm run icons`): deriva `favicon.ico` **real** (ICONDIR binário + 3 entradas PNG embutidas 16/32/48 — substitui o PNG renomeado legado), `icon-192/512` (alfa preservado) e versões opacas compostas sobre o navy da marca `#0F172A` (`icon-180` apple-touch + `maskable-192/512` com zona segura); composição automática de fundo à prova de exports futuros com ou sem alfa
- 📱 **Manifest PWA completo** — `background_color #0F172A` + ícones `purpose: maskable` adicionados ao `site.webmanifest`
- 🔊 **Som inicial do boot** — `playBootStart()`: whoosh de **ruído branco filtrado** com varredura ascendente 160→2800 Hz (~320 ms, envelope de swell) no início da animação — único som não tonal da paleta, timbre impossível de confundir com o arpejo dos [OK], POST beep ou chime; guarda por ref contra double-mount do StrictMode
- 🎵 **Arpejo por [OK]** — `playOkBlip(step)`: pentatônica ascendente de A maior em ciclo (A5·B5·C#6·E6·F#6 · triangle · 45 ms · vol ~0.055), uma nota por linha concluída; beep do POST e chime final preservados; mute respeitado nos novos sons
- 🚫 **`.gitignore`** — `/branding/` inteiro ignorado exceto as fontes `*.ai` (`!/branding/*.ai`): exports e temporários do Illustrator (ex.: `branding/1x/`) nunca mais exigem limpeza manual; fonte `.ai` segue versionada; regras globais `~ai-*.tmp` mantidas para temps fora de branding/
- 📋 **`checklist-pre-deploy.md` incorporado ao `TODO.md`** (seção "📋 Checklist Pré-Deploy — Auditoria completa") e arquivo removido; conteúdo integral preservado (20 itens, tabela de pendências, métricas Lighthouse), seção meta "Instruções para o opencode" descartada
- 🗂️ **Housekeeping** — plano da sessão consolidado como onda H no TODO.md; diretório `.opencode/` removido; README com seção Arquitetura nova e Branding expandida (spec dos arquivos de `branding/`)
- 🚫 **`.gitignore`** — temporários do Adobe Illustrator ignorados (`~ai-*.tmp`), fonte `.ai` permanece versionada em `branding/`; diretório temporário de export `1x/` removido
- 🧪 **E2E ampliados (24 → 28 testes dos artefatos)** — `.ico` validado byte a byte (ICONDIR + assinatura PNG das entradas + dimensões IHDR), opacidade total de apple-touch/maskable via sharp, manifest com `background_color` e purposes `any`/`maskable`
- ✅ Typecheck, lint, build e Playwright **48/48** verificados (24 originais + 24 dos artefatos, `--workers=1`)

## [1.15.0] - 2026-08-21

### 🚀 Checklist Pré-Deploy — Correções da auditoria (itens de esforço baixo)

- 🧭 **404 SPA fallback** — plugin Vite `gh-pages-spa-404` (`closeBundle`) copia `dist/index.html` → `dist/404.html` no fim do build; rotas inexistentes no GitHub Pages agora servem o app em vez da 404 padrão (funciona local e no CI sem alterar o deploy.yml)
- 🗺️ **Sitemap.xml** — `public/sitemap.xml` criado com a URL canônica do site + linha `Sitemap:` no `robots.txt` (submissão ao Search Console permanece manual)
- 🔣 **Ícones PWA completos** — `apple-touch-icon` 180×180 e ícones 192/512 gerados com sharp (monograma "LC" sobre gradiente sky, coerente com o splash de boot e o `theme-color #0ea5e9`) + `site.webmanifest`; links adicionados ao `index.html`
- 💬 **WhatsApp pré-preenchido** — nova chave i18n `cta.whatsappMsg` (pt/en/es) aplicada nos 3 links `wa.me` (Hero, Contact, Footer) via `encodeURIComponent`; arrays de links movidos para dentro dos componentes onde dependem de `t()`
- 🔗 **Links padronizados** — Lattes `http://` → `https://` e slug do LinkedIn unificado (`cavalcante-Lucas` no Footer, Contact, index.html **e agora também nas chaves i18n `contact.linkedin`**, que usavam `cavalcante-lucas`)
- 🧪 **E2E dos artefatos** — novo `e2e/artifacts.spec.ts` (10 testes × chromium/mobile): igualdade `404.html` ≡ `index.html`, schema do sitemap, linha `Sitemap:` no robots, JSON do manifest com ícones existentes, dimensões reais dos PNGs (IHDR), acessibilidade HTTP dos artefatos e mensagens `wa.me` decodificáveis por idioma
- 🔧 **Links root-relative no `index.html`** — favicon/ícones/manifest passam a usar `/...` (Vite injeta a base no build); elimina a duplicação `/portfolio-cavalcante/portfolio-cavalcante/...` que o dev server aplicava sobre os hrefs já prefixados
- 📝 **Plano e relatório** — onda registrada no TODO.md (D1–D12) e pendências remanescentes atualizadas no `checklist-pre-deploy.md` (13 resolvidos · 7 pendentes: GA4+cookies, política LGPD no rodapé, domínio próprio, headers de segurança e testes manuais)
- ✅ Typecheck, lint, build (artefatos 404/sitemap/manifest/ícones conferidos em `dist/`) e Playwright **44/44** verificados (24 originais + 20 dos artefatos, `--workers=1`)

## [1.14.0] - 2026-08-12

### 🐛 Fix — Cards da seção Projetos invisíveis no mobile

- 📱 **Bug corrigido** — os cards de projeto não apareciam apenas no viewport mobile (desktop/tablet funcionavam)
- 🔍 **Causa raiz** — o `<Stagger>` do grid em `Portfolio.tsx` usa `viewport.amount: 0.2` (20% do elemento deve estar visível para disparar o `whileInView`). No mobile o grid vira 1 coluna com 17 cards (~8000px+), então 20% (~1600px) nunca cabe no viewport (~700px) → o limiar nunca era atingido → os cards ficavam em `opacity: 0`
- ✅ **Correção (Opção A)** — `amount={0}` no `<Stagger>` do grid de projetos: dispara assim que qualquer parte do grid entra no viewport, mantendo o stagger e sem afetar outras seções
- 🧪 Typecheck, build e verificação visual em viewport mobile confirmados

## [1.13.0] - 2026-08-04

### 🔐 HF_TOKEN funcional + Lint configurado + E2E 24/24

- 🔑 **`HF_TOKEN` deixa de ser placebo** — `resume/translate.py` ganhou `_load_env_local()` que carrega `.env.local` da raiz sem sobrescrever variáveis do ambiente (CI/GitHub Secret mantém precedência); token real preenchido localmente em `.env.local` (git-ignored, nunca commitado)
- 📝 **`.env.example`** — comentário corrigido: documento do secret usado no CI (`HF_TOKEN` GitHub Secret) + instrução de cópia para `.env.local`; README atualizado para refletir o carregamento automático
- 🧹 **Lint configurado e zerado** — `eslint.config.js` flat criado (`@eslint/js` + `typescript-eslint` + `react-hooks` + `react-refresh`, regras `recommended-latest`); corrigidos `react-hooks/purity`, `react-hooks/refs`, `react-hooks/set-state-in-effect`, `no-empty` e `no-explicit-any`: BootScreen (refs/`performance.now()` movidos p/ effects), bootSound (catch), Nav (removido `mounted`/SSR-vestigial + `currentLang` lazy do localStorage), PoolEffect (setState síncrono → timers), css.d.ts (removido wildcard `*.json` — `resolveJsonModule` infere tipos reais — e declaração morta `./locales/translations`); Experience `handleScroll` em `useCallback`
- 🧪 **Playwright 24/24** — e2e alinhados ao app atual: nav `Showcase`→`Certificações`, removida a seção `#showcase` do teste, footer aguarda montagem (`toBeVisible()`) antes de contar links sociais
- ✅ `npm run lint` (0 erros), typecheck, build e `python -m py_compile resume/translate.py` verificados

## [1.12.0] - 2026-08-04

### 🎬 Framework de Motion Graphics — Motor único motion.dev + Orquestração do boot

- 🔄 **Migração `framer-motion` → `motion/react`** — engine única (Motion.dev, o rebranding oficial do framer-motion); troca mecânica de imports em 16 arquivos, `npm uninstall framer-motion && npm i motion`
- 🧩 **Camada base `src/lib/motion/`** — tokens (`EASE`, durações, `VIEWPORT`, `STAGGER`, `BOOT_TIMELINE`), variantes reutilizáveis (`fadeUp`, `fadeIn`, `scaleIn`, `slideFrom`, `focusReveal`, `staggerContainer/Child`) e componentes `Reveal` (whileInView com direction/delay/blur), `SectionHeader` (título + underline + subtítulo) e `Stagger`/`StaggerItem` (com `forwardRef` p/ scroll containers)
- 🗄️ **`src/stores/bootStore.ts`** — estado do boot centralizado em zustand (`booted`/`setBooted`), substituindo o estado local do `App.tsx` e viabilizando a coreografia
- 🎬 **Orquestração unificada do fim do boot** — `App` usa `focusReveal` no `<main>`; Nav desliza via variants; Hero com `staggerContainer`/`staggerChild` (delays manuais removidos); Stats e Footer sincronizados na `BOOT_TIMELINE`
- ✨ **Seções abaixo da dobra** — linguagem visual "focus reveal" (blur) unificada via `SectionHeader`/`Stagger` em Companies, TechStack, Experience, Portfolio, Skills, Certifications, Languages, FAQ e Contact; padrões inline `initial/whileInView/viewport` repetidos eliminados (~40 ocorrências)
- ✅ Typecheck e build verificados; Playwright: 18/24 na época (6 falhas pré-existentes de `#showcase` e timing do footer — corrigidas na v1.13.0, hoje 24/24)

## [1.11.0] - 2026-08-03

### 🚀 LinkTree Pessoal — Card finalizado + Renome

- ✅ **Status `concluido`** — projeto id 16 (LinkTree) em `src/data/projects.json` agora marcado como concluído (badge "Concluído" no card)
- ✏️ **Renome** — título "LinkTree Cavalcante" → **"LinkTree Pessoal"** no i18n pt/en/es (`src/i18n/index.ts`)
- 📝 **`CONTENT.md`** — seção 8 atualizada: cabeçalho `(15 Projetos)` → `(16 Projetos)` e linha do projeto 16 (LinkTree Pessoal, `concluido`, repo + demo) adicionada nas duas tabelas de projetos
- ✅ Typecheck e build verificados

## [1.10.0] - 2026-08-03

### ✨ Revelação coordenada ao fim do boot — Focus Reveal

- 🎥 **Background fade-in (foco de câmera)** — `<main>` vira `motion.main` com `opacity 0→1`, `scale 1.03→1` e `blur(8px)→0` em 0.9s (ease `[0.16,1,0.3,1]`) quando `booted`; a página inteira "entra em foco" enquanto o boot dissolve
- 🌑 **Crossfade escuro → tema** — overlay `fixed inset-0 z-[45]` na cor do boot (`hsl(215 45% 8%)`) com `opacity 1→0` (0.8s, delay 0.05), por baixo do glow intenso (z-65) e do boot (z-50)
- 🖱️ **Glow do mouse "assenta" sem pop** — `PoolEffect` refatorado com duas camadas cross-fade (intenso 864px/alphas ×3/blur 60 ↔ normal 288px/blur 25, 0.6s); container mantém `z-[65]` por 600ms após o boot (estado `settling`) e depois volta a `z-0`
- 📍 **Nav** — desliza de fora da tela: `y:'-100%'→0` (antes `y:-80`), 0.7s, delay 0.05
- 🚀 **Hero** — subida com assentamento: `y:80→0` + `scale 0.99→1` (0.8s, delay 0.1); delays dos filhos reduzidos (~0.05s) para sincronizar com o fade
- 🦶 **Footer** — sobe de baixo (`y:60→0`, 0.7s, delay 0.15) com ícones sociais em stagger de ~30ms
- ♿ **Reduced-motion global** — `<MotionConfig reducedMotion="user">` no App: mantém fades de opacidade e desativa transform/layout para `prefers-reduced-motion` (cobre a lacuna do framer além do CSS)
- ✅ Typecheck e build verificados

## [1.9.0] - 2026-08-03

### 🎬 BootScreen — Digitação mais rápida, texto borda a borda e glow 3x

- ⏱️ **Digitação ~40% mais rápida** — `TICK_MS` 4→3ms, steps por tipo maiores (hardware 5→7, módulos 8→12, header 10→14) e delays reduzidos (`OK_DELAY` 40→24, `SECTION_PAUSE` 80→60, `LINE_GAP` 12→8, `PROMPT_DELAY` 200→160); prompt "PRESS ANY KEY" aparece em ~1.35s (antes ~2.18s)
- ⏭️ **Auto-avanço mantido** — `MIN_BOOT_MS` continua 2800ms; o tempo total até avançar é o mesmo, com mais tempo de espera no prompt
- 🖥️ **Texto borda a borda** — removida a moldura de "monitor" (frame inset + glow) e os paddings laterais (`px-3 sm:px-8 lg:px-16`); o texto ocupa toda a largura da viewport
- 🖱️ **Glow do mouse 3x no boot** — `PoolEffect` ganha prop `intense`: durante a animação o glow fica visível sobre a tela de boot com tamanho 3x (288→864px) e brilho 3x (alphas ×3), voltando ao normal após o boot
- 📝 **Versão bump** — última linha do boot `v2.5.0` → `v2.6.0` (+ `CONTENT.md`)
- ✅ Typecheck e build verificados

## [1.8.0] - 2026-08-03

### 🎯 Hero — Layout responsivo, interações mobile e botões

- 📐 **Grid tablet** — 2 colunas a partir de 768px (`md:grid-cols-2`); foto mobile some no tablet (`md:hidden`) e a lateral aparece (`hidden md:block`); nome `lg:text-6xl` (desktop mantém 6xl); título `md:text-lg md:whitespace-nowrap`
- 📱 **Mobile centralizado** — coluna `text-center md:text-left`, botões `justify-center md:justify-start`; ordem: badge → foto → nome → título → bio/CTA
- 🏷️ **Badge "Disponível para projetos"** — movido para acima do nome em todos os viewports e menor (`text-xs`, `px-3.5 py-1.5`)
- ✂️ **Título curto** — "Analista de Dados & IA" (pt/en/es: "Data Analyst & AI" / "Analista de Datos & IA") em todas as viewports; key `hero.titleFull` removida
- 🪗 **Bio com expand/collapse (mobile)** — descrição colapsada por padrão; o próprio título "Analista de Dados & IA" é o gatilho (chevron, hover scale, estado selected em primary); botão pill separado removido; desktop/tablet mantêm descrição sempre visível
- 📋 **Grid de botões 1×2** — linha 1 só email; linha 2: LinkedIn, **WhatsApp** (novo, `wa.me/5585996859051`), GitHub e Currículo; sempre exatamente 2 linhas (mobile = círculos de ícone, md+ = pills com texto `text-[10px] lg:text-xs`)
- ↔️ **Distribuição na largura do email** — email expandido (`px-5 py-3.5`, `max-w-xs md:max-w-md`) define a largura; linha 2 com `justify-between` na mesma largura; distância entre linhas aumentada (`gap-y-6`)
- 📱 **Mobile: botões dentro do expand/collapse** — grid de botões movido para dentro da bio colapsável (0 → 296px), renderizado também num wrapper `hidden md:block` para desktop/tablet
- ✨ **Efeito foto de perfil (LinkTree)** — `.glow-hover` (glow azul intensifica no hover) + overlay escuro com ícone GitHub revelado no hover, nas fotos mobile e lateral; hover respeita bordas arredondadas (`rounded-2xl` no anchor)
- 📍 **Badge da assinatura centralizada** — na borda/quia inferior direita da foto (metade dentro/metade fora): `-bottom-10 -right-10` (80px), `-bottom-14 -right-14`/`md:-bottom-16 md:-right-16` (112/128px)
- ✅ Typecheck, build e verificações Playwright DOM (320/375/768/1024px) ok

## [1.7.0] - 2026-08-02

### 🎬 BootScreen — Overhaul: Tela Cheia, CRT, Som e Conteúdo

- 🖥️ **Tela cheia ponta a ponta** — container `max-w-xl` → `w-full` com padding responsivo (`px-3 sm:px-8 lg:px-16`) e fonte por viewport (`text-[11px] sm:text-sm md:text-base lg:text-lg`); moldura de "monitor" com glow em `--primary`
- 🎨 **Efeitos CRT** — scanlines (`repeating-linear-gradient`), vignette radial, flicker sutil (respeita `prefers-reduced-motion`) e glow azul/ciano no texto
- 🟢 **`[OK]` com pop** — status agora aparece separado do texto digitado: nome + dots → pausa → `[OK]` ciano com scale pop
- 🔊 **Som reestruturado** — novo `bootSound.ts`: `AudioContext` único (reusa `window.__bootAudioCtx` do preloader, eliminando contexto paralelo), beep de POST (~1kHz) ao completar o POST e chime de boas-vindas (3 tons) ao terminar; botão de mudo `Volume2`/`VolumeX` persistido em `localStorage`; áudio só após o 1º gesto
- ⏱️ **Pacing determinístico** — steps fixos por tipo de linha (hardware 5, módulos 8 chars/tick em ticks de 4ms), `[OK]` com delay de 40ms, piso de 2800ms; auto-proceed e skip manual preservados
- 📝 **Conteúdo** — adicionado módulo `linktree-cavalcante [Next.js + Three.js]` (16º, alinha com `projects.json`); versão bump `v2.4.1` → `v2.5.0`; indentação normalizada (linhas de módulos uniformes)
- 🔧 **Fixes** — assimetria de indentação nas linhas `jobmatch-ai`/`cd-price-tracker` corrigida; áudio unificado

## [1.6.1] - 2026-08-02

### 🧰 TechStack — Remoção do Power BI

- 🗑️ **Power BI removido** do grupo Data Science & Visualização — sem evidência de uso nos projetos (agora 27 techs no total, 5 no grupo)
- 🧹 **Import `FaChartBar` removido** — sem imports não utilizados
- ✅ Typecheck e build verificados

## [1.6.0] - 2026-08-02

### 🎬 BootScreen — Preloader Proporcional ao Carregamento

- ⏱️ **Duração proporcional ao carregamento real** — o boot agora espera `window.load` + todos os chunks lazy (Companies, TechStack, Experience, Portfolio, Skills, Certifications, Languages, FAQ, Contact), com fallback de 8s; duração = `max(carregamento, 2500ms)`
- ⌨️ **Pacing legível** — `CHAR_DELAY` derivado do total de caracteres em runtime, preenche o piso de 2500ms sem flash e sem arrastar
- 🖥️ **Prontidão centralizada no App** — `resourcesReady` no `App.tsx` substitui o controle `loaded` interno do BootScreen (agora prop `ready`)
- ⏭️ **Skip manual preservado** — tecla ou clique continua pulando o boot a qualquer momento
- ✨ **Animações de entrada** — Nav desce (`y:-80`), Hero sobe (`y:60`), Footer entra com `y:40 + scale:.97` (ease `[0.16,1,0.3,1]`), montados só após o boot — sem flash de seções durante o boot

## [1.5.0] - 2026-08-02

### 🧰 TechStack — Grupos + Grade Responsiva

- 🗂️ **28 techs agrupadas em 6 grupos** — Linguagens, IA & ML, Data Science & Visualização, Frontend, Backend & APIs, DevOps & Deploy
- 🌍 **Rótulos dos grupos i18n** — `techstack.groups.*` traduzidos em pt/en/es
- 📐 **Grade responsiva dos cards** — mobile 2×3 (`grid-cols-2`), tablet/desktop 3×2 (`md:grid-cols-3`), altura conforme conteúdo (`items-start`)
- 🏷️ **Títulos com altura fixa e centralizados** — `min-h-12` + `text-balance`, alinha a 1ª linha de ícones entre cards lado a lado (corrige desalinhamento Data Science × Frontend no mobile)
- 🔲 **Ícones em grade por card** — 3 por linha (md+) / 2 por linha (mobile), colunas `auto` + `justify-center` (ícones agrupados no centro, sem esticar pela largura do card)
- 📏 **2 linhas de ícones forçadas** em tablet e desktop (`md:grid-rows-[repeat(2,4rem)]`) — altura uniforme entre todos os cards, com `md:gap-2` para caber em tablets de 768px

## [1.4.1] - 2026-07-26

### 🔄 Modelo de tradução atualizado (MarianMT → mBART)

- ➕ **mBART-large-50** substitui MarianMT — modelo de 600M params com tradução direta PT→EN e PT→ES (sem chain)
- 🛡️ **Word boundaries no glossário** — termos curtos como "CI" não são mais protegidos dentro de palavras normais (ex: "Experiencia" não vira "experienceCIa" mais)
- 🌍 **Batch translation** — todas as frases traduzidas em uma única inferência (mais rápido)
- 🔑 **HF_TOKEN** — token Hugging Face configurado via `.env.local` / GitHub Secrets para downloads mais rápidos
- 📦 **sacremoses** adicionado ao `deploy.yml`
- 🗑️ **Modelos MarianMT removidos** — `geralt/Opus-mt-pt-en`, `Helsinki-NLP/opus-mt-en-es` não são mais necessários
- 🌍 **Nomes geográficos brasileiros** adicionados ao glossário (Ceará, Fortaleza, São Paulo, etc.)

## [1.4.0] - 2026-07-26

### 📄 Pipeline de Currículo Automático (PT/EN/ES → PDF)

- ➕ **Pipeline completa** — geração automática de currículos em PDF a partir de uma única fonte de dados YAML
- 🌍 **Tradução automática** — PT→EN via `geralt/Opus-mt-pt-en`, PT→ES via chain PT→EN→ES com `Helsinki-NLP/opus-mt-en-es` (MarianMT)
- 🛡️ **Glossário protegido** — termos técnicos, nomes de empresas e siglas (Python, Docker, SiDi, SEO/SEM, etc.) nunca são traduzidos
- 🔧 **Overrides manuais** — arquivos `overrides.en.yml` / `overrides.es.yml` permitem corrigir traduções específicas sem tocar no modelo
- 🎨 **Template HTML/CSS profissional** — layout A4 com paleta do portfólio (Sky Blue, Violeta, Cyan), sem frameworks
- 📦 **Playwright para PDF** — `page.pdf(format="A4", print_background=True)` — reaproveita dependência já existente
- 🤖 **CI/CD integrado** — steps de Python + Hugging Face cache no `deploy.yml`, gera PDFs antes do build Vite
- 🗑️ **PDFs antigos removidos** — `public/documents/resumes/cv_{br,en,es}_lucas_cavalcante.pdf` substituídos por `public/cv/cv_{pt,en,es}.pdf`
- 🔗 **Botão de currículo dinâmico** — Hero link usa i18next para servir o PDF correto com base no idioma ativo

### 🔧 Fix — Tradução de cargos

- 🐛 **`cargo` não era traduzido** — experiencia_profissional cargo permanecia em PT nos PDFs EN/ES, agora traduzido corretamente

## [1.3.1] - 2026-07-25

### 🚨 Hotfix — GitHub Pages tela branca

- 🔧 **Base path corrigido** — branches divergiam: remoto usava `/portfolio/` mas o repo se chama `portfolio-cavalcante`, gerando 404 em todos os assets JS/CSS
- 🔀 **Merge resolvido** — commit `deb71ab` (status field) integrado ao branch local com conflito em `projects.json` resolvido
- ✅ Deploy com `base: '/portfolio-cavalcante/'` agora bate com o nome do repo e a URL do GitHub Pages

## [1.3.0] - 2026-07-24

### 🏷️ Status badges nos cards de projeto

- 🔴🟢 Badges de "Concluído" (verde) e "Em andamento" (amarelo) com circle glow animado
- 🗑️ Tag "Implementado" removida dos cards
- 📦 Favicon substituído pelo mesmo do LinkTree
- 🔄 Cards reordenados do mais recente para o mais antigo
- ➕ Novo projeto: **LinkTree Cavalcante** — agregador de links com dashboard, analytics e 3D
- 📝 Status atualizados: ERP Oficina, Paraiso Frames, Blog CMS, CD Price Tracker como "Em andamento"
- 📄 CONTENT.md atualizado com status e novo projeto

## [1.2.0] - 2026-07-24

### 📦 Repositório renomeado para `portfolio-cavalcante`

- 🏷️ Repositório renomeado de `portfolio` → `portfolio-cavalcante`
- 🔗 Base path do Vite atualizado para `/portfolio-cavalcante/`
- 🌐 Homepage, OG tags e Schema.org redirecionados para o novo URL
- 🔄 Remote local atualizado

### 🧰 TechStack baseado em projetos reais

- 🗑️ **Removidas**: Keras, AWS, Azure, Google Cloud, MySQL, MongoDB, Firebase, Figma, Canva, Jira, Trello, Linux — sem evidência de uso em projetos
- ➕ **Adicionadas**: TypeScript, Next.js, Tailwind CSS, Flask, FastAPI, LangChain, HuggingFace, OpenCV, Plotly, GitHub Actions, Vite, Vercel, Power BI
- 🎯 Agora reflete fielmente as stacks dos 15+ projetos do GitHub

### 🎨 Hero background

- 🗺️ Mapa azul de Fortaleza adicionado como background sutíl (`opacity-10 dark:opacity-5`)

### 🛠️ Ajustes e novo projeto

- 🚫 **Showcase desabilitada** temporariamente — comentada em App.tsx e Nav.tsx, será aprimorada depois
- 📊 **Stats corrigido** — anos de experiência agora fixo "6+" em vez de cálculo automático (14+)
- 📏 **Hero title menor no desktop** — fonte reduzida para `text-lg` com `whitespace-nowrap`, sem quebra de linha
- 💿 **Novo projeto: CD Price Tracker** — scraper semanal de preços de CDs com Python/Playwright, dashboard Next.js + Recharts, Supabase
- 🖥️ **BootScreen atualizado** — inclui `cd-price-tracker` na lista de módulos enumerados
- 📄 **CONTENT.md e TODO.md** — documentação atualizada

### 📱 Mobile UX — Touch Targets, Acessibilidade e Layout

- 👆 **Touch targets maiores** — Hero botões `px-3 py-2` → `px-4 py-3`, Nav `p-2` → `p-2.5` (toggles, hamburger, idioma)
- ♿ **`aria-hidden`** em todos os ícones decorativos (50+ ícones lucide-react) — leitores de tela ignoram decoração
- 📍 **TechStack tooltip adaptável** — hover no desktop, click/tap no mobile (com `useState`)
- 🖱️ **`touch-pan-y`** no Experience — gesto horizontal não conflita com scroll vertical
- 📏 **Padding responsivo** — Languages: `py-24` → `py-16 md:py-24` (menos espaço vertical no mobile)
- 🔲 **Ícones TechStack uniformes** — `w-16 h-16` em todas as telas (64px), ícones `w-8 h-8`

### 🎯 Hero Mobile — Reordenação + Nav Scroll

- 📱 **Hero reordenado no mobile**: Nome → Foto → Availability → Title → Descrição → Botões (foto entre nome e conteúdo)
- 🖼️ **Foto adaptável**: `w-48 h-56` no mobile (menor), `w-64 h-72`/`md:w-88 md:h-96` no desktop
- 🔝 **Logo da Nav com smooth scroll**: clicar na logo agora scrolla suavemente ao topo (`window.scrollTo({ behavior: 'smooth' })`), igual ao ScrollToTop
- 🔊 **BootScreen beep silenciado no console**: `AudioContext` criado no mount, mas `resume()` + beep só executam no primeiro clique/tecla do usuário — elimina warning "AudioContext was not allowed to start"

## [1.0.0] - 2026-06-15

### ✅ V1 — Lançamento Inicial
- FAQ com JSON-LD para SEO (Google rich results)
- Sistema de ícones por mapa (icon map)
- Remoção de dead code
- Seção Showcase implementada
- Nav ativo com scroll spy
- Overlay no menu mobile
- Botão scroll-to-top
- Divisores entre seções
- Correção de largura dos cards
- Logos adaptados para dark mode
- Skip-to-content para acessibilidade
- Reduced-motion para animações (Framer Motion)
- Separação dos componentes Nav e Hero
- Testes E2E com Playwright
- OG card image (thumbnail WhatsApp)
- `robots.txt` configurado (permite facebookexternalhit)
- Migração de URLs do domínio personalizado para github.io

### ✅ V2 — Performance, SEO, i18n e Qualidade (2026-06-29)

- 🎬 **BootScreen** estilo BIOS com efeito de digitação, beep PC speaker, e saída suave via AnimatePresence
- ⚡ **3x mais rápido** — animação do BootScreen otimizada (1ms/char, 67ms entre seções)
- 🖼️ **WebP only** — foto de perfil caiu de 2.3MB pra 28KB (bye bye PNG)
- 🧹 **Cleanup de assets** — PNG removido, JSON-LD apontando pro WebP
- 📦 **sourcemaps desligados** em produção (`sourcemap: false`)
- 🔍 **Todas as imagens com `loading="lazy"`** — Nav, Hero, Companies
- 🧩 **Code splitting** com `React.lazy()` em todas as seções abaixo da dobra
- 🌍 **i18n completo** — Hero description EN expandida, Showcase 100% i18n, companyKey nas experiências
- ♿ **Acessibilidade** — skip-to-content + scroll-to-top traduzidos em 3 idiomas, prefers-reduced-motion global
- 🛡️ **Error Boundary** — captura erros nas sections lazy-loaded
- ✂️ **Dead code removido** — Companies dark mode, imports duplicados
- 🧼 **Refatorações** — `key={index}` → `key={tech.name}`, inline style → classe CSS, imports unificados
- 🧪 **Scripts npm** — `typecheck` e `test` adicionados
