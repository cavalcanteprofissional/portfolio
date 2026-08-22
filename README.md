# 👨‍💻 Portfolio-cavalcante

**Data Analyst & AI Specialist** — meu cantinho na web onde mostro projetos, experimentos e um pouco do que sei fazer com dados, IA e código.

## ✨ O que tem por aqui

- 🖥️ **BootScreen estilo BIOS** — tela cheia com efeito CRT (scanlines, vignette, flicker, glow), digitação rápida com `[OK]` animado, texto borda a borda, glow do mouse 3x durante o boot, beep de POST + chime de boas-vindas e botão de mudo (só uma vez, depois pula direto)
- ✨ **Revelação em foco ao fim do boot** — transição coordenada: fundo com fade + blur + scale, glow do mouse "assenta" sem pop, Nav desliza de cima, Hero sobe com escala e Footer entra com ícones em sequência
- 🌓 **Modo escuro/claro** — com detecção automática do sistema
- 🌎 **3 idiomas** — Português, English, Español
- 🎯 **Nav com scroll ativo** — destaca a seção enquanto você navega
- 🖼️ **Cards de projeto** com link pra demo, código e status (🟢 concluído / 🟡 em andamento)
- 🏷️ **Badges de progresso** — indicador visual com circle glow para cada projeto
- 📊 **TechStack verdadeiro** — baseado nos projetos reais do GitHub, agrupado em 6 categorias (Linguagens, IA/ML, Data Science, Frontend, Backend, DevOps), sem firula
- 📄 **Currículo automático** — pipeline gera PDFs em PT/EN/ES a partir de uma fonte YAML, com tradução por IA
- ❓ **FAQ** com dados estruturados (aparece na busca do Google)
- ♿ **Acessibilidade** — skip-to-content, reduced-motion, aria-labels
- 📱 **QR Code** pra acesso mobile rápido
- 🔗 **Preview bonito no WhatsApp** ao compartilhar o link
- ⚡ **Performance** — lazy loading, code splitting, WebP otimizado

## 🛠️ Tecnologias

| Camada | Stack |
|--------|-------|
| **Frontend** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Estilo** | Tailwind CSS |
| **Animação** | Motion (motion.dev) |
| **i18n** | i18next + react-i18next |
| **Estado** | Zustand |
| **Ícones** | Lucide React + React Icons |
| **Currículo** | Python + mBART-large-50 + Jinja2 + Playwright |
| **Teste** | Playwright (E2E) |
| **Deploy** | GitHub Actions + GitHub Pages |

## 🚀 Rodar local

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # build de produção
npm run preview    # preview do build
```

### ✅ Qualidade

```bash
npm run typecheck  # checagem de tipos (tsc --noEmit)
npm run lint       # lint (ESLint flat config, 0 erros)
npm run test       # testes E2E (Playwright — 48/48, modo CI com `CI=1`)
```

### 🎨 Branding

A identidade visual — **esfera azul reluzente em neon**, arte original desenhada no Adobe Illustrator — alimenta todos os ícones do site via pipeline automática.

**Conteúdo do diretório `branding/`:**

| Arquivo | Especificação | Git |
|---------|---------------|-----|
| `favicon.ai` | Fonte vetorial da arte (Illustrator, artboard 512×512, esfera neon com transparência) | ✅ versionado |
| `1x/` | Exports temporários de conferência (@1x) gerados pelo Illustrator | 🚫 ignorado |
| `~ai-*.tmp`, `.~*` | Locks/temporários criados durante a edição no Illustrator | 🚫 ignorado |

Regra no `.gitignore`: `/branding/*` + `!/branding/*.ai` — **só fontes `.ai` entram no histórico**; exports e temporários nunca exigem limpeza manual.

**Fluxo de atualização:** editar `branding/favicon.ai` → exportar PNG 512×512 com transparência → salvar como `public/icons/logo-512.png` → rodar o pipeline:

```bash
npm run icons      # regenera favicon.ico (16/32/48) + icon-180/192/512 + maskable a partir de public/icons/logo-512.png
```

Derivados gerados em `public/`:

- **Abas** (`favicon.ico` ICONDIR real com 3 entradas PNG 16/32/48, `icon-192/512.png`): esfera flutuante com transparência
- **apple-touch-icon** (`icon-180.png`) e variantes **maskable** (`maskable-192/512.png`): compostos sobre o navy da marca `#0F172A`

### 📄 Gerar currículos (PDF)

```bash
pip install transformers torch sentencepiece sacremoses jinja2 python-frontmatter pyyaml playwright
playwright install chromium
python resume/build.py
```

Opcionalmente, crie um `.env.local` na raiz do projeto com seu token do Hugging Face para downloads mais rápidos (a pipeline o carrega automaticamente):

```
HF_TOKEN=hf_seu_token_aqui
```

Crie o token em https://huggingface.co/settings/tokens. Em CI, o mesmo token é injetado via GitHub Secret `HF_TOKEN`.

Os PDFs são gerados em `public/cv/` e **versionados no repo** (fonte da verdade — o deploy os usa direto do checkout). Edite `resume/curriculo-fonte.md` para atualizar os dados — a pipeline traduz (mBART-large-50) e renderiza automaticamente em PT/EN/ES. Depois de editar, rode `python resume/build.py` e committe os PDFs renovados.

Detalhes automáticos:

- **Auto-sync do link Portfolio** — `build.py` extrai `<link rel="canonical">` do `index.html` e força `dados_pessoais.portfolio` a segui-lo (valor do frontmatter vira só fallback); troca futura de domínio propaga sozinha
- **CI seletivo** (`deploy.yml`) — a etapa Python (tradução + PDFs) só roda se `resume/**` mudou no push ou se os PDFs não existirem no checkout; caso contrário os commitados são empacotados no `dist/`, e pushes de documentação ficam ~1–2 min

## 🏗️ Arquitetura

```
portfolio/
├── src/
│   ├── components/     # BootScreen (BIOS+CRT), bootSound, Hero, Portfolio, TechStack…
│   ├── i18n/           # traduções pt/en/es (i18next)
│   ├── stores/         # estado global (Zustand)
│   ├── data/           # projects.json
│   └── index.css       # Tailwind + efeitos CRT/glow
├── public/
│   ├── icons/          # logo-512.png (arte mestre) + ícones derivados
│   ├── cv/             # PDFs versionados (fonte da verdade) — pipeline Python regenera
│   ├── og/, companies/, documents/, images/
│   └── robots.txt · sitemap.xml · site.webmanifest · favicon.ico
├── branding/           # fonte .ai da marca — só *.ai versionado (ver 🎨 Branding)
├── scripts/            # generate-icons.mjs — pipeline sharp dos ícones (npm run icons)
├── resume/             # pipeline de currículos (Python + mBART + Playwright)
└── e2e/                # Playwright: fluxos do app (portfolio.spec) e artefatos de build (artifacts.spec)
```

O build (Vite 7) aplica code-splitting por seção, copia `public/` para `dist/` e o plugin `gh-pages-spa-404` duplica `index.html` → `404.html` para fallback de rotas no GitHub Pages.

## 🌐 URL

**https://cavalcanteprofissional.github.io/portfolio-cavalcante/**

Hospedado via GitHub Pages.

## 📝 Licença

MIT
