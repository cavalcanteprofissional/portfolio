"""
translate.py — PT → EN/ES translation using MarianMT.

Uses community OPUS-MT models with a glossary of protected terms
(tech names, companies, acronyms) that are never translated.
Reads and merges manual overrides before returning final results.

Models:
  - PT→EN: geralt/Opus-mt-pt-en (public, no auth needed)
  - PT→ES: Chain PT→EN→ES via geralt/Opus-mt-pt-en + geralt/Opus-mt-en-es
"""

import re
from pathlib import Path
from typing import Any

import yaml
from transformers import MarianMTModel, MarianTokenizer

# ── Glossary: terms that must NEVER be translated ──────────────
GLOSSARIO_NAO_TRADUZIR = [
    # Programming languages & frameworks
    "Python", "SQL", "JavaScript", "TypeScript", "Node.js", "React",
    "Vue.js", "Vite", "HTML", "CSS", "Bootstrap", "Next.js",
    # ML/DL frameworks
    "XGBoost", "LightGBM", "CatBoost", "AdaBoost", "Random Forest",
    "Gradient Boosting", "Optuna", "TensorFlow", "Keras", "PyTorch",
    "NLTK", "Word2Vec", "TF-IDF", "Transformers", "YOLO", "OpenCV",
    "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly",
    # Platforms & tools
    "Kaggle", "OpenML", "Hugging Face", "Git", "GitHub", "Docker",
    "Kubernetes", "AWS", "Azure", "GCP", "OCI", "Streamlit", "Flask",
    "FastAPI", "LangChain",
    # BI & visualization
    "Power BI", "Tableau", "Looker", "Google Analytics",
    # Marketing tools
    "Google Ads", "Meta Ads", "RD Station", "WordPress", "SEO", "SEM",
    "SEO/SEM", "CRM", "ERP", "Canva", "OBS", "CapCut",
    "Adobe Creative Cloud", "Illustrator", "Photoshop", "Premiere",
    "After Effects", "CorelDraw", "Sony Vegas",
    # Methodologies
    "Scrum", "Kanban", "Trello", "Asana", "ITIL", "COBIT",
    # Office
    "Excel", "Word", "PowerPoint",
    # Companies
    "SiDi", "Rebualf", "ZENTS", "Iselétrica", "Autônomo",
    # Acronyms
    "AI", "ML", "NLP", "DL", "CV", "EDA", "KPI", "KPIs",
    "CPC", "CPA", "CTR", "ROI", "DER", "TCP/IP", "Wi-Fi",
    "LLM", "DNN", "CNN", "RNN", "LSTM", "SVR", "MLP", "KNN",
    "API", "CI", "CD", "ETL", "GPU", "CPU", "RAM",
]

# Build a set for O(1) lookup
_PROTECTED_SET = {term.lower(): term for term in GLOSSARIO_NAO_TRADUZIR}

# Model mapping — public community models, no auth required
MODELS = {
    "pt_en": "geralt/Opus-mt-pt-en",
    "en_es": "Helsinki-NLP/opus-mt-en-es",
}

# Cache for loaded models
_model_cache: dict[str, tuple] = {}


def _load_model(key: str):
    """Load MarianMT model and tokenizer, with caching."""
    if key in _model_cache:
        return _model_cache[key]

    model_name = MODELS[key]
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)
    _model_cache[key] = (model, tokenizer)
    return model, tokenizer


def _protect_terms(text: str) -> tuple[str, dict[str, str]]:
    """Replace protected terms with placeholders before translation."""
    placeholders = {}
    protected_text = text

    for term_lower, term_orig in sorted(_PROTECTED_SET.items(), key=lambda x: -len(x[0])):
        if term_lower in protected_text.lower():
            placeholder = f"PROTECTED{len(placeholders)}X"
            pattern = re.compile(re.escape(term_orig), re.IGNORECASE)
            if pattern.search(protected_text):
                protected_text = pattern.sub(placeholder, protected_text)
                placeholders[placeholder] = term_orig

    return protected_text, placeholders


def _restore_terms(text: str, placeholders: dict[str, str]) -> str:
    """Restore protected terms after translation."""
    restored = text
    for placeholder, original in placeholders.items():
        restored = restored.replace(placeholder, original)
    return restored


def _run_translation(text: str, model, tokenizer) -> str:
    """Run translation on a single text string."""
    if not text or not text.strip():
        return text

    protected, placeholders = _protect_terms(text)
    inputs = tokenizer(protected, return_tensors="pt", padding=True, truncation=True, max_length=512)
    outputs = model.generate(**inputs, max_length=512, num_beams=4)
    translated = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return _restore_terms(translated, placeholders)


def translate_to_en(text: str) -> str:
    """Translate PT → EN."""
    model, tokenizer = _load_model("pt_en")
    return _run_translation(text, model, tokenizer)


def translate_en_to_es(text: str) -> str:
    """Translate EN → ES."""
    model, tokenizer = _load_model("en_es")
    return _run_translation(text, model, tokenizer)


def translate_to_es(text: str) -> str:
    """Translate PT → ES via PT→EN→ES chain."""
    en_text = translate_to_en(text)
    return translate_en_to_es(en_text)


def translate_text(text: str, lang: str) -> str:
    """Translate a single text string from PT to the target language."""
    if lang == "en":
        return translate_to_en(text)
    elif lang == "es":
        return translate_to_es(text)
    return text


def translate_list(items: list[str], lang: str) -> list[str]:
    """Translate a list of text strings."""
    return [translate_text(item, lang) for item in items]


def _deep_merge(base: Any, override: Any) -> Any:
    """Deep merge override into base. Override wins on conflict."""
    if isinstance(base, dict) and isinstance(override, dict):
        result = base.copy()
        for key, value in override.items():
            if key in result:
                result[key] = _deep_merge(result[key], value)
            else:
                result[key] = value
        return result
    elif isinstance(base, list) and isinstance(override, list):
        result = base.copy()
        for i, value in enumerate(override):
            if i < len(result):
                result[i] = _deep_merge(result[i], value)
            else:
                result.append(value)
        return result
    else:
        return override if override is not None else base


def load_overrides(lang: str, resume_dir: Path) -> dict:
    """Load manual override file for the given language."""
    override_file = resume_dir / f"overrides.{lang}.yml"
    if override_file.exists():
        with open(override_file, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data if isinstance(data, dict) else {}
    return {}


def translate_resume(data_pt: dict, lang: str, resume_dir: Path) -> dict:
    """
    Translate the entire resume data from PT to the target language.

    - Translates only free-text fields: resumo_profissional, atividades,
      titulo, curso, nivel
    - Never translates: nome, empresa, instituicao, email, links, datas
    - Merges with manual overrides after translation
    """
    import copy
    data = copy.deepcopy(data_pt)

    # Translate resumo_profissional
    if "resumo_profissional" in data:
        data["resumo_profissional"] = translate_text(
            data["resumo_profissional"], lang
        )

    # Translate experiencia_profissional (cargo + atividades)
    if "experiencia_profissional" in data:
        for exp in data["experiencia_profissional"]:
            if "cargo" in exp:
                exp["cargo"] = translate_text(exp["cargo"], lang)
            if "atividades" in exp:
                exp["atividades"] = translate_list(
                    exp["atividades"], lang
                )

    # Translate formacao_academica (curso only)
    if "formacao_academica" in data:
        for edu in data["formacao_academica"]:
            if "curso" in edu:
                edu["curso"] = translate_text(
                    edu["curso"], lang
                )

    # Translate certificacoes (nome only)
    if "certificacoes" in data:
        for cert in data["certificacoes"]:
            if "nome" in cert:
                cert["nome"] = translate_text(
                    cert["nome"], lang
                )

    # Translate idiomas (nivel only)
    if "idiomas" in data:
        for lang_item in data["idiomas"]:
            if "nivel" in lang_item:
                lang_item["nivel"] = translate_text(
                    lang_item["nivel"], lang
                )

    # Merge with overrides
    overrides = load_overrides(lang, resume_dir)
    if overrides:
        data = _deep_merge(data, overrides)

    return data
