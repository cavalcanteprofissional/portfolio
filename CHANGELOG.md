# Changelog

## [1.1.0] - 2026-07-16

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
