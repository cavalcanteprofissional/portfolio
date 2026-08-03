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
| **Animação** | Framer Motion |
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

### 📄 Gerar currículos (PDF)

```bash
pip install transformers torch sentencepiece sacremoses jinja2 python-frontmatter pyyaml playwright
playwright install chromium
python resume/build.py
```

Opcionalmente, crie um `.env.local` com seu token do Hugging Face para downloads mais rápidos:

```
HF_TOKEN=hf_seu_token_aqui
```

Os PDFs são gerados em `public/cv/` e copiados para `dist/` no build. Edite `resume/curriculo-fonte.md` para atualizar os dados — a pipeline traduz (mBART-large-50) e renderiza automaticamente em PT/EN/ES.

## 🌐 URL

**https://cavalcanteprofissional.github.io/portfolio-cavalcante/**

Hospedado via GitHub Pages.

## 📝 Licença

MIT
