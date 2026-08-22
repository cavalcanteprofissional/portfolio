# Plano v1.16.2 — Hyperlink "Portfolio" dos currículos: correção + auto-sync com o site

## Contexto / diagnóstico (verificado)

| Item | Evidência |
|---|---|
| Link desatualizado nos 3 PDFs | `resume/curriculo-fonte.md:22` → `portfolio: "https://cavalcanteprofissional.github.io/portfolio"` (falta sufixo `-cavalcante`) |
| URL correta (fonte da verdade) | `index.html:13` → `<link rel="canonical" href="https://cavalcanteprofissional.github.io/portfolio-cavalcante/" />` |
| Onde o link é renderizado | `resume/template.html:271-273` → `<a href="{{ dados_pessoais.portfolio }}">Portfolio</a>` no cabeçalho de contato |
| Overrides en/es | não definem `portfolio` → herdam o valor errado do fonte PT |
| Bônus aprovado pelo usuário | mesmo arquivo tem `linkedin: ".../in/cavalcante-lucas"` minúsculo — padronização `cavalcante-Lucas` (v1.15.0) ficou de fora do currículo |
| Fluxo | frontmatter `dados_pessoais` → `build.py:parse_source()` → Jinja2 → HTML → Playwright PDF |

Escopo escolhido pelo usuário: **plano completo** (URL + auto-sync + LinkedIn).

## 1. `resume/curriculo-fonte.md`

- Linha 22: `portfolio` → `https://cavalcanteprofissional.github.io/portfolio-cavalcante/`
- Linha ~21: `linkedin` → `https://linkedin.com/in/cavalcante-Lucas`

## 2. `resume/build.py` — auto-sync com o canonical do site

```python
import re                      # novo import
INDEX_HTML = PROJECT_ROOT / "index.html"   # nova constante de path

def get_site_url() -> str | None:
    """Extrai <link rel="canonical"> do index.html na raiz do repo."""
    try:
        html = INDEX_HTML.read_text(encoding="utf-8")
        m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
        return m.group(1) if m else None
    except OSError:
        return None
```

Em `parse_source()`, após carregar o frontmatter:

```python
site_url = get_site_url()
if site_url:
    atual = data.get("dados_pessoais", {}).get("portfolio")
    if atual != site_url:
        print(f"  [SYNC] portfolio: {atual} -> {site_url} (canonical do index.html)")
    data["dados_pessoais"]["portfolio"] = site_url
# sem index.html legível: mantém o valor do frontmatter como fallback
```

- Paths já são `__file__`-relative → funciona local e no CI (checkout sempre tem index.html)
- Futura troca de domínio: basta atualizar o canonical — currículo acompanha sozinho

## 3. Regeneração local (committed-first)

```bash
python resume/build.py     # ambiente já validado (output/ existe de Jul/26; HF cache local presente)
```

## 4. Validação

- `grep -L cavalcante-cavalcante` não… verificar: `grep -c "portfolio-cavalcante" resume/output/cv_{pt,en,es}.html` → **3×** cada; `grep -c "github.io/portfolio\"" ...` → **0**
- Timestamps novos em `public/cv/cv_*.pdf`; git status mostra os 3 PDFs modificados

## 5. Docs

- `TODO.md`: onda **J** — J1 registro · J2 correção do fonte (URL+LinkedIn) · J3 refactor `get_site_url()` · J4 regeneração local · J5 validação greps/timestamps · J6 CHANGELOG `[1.16.2]` + push
- `CHANGELOG.md`: `[1.16.2]` — fix do hyperlink + auto-sync + slug LinkedIn

## 6. Commit + push

- Commit único: `fix(resume): correct portfolio hyperlink, auto-sync from canonical, unify linkedin slug`
- Push toca `resume/**` → paths-filter dispara regeneração no CI também (valida ao vivo o caminho "resume mudou"); PDFs commitados permanecem a fonte prioritária nas runs seguintes

## Observação

`.opencode/` foi removido na H6 e será recriado apenas para este plano (usuário autorizou versioná-lo "por enquanto").
