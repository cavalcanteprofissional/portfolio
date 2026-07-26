"""
build.py — Resume build orchestrator.

Parses the front-matter source, translates to EN/ES, renders
HTML templates with Jinja2, and generates PDFs for all 3 languages.
"""

import shutil
import sys
from pathlib import Path

import frontmatter
import yaml
from jinja2 import Environment, FileSystemLoader

from translate import translate_resume
from render_pdf import render_pdf

# ── Paths ──────────────────────────────────────────────────────
RESUME_DIR = Path(__file__).parent
PROJECT_ROOT = RESUME_DIR.parent
SOURCE_FILE = RESUME_DIR / "curriculo-fonte.md"
TEMPLATE_FILE = RESUME_DIR / "template.html"
OUTPUT_DIR = RESUME_DIR / "output"
PUBLIC_CV_DIR = PROJECT_ROOT / "public" / "cv"

# ── Labels per language (for template rendering) ───────────────
LABELS = {
    "pt": {
        "resumo": "Resumo Profissional",
        "experiencia": "Experiência Profissional",
        "formacao": "Formação Acadêmica",
        "certificacoes": "Certificações",
        "habilidades": "Habilidades Técnicas",
        "linguagens": "Linguagens & Bibliotecas",
        "ml": "Machine Learning",
        "dl": "Deep Learning & Visão Computacional",
        "plataformas": "Plataformas & Ferramentas",
        "marketing": "Marketing Digital",
        "gestao": "Gestão & Metodologias",
        "idiomas": "Idiomas",
    },
    "en": {
        "resumo": "Professional Summary",
        "experiencia": "Professional Experience",
        "formacao": "Education",
        "certificacoes": "Certifications",
        "habilidades": "Technical Skills",
        "linguagens": "Languages & Libraries",
        "ml": "Machine Learning",
        "dl": "Deep Learning & Computer Vision",
        "plataformas": "Platforms & Tools",
        "marketing": "Digital Marketing",
        "gestao": "Management & Methodologies",
        "idiomas": "Languages",
    },
    "es": {
        "resumo": "Resumen Profesional",
        "experiencia": "Experiencia Profesional",
        "formacao": "Formación Académica",
        "certificacoes": "Certificaciones",
        "habilidades": "Habilidades Técnicas",
        "linguagens": "Lenguajes & Bibliotecas",
        "ml": "Machine Learning",
        "dl": "Deep Learning & Visión Computacional",
        "plataformas": "Plataformas & Herramientas",
        "marketing": "Marketing Digital",
        "gestao": "Gestión & Metodologías",
        "idiomas": "Idiomas",
    },
}

LANG_NAMES = {"pt": "pt", "en": "en", "es": "es"}


def parse_source() -> dict:
    """Parse the front-matter from curriculo-fonte.md."""
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        post = frontmatter.load(f)
    return dict(post.metadata)


def render_template(data: dict, lang: str) -> str:
    """Render the HTML template with the given data and language."""
    env = Environment(loader=FileSystemLoader(str(RESUME_DIR)))
    template = env.get_template("template.html")

    labels = LABELS.get(lang, LABELS["en"])
    return template.render(
        lang_code=LANG_NAMES.get(lang, lang),
        labels=labels,
        **data,
    )


def main():
    """Main build pipeline: parse → translate → render → output."""
    print("=" * 60)
    print("  Resume Build Pipeline — PT/EN/ES")
    print("=" * 60)

    # Ensure output directories exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_CV_DIR.mkdir(parents=True, exist_ok=True)

    # Step 1: Parse source
    print("\n[1/4] Parsing front-matter source...")
    data_pt = parse_source()
    print(f"  [OK] Loaded: {data_pt['dados_pessoais']['nome']}")

    # Step 2: Prepare translations
    print("\n[2/4] Preparing translations...")
    resumes = {"pt": data_pt}

    for lang in ["en", "es"]:
        print(f"  -> Translating PT -> {lang.upper()}...")
        resumes[lang] = translate_resume(data_pt, lang, RESUME_DIR)
        print(f"  [OK] {lang.upper()} translation complete")

    # Step 3: Render HTML templates
    print("\n[3/4] Rendering HTML templates...")
    html_files = {}
    for lang, data in resumes.items():
        html = render_template(data, lang)
        html_path = OUTPUT_DIR / f"cv_{lang}.html"
        html_path.write_text(html, encoding="utf-8")
        html_files[lang] = html_path
        print(f"  [OK] cv_{lang}.html")

    # Step 4: Generate PDFs
    print("\n[4/4] Generating PDFs...")
    for lang, html_path in html_files.items():
        html_content = html_path.read_text(encoding="utf-8")
        pdf_path = OUTPUT_DIR / f"cv_{lang}.pdf"
        render_pdf(html_content, pdf_path)
        print(f"  [OK] cv_{lang}.pdf")

        # Copy to public/cv/
        dest = PUBLIC_CV_DIR / f"cv_{lang}.pdf"
        shutil.copy2(pdf_path, dest)
        print(f"  -> Copied to public/cv/cv_{lang}.pdf")

    print("\n" + "=" * 60)
    print("  Build complete! PDFs generated:")
    for lang in ["pt", "en", "es"]:
        print(f"    • public/cv/cv_{lang}.pdf")
    print("=" * 60)


if __name__ == "__main__":
    main()
