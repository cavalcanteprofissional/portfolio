"""
translate.py — PT → EN/ES translation using mBART-large-50.

Uses Facebook's mBART-large-50-many-to-many-mmt (600M params) for
higher quality multilingual translation. Single model handles all
3 languages without chaining.

Glossary of protected terms (tech names, companies, acronyms)
are never translated. Manual overrides are merged after translation.
"""

import os
import re
from pathlib import Path
from typing import Any

import yaml
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load HF token from env if available (faster downloads, no auth warnings)
HF_TOKEN = os.environ.get("HF_TOKEN")

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
    # Brazilian geographic names
    "Ceará", "Fortaleza", "São Paulo", "Rio de Janeiro",
    "Minas Gerais", "Bahia", "Pernambuco", "Paraná",
    "Santa Catarina", "Rio Grande do Sul", "Goiás",
    "Mato Grosso", "Pará", "Amazonas", "Maranhão",
    "Piauí", "Rio Grande do Norte", "Paraíba", "Alagoas",
    "Sergipe", "Espírito Santo", "Distrito Federal",
]

# Build a set for O(1) lookup
_PROTECTED_SET = {term.lower(): term for term in GLOSSARIO_NAO_TRADUZIR}

# mBART language codes
MBART_LANG_CODES = {
    "en": "en_XX",
    "es": "es_XX",
    "pt": "pt_XX",
}

# Model name
MODEL_NAME = "facebook/mbart-large-50-many-to-many-mmt"

# Cache for loaded model
_model_cache: dict[str, tuple] = {}


def _load_model():
    """Load mBART model and tokenizer, with caching."""
    if "mbart" in _model_cache:
        return _model_cache["mbart"]

    kwargs = {"trust_remote_code": True}
    if HF_TOKEN:
        kwargs["token"] = HF_TOKEN

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, **kwargs)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, **kwargs)
    _model_cache["mbart"] = (model, tokenizer)
    return model, tokenizer


def _protect_terms(text: str) -> tuple[str, dict[str, str]]:
    """Replace protected terms with placeholders before translation.
    Uses word boundaries to avoid matching inside normal words."""
    placeholders = {}
    protected_text = text

    for term_lower, term_orig in sorted(_PROTECTED_SET.items(), key=lambda x: -len(x[0])):
        if term_lower in protected_text.lower():
            placeholder = f"PROTECTED{len(placeholders)}X"
            pattern = re.compile(r'\b' + re.escape(term_orig) + r'\b', re.IGNORECASE)
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


def _batch_translate(texts: list[str], lang: str) -> list[str]:
    """Translate a batch of texts using mBART with batched inference."""
    if not texts:
        return texts

    model, tokenizer = _load_model()
    target_code = MBART_LANG_CODES[lang]

    # Protect terms in all texts
    pairs = [_protect_terms(t) for t in texts]
    protected_texts = [p[0] for p in pairs]

    # Filter out empty strings, keep track of indices
    non_empty = [(i, t) for i, t in enumerate(protected_texts) if t.strip()]
    if not non_empty:
        return texts

    indices, batch_texts = zip(*non_empty)

    tokenizer.src_lang = "pt_XX"
    inputs = tokenizer(
        list(batch_texts), return_tensors="pt", padding=True,
        truncation=True, max_length=512
    )
    outputs = model.generate(
        **inputs,
        forced_bos_token_id=tokenizer.convert_tokens_to_ids(target_code),
        max_length=512,
        num_beams=2,
    )
    translations = tokenizer.batch_decode(outputs, skip_special_tokens=True)

    # Restore terms and reassemble
    result = list(texts)
    for idx, trans in zip(indices, translations):
        result[idx] = _restore_terms(trans, pairs[idx][1])
    return result


def translate_text(text: str, lang: str) -> str:
    """Translate a single text string from PT to the target language."""
    if lang == "pt":
        return text
    return _batch_translate([text], lang)[0]


def translate_list(items: list[str], lang: str) -> list[str]:
    """Translate a list of text strings."""
    if lang == "pt":
        return items
    return _batch_translate(items, lang)


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

    Collects all translatable texts, batch-translates them, then writes
    results back. Merges with manual overrides after translation.
    """
    import copy
    data = copy.deepcopy(data_pt)

    if lang == "pt":
        return data

    # Collect (text, setter) pairs — setter writes the translated text back
    batch: list[tuple[str, callable]] = []

    if "resumo_profissional" in data:
        batch.append((data["resumo_profissional"], lambda v, d=data: d.__setitem__("resumo_profissional", v)))

    if "experiencia_profissional" in data:
        for exp in data["experiencia_profissional"]:
            if "cargo" in exp:
                batch.append((exp["cargo"], lambda v, e=exp: e.__setitem__("cargo", v)))
            if "atividades" in exp:
                for j, _atv in enumerate(exp["atividades"]):
                    batch.append((exp["atividades"][j], lambda v, e=exp, idx=j: e.__setitem__("atividades", [v if i == idx else e["atividades"][i] for i in range(len(e["atividades"]))])))

    if "formacao_academica" in data:
        for edu in data["formacao_academica"]:
            if "curso" in edu:
                batch.append((edu["curso"], lambda v, e=edu: e.__setitem__("curso", v)))

    if "certificacoes" in data:
        for cert in data["certificacoes"]:
            if "nome" in cert:
                batch.append((cert["nome"], lambda v, c=cert: c.__setitem__("nome", v)))

    if "idiomas" in data:
        for lang_item in data["idiomas"]:
            if "nivel" in lang_item:
                batch.append((lang_item["nivel"], lambda v, li=lang_item: li.__setitem__("nivel", v)))

    raw_texts = [t[0] for t in batch]
    translated = _batch_translate(raw_texts, lang)

    for (_, setter), trans in zip(batch, translated):
        setter(trans)

    # Merge with overrides
    overrides = load_overrides(lang, resume_dir)
    if overrides:
        data = _deep_merge(data, overrides)

    return data
