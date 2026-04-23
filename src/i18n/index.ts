import i18n from 'i18next';

const resources = {
  pt: { translation: {} },
  en: { translation: {} },
  es: { translation: {} },
};

async function loadResources() {
  try {
    const [pt, en, es] = await Promise.all([
      fetch('/locales/pt.json').then(r => r.json()),
      fetch('/locales/en.json').then(r => r.json()),
      fetch('/locales/es.json').then(r => r.json()),
    ]);

    resources.pt.translation = pt.translation;
    resources.en.translation = en.translation;
    resources.es.translation = es.translation;

    await i18n.init({
      resources,
      lng: 'pt',
      fallbackLng: 'pt',
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

loadResources();

export default i18n;