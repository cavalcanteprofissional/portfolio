import { create } from 'zustand';

const STORAGE_KEY = 'portfolio-consent';

function readConsent(): boolean | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'true') return true;
    if (v === 'false') return false;
  } catch { /* localStorage indisponível */ }
  return null;
}

interface ConsentStore {
  consent: boolean | null;
  setConsent: (value: boolean) => void;
  /** Abre o modal de política/consentimento sob demanda (ex.: link no rodapé). */
  forcedOpen: boolean;
  requestPolicy: () => void;
  closePolicy: () => void;
}

export const useConsentStore = create<ConsentStore>((set) => ({
  consent: readConsent(),
  setConsent: (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch { /* localStorage indisponível */ }
    set({ consent: value, forcedOpen: false });
  },
  forcedOpen: false,
  requestPolicy: () => set({ forcedOpen: true }),
  closePolicy: () => set({ forcedOpen: false }),
}));
