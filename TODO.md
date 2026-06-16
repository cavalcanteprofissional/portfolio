# Plano de Melhorias — 2ª Onda: Performance, SEO, i18n e Qualidade

## Data: 2026-06-15

## Objetivo
Corrigir issues críticas de performance, SEO, internacionalização e qualidade de código.

---

## Progresso

### 🔴 Críticas

| # | Tarefa | Status |
|---|--------|--------|
| C1 | Deletar `src/data/projects. json` (arquivo duplicado com espaço) | ⏳ |
| C2 | Expandir Hero description EN/ES (13 → 38 palavras como PT) | ⏳ |
| C3 | Traduzir Showcase — usar chaves i18n em vez de hardcoded PT | ⏳ |
| C4 | Otimizar foto de perfil (2.3MB → ~100KB) | ⏳ |
| C5 | Desligar sourcemaps em produção (`vite.config.ts`) | ⏳ |
| C6 | Corrigir JSON-LD image URL (faltando `/images/`) | ⏳ |

### 🟡 Altas

| # | Tarefa | Status |
|---|--------|--------|
| H1 | Adicionar `loading="lazy"` + `width`/`height` em todas imagens | ⏳ |
| H2 | Traduzir skip-to-content link + scroll-to-top aria-label | ⏳ |
| H3 | Adicionar Error Boundary | ⏳ |
| H4 | Corrigir OG meta tags (width/height, URL absoluta) | ✅ |
| H5 | Otimizar `mako.svg` (388KB) | ⏳ |
| H6 | Usar `experience.companyKey` para traduzir nome da empresa | ⏳ |

### 🔵 Médias

| # | Tarefa | Status |
|---|--------|--------|
| M1 | Code splitting com `React.lazy()` para seções abaixo da dobra | ⏳ |
| M2 | Scripts npm: `test`, `typecheck`, `format` | ⏳ |
| M3 | Corrigir `Companies.tsx` dark mode (ainda com brightness-0 invert) | ⏳ |
| M4 | Stats derivados dos dados reais em vez de hardcoded | ⏳ |
| M5 | Framer Motion respeitar `prefers-reduced-motion` | ⏳ |
| M6 | Showcase description completa no i18n (2 frases como CONTENT.md) | ⏳ |

### ⚪ Baixas

| # | Tarefa | Status |
|---|--------|--------|
| L1 | Trocar `key={index}` no TechStack por `tech.name` | ⏳ |
| L2 | Inline style do Experience → classe CSS | ⏳ |
| L3 | Juntar imports do Footer num único statement | ⏳ |
| L4 | Version `1.0.0` no package.json | ⏳ |

---

## V1 Concluída (16 tarefas)
- FAQ JSON-LD, icon map, dead code, Showcase section, Nav ativo, overlay, scroll-to-top, divisores, card width, dark mode logos, skip-to-content, reduced-motion, Nav/Hero separados, Playwright E2E, OG card image (WhatsApp thumbnail), robots.txt (permite facebookexternalhit)