# Changelog

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
