# TODO - Atualização de Campos Textuais do Projeto

## Data: 2026-04-23

## Objetivo
Atualizar os campos textuais do projeto com base no CONTENT.md

---

## Tarefas Concluídas

### 1. Adicionar ISElétrica ao companies.json
- **Arquivo:** `src/data/companies.json`
- **Status:** ✅ CONCLUÍDO

---

## Tarefas Atuais

### 2. Corrigir i18n - Race Condition

**Problema:**
- O `loadResources()` em `src/i18n/index.ts` é chamado mas não aguarda conclusão
- Componentes renderizam antes das traduções carregarem
- Resultado: chaves como `hero.name` aparecem vazias

**Solução:** Mudar de fetch assíncrono para import estático

**Arquivo:** `src/i18n/index.ts`

**Mudança:**
```typescript
// ANTIGO (problema):
async function loadResources() {
  const [pt, en, es] = await Promise.all([
    fetch('/locales/pt.json').then(r => r.json()),
    // ...
  ]);
}
loadResources(); // Não aguarda!

// NOVO (solução):
// Importar diretamente os arquivos JSON
import ptTranslation from '/locales/pt.json?raw';
import enTranslation from '/locales/en.json?raw';
import esTranslation from '/locales/es.json?raw';

const resources = {
  pt: { translation: JSON.parse(ptTranslation).translation },
  en: { translation: JSON.parse(enTranslation).translation },
  es: { translation: JSON.parse(esTranslation).translation },
};

i18n.init({
  resources,
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});
```

---

### 3. Adicionar Dropdown de Idioma no Navbar

**Arquivo:** `src/components/Nav.tsx`

**Implementação:**
- Adicionar botão dropdown no header do Navbar
- Opções: PT, EN, ES
- Persistir escolha no localStorage
- Atualizar idioma com `i18n.changeLanguage()`

**Estrutura:**
```typescript
// Estado
const [currentLang, setCurrentLang] = useState('pt');

// Botão dropdown
// Languages: [{ code: 'pt', label: 'PT' }, { code: 'en', label: 'EN' }, { code: 'es', label: 'ES' }]
```

---

## Referência
- CONTENT.md
- package.json: i18next ^25.8.4, react-i18next ^16.5.4