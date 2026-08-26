import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConsentStore } from '../stores/consentStore';
import { EASE, DURATION } from '../lib/motion';

const MONO_FONT = "'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace";

const CONSENT_LINES = {
  pt: {
    header: '> POLÍTICA DE ARMAZENAMENTO',
    body: [
      'Este site utiliza Cache API para salvar o modelo de estimativa de profundidade (~13MB) no seu navegador.',
      'O modelo é processado integralmente no seu dispositivo.',
      'Também utilizamos localStorage para preferências (idioma, som).',
    ],
    accept: '[ Aceitar ]',
    learnMore: '[ Saiba mais ]',
  },
  en: {
    header: '> DATA STORAGE POLICY',
    body: [
      'This site uses Cache API to save the depth estimation model (~13MB) in your browser.',
      'The model is processed entirely on your device.',
      'We also use localStorage for preferences (language, sound).',
    ],
    accept: '[ Accept ]',
    learnMore: '[ Learn more ]',
  },
  es: {
    header: '> POLÍTICA DE ALMACENAMIENTO',
    body: [
      'Este sitio utiliza Cache API para guardar el modelo de estimación de profundidad (~13MB) en su navegador.',
      'El modelo se procesa enteramente en su dispositivo.',
      'También utilizamos localStorage para preferencias (idioma, sonido).',
    ],
    accept: '[ Aceptar ]',
    learnMore: '[ Saber más ]',
  },
};

const PRIVACY_LINES = {
  pt: {
    header: '> POLÍTICA DE PRIVACIDADE',
    body: [
      'Coletamos apenas dados necessários para o funcionamento do site.',
      'Cache API: modelo de IA (~13MB) processado localmente no seu dispositivo.',
      'localStorage: preferências (idioma, som) — não enviamos dados a servidores.',
      'Não utilizamos cookies de rastreamento ou analytics.',
      'Seus dados nunca são compartilhados com terceiros.',
      'Ao aceitar, você autoriza o armazenamento local descrito acima.',
    ],
    back: '[ Voltar ]',
    accept: '[ Aceitar ]',
  },
  en: {
    header: '> PRIVACY POLICY',
    body: [
      'We only collect data necessary for the site to function.',
      'Cache API: AI model (~13MB) processed locally on your device.',
      'localStorage: preferences (language, sound) — no data sent to servers.',
      'We do not use tracking cookies or analytics.',
      'Your data is never shared with third parties.',
      'By accepting, you authorize the local storage described above.',
    ],
    back: '[ Back ]',
    accept: '[ Accept ]',
  },
  es: {
    header: '> POLÍTICA DE PRIVACIDAD',
    body: [
      'Solo recopilamos datos necesarios para el funcionamiento del sitio.',
      'Cache API: modelo de IA (~13MB) procesado localmente en su dispositivo.',
      'localStorage: preferencias (idioma, sonido) — no enviamos datos a servidores.',
      'No utilizamos cookies de rastreo ni analytics.',
      'Sus datos nunca se comparten con terceros.',
      'Al aceptar, usted autoriza el almacenamiento local descrito arriba.',
    ],
    back: '[ Volver ]',
    accept: '[ Aceptar ]',
  },
};

function getConsentLines(lang: string) {
  if (lang === 'en') return CONSENT_LINES.en;
  if (lang === 'es') return CONSENT_LINES.es;
  return CONSENT_LINES.pt;
}

function getPrivacyLines(lang: string) {
  if (lang === 'en') return PRIVACY_LINES.en;
  if (lang === 'es') return PRIVACY_LINES.es;
  return PRIVACY_LINES.pt;
}

interface CookieConsentProps {
  visible: boolean;
}

export function CookieConsent({ visible }: CookieConsentProps) {
  const { consent, setConsent } = useConsentStore();
  const [step, setStep] = useState<'consent' | 'privacy'>('consent');
  const [typedHeader, setTypedHeader] = useState(0);
  const [typedBody, setTypedBody] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const lang = document.documentElement.lang || 'pt';
  const consentT = getConsentLines(lang);
  const privacyT = getPrivacyLines(lang);
  const t = step === 'consent' ? consentT : privacyT;
  const flatBody = t.body.join('\n');

  useEffect(() => {
    if (!visible || consent !== null) return;
    setStep('consent');
    setTypedHeader(0);
    setTypedBody(0);
    setShowButtons(false);
  }, [visible, consent]);

  useEffect(() => {
    if (!visible || consent !== null) return;

    if (typedHeader < t.header.length) {
      const timer = setTimeout(() => setTypedHeader((p) => p + 1), step === 'privacy' ? 6 : 18);
      return () => clearTimeout(timer);
    }

    if (typedBody < flatBody.length) {
      const timer = setTimeout(() => setTypedBody((p) => p + 1), step === 'privacy' ? 3 : 8);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setShowButtons(true), step === 'privacy' ? 60 : 200);
    return () => clearTimeout(timer);
  }, [visible, consent, typedHeader, typedBody, t, flatBody]);

  const handleAccept = useCallback(() => setConsent(true), [setConsent]);

  const handleLearnMore = useCallback(() => {
    setStep('privacy');
    setTypedHeader(0);
    setTypedBody(0);
    setShowButtons(false);
  }, []);

  const handleBack = useCallback(() => {
    setStep('consent');
    setTypedHeader(0);
    setTypedBody(0);
    setShowButtons(false);
  }, []);

  const handleBackdropClick = useCallback(() => {
    if (step === 'consent') {
      setDismissed(true);
    } else {
      handleBack();
    }
  }, [step, handleBack]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const show = visible && consent === null && !dismissed;

  const headerChars = t.header.slice(0, typedHeader);
  const headerFirst = t.header.slice(0, 1);
  const visibleBody = flatBody.slice(0, typedBody);
  const visibleLines = visibleBody.split('\n');
  const isTypingBody = typedBody < flatBody.length;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="cookie-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE }}
            className="fixed inset-0 z-[54] bg-black/60 pointer-events-auto"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {show && step === 'consent' && (
        <motion.div
          key="cookie-consent"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="fixed bottom-0 inset-x-0 z-[55] p-3 sm:p-4 md:p-6 pointer-events-auto"
          onClick={handleContainerClick}
        >
          <ModalCard>
            <ModalContent
              t={consentT}
              headerChars={headerChars}
              headerFirst={headerFirst}
              typedHeader={typedHeader}
              visibleLines={visibleLines}
              isTypingBody={isTypingBody}
              showButtons={showButtons}
            >
              <button
                type="button"
                onClick={handleLearnMore}
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 sm:flex-none text-[11px] sm:text-xs text-white/50 hover:text-white/90 transition-colors rounded border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10"
                style={{ fontFamily: MONO_FONT }}
              >
                {consentT.learnMore}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 sm:flex-none text-[11px] sm:text-xs font-semibold text-white transition-all rounded border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/25 boot-glow-text cookie-accept-glow"
                style={{ fontFamily: MONO_FONT }}
              >
                {consentT.accept}
              </button>
            </ModalContent>
          </ModalCard>
        </motion.div>
      )}

      {show && step === 'privacy' && (
        <motion.div
          key="cookie-privacy"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.12, ease: EASE }}
          className="fixed bottom-0 inset-x-0 z-[55] p-3 sm:p-4 md:p-6 pointer-events-auto"
          onClick={handleContainerClick}
        >
          <ModalCard>
            <ModalContent
              t={privacyT}
              headerChars={headerChars}
              headerFirst={headerFirst}
              typedHeader={typedHeader}
              visibleLines={visibleLines}
              isTypingBody={isTypingBody}
              showButtons={showButtons}
            >
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 sm:flex-none text-[11px] sm:text-xs text-white/50 hover:text-white/90 transition-colors rounded border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10"
                style={{ fontFamily: MONO_FONT }}
              >
                {privacyT.back}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 sm:flex-none text-[11px] sm:text-xs font-semibold text-white transition-all rounded border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/25 boot-glow-text cookie-accept-glow"
                style={{ fontFamily: MONO_FONT }}
              >
                {privacyT.accept}
              </button>
            </ModalContent>
          </ModalCard>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

function ModalCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full max-w-4xl mx-auto rounded-lg border border-white/10 overflow-hidden"
      style={{
        backgroundColor: 'hsl(215 45% 10%)',
        fontFamily: MONO_FONT,
        boxShadow: '0 0 40px -10px rgba(30, 64, 175, 0.3), 0 -4px 30px -6px rgba(0,0,0,0.5)',
      }}
    >
      <div className="absolute inset-0 boot-scanlines opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {children}
      </div>
    </div>
  );
}

interface ModalContentProps {
  t: { header: string; body: string[]; accept: string; learnMore?: string; back?: string };
  headerChars: string;
  headerFirst: string;
  typedHeader: number;
  visibleLines: string[];
  isTypingBody: boolean;
  showButtons: boolean;
  children: React.ReactNode;
}

function ModalContent({
  t,
  headerChars,
  headerFirst,
  typedHeader,
  visibleLines,
  isTypingBody,
  showButtons,
  children,
}: ModalContentProps) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <motion.p
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="text-xs sm:text-sm text-white whitespace-pre mb-1.5 boot-glow-text"
        >
          {headerChars}
          {typedHeader < t.header.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="inline-block w-[0.6em] h-[1.15em] bg-white/90 align-text-bottom ml-px"
              aria-hidden="true"
            />
          )}
        </motion.p>

        <div className="space-y-1 mb-1.5">
          <p className="text-[11px] sm:text-xs leading-relaxed text-white/60">
            {visibleLines[0] ?? ''}
            <span className="hidden sm:inline">{visibleLines[1] ? ' ' + visibleLines[1] : ''}</span>
            {isTypingBody && visibleLines.length === 1 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                aria-hidden="true"
              />
            )}
          </p>
          {visibleLines[1] && (
            <p className="text-[11px] sm:text-xs leading-relaxed text-white/60 sm:hidden">
              {visibleLines[1]}
              {isTypingBody && visibleLines.length === 2 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                  aria-hidden="true"
                />
              )}
            </p>
          )}
          {visibleLines[2] && (
            <p className="text-[11px] sm:text-xs leading-relaxed text-white/60">
              {visibleLines[2]}
              {isTypingBody && visibleLines.length === 3 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                  aria-hidden="true"
                />
              )}
            </p>
          )}
          {visibleLines[3] && (
            <p className="text-[11px] sm:text-xs leading-relaxed text-white/60">
              {visibleLines[3]}
              {isTypingBody && visibleLines.length === 4 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                  aria-hidden="true"
                />
              )}
            </p>
          )}
          {visibleLines[4] && (
            <p className="text-[11px] sm:text-xs leading-relaxed text-white/60">
              {visibleLines[4]}
              {isTypingBody && visibleLines.length === 5 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                  aria-hidden="true"
                />
              )}
            </p>
          )}
          {visibleLines[5] && (
            <p className="text-[11px] sm:text-xs leading-relaxed text-white/60">
              {visibleLines[5]}
              {isTypingBody && visibleLines.length === 6 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                  aria-hidden="true"
                />
              )}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="flex flex-row gap-2 sm:gap-3 shrink-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
