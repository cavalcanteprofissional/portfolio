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
| M4 | Stats derivados dos dados reais em vez de hardcoded | ⏳ |
| M5 | Framer Motion respeitar `prefers-reduced-motion` | ✅ |
| M6 | Showcase description completa no i18n (2 frases como CONTENT.md) | ✅ |

### ⚪ Baixas

| # | Tarefa | Status |
|---|--------|--------|
| L1 | Trocar `key={index}` no TechStack por `tech.name` | ✅ |
| L2 | Inline style do Experience → classe CSS | ✅ |
| L3 | Juntar imports do Footer num único statement | ✅ |
| L4 | Version `1.0.0` no package.json | ✅ |

---

## V1 Concluída (17 tarefas)
- FAQ JSON-LD, icon map, dead code, Showcase section, Nav ativo, overlay, scroll-to-top, divisores, card width, dark mode logos, skip-to-content, reduced-motion, Nav/Hero separados, Playwright E2E, OG card image (WhatsApp thumbnail), robots.txt (permite facebookexternalhit), migrar URLs do domínio personalizado para github.io