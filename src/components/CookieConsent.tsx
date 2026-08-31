import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useConsentStore } from '../stores/consentStore';
import { EASE, DURATION } from '../lib/motion';
import { MONO_FONT } from '../lib/constants';

interface CookieConsentProps {
  visible: boolean;
}

export function CookieConsent({ visible }: CookieConsentProps) {
  const { t } = useTranslation();
  const { consent, setConsent } = useConsentStore();
  const [typedHeader, setTypedHeader] = useState(0);
  const [typedBody, setTypedBody] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const copy = useMemo(
    () => ({
      header: t('consent.header'),
      body: t('consent.body'),
      accept: t('consent.accept'),
    }),
    [t],
  );
  const flatBody = copy.body;

  useEffect(() => {
    if (!visible || consent !== null) return;
    setTypedHeader(0);
    setTypedBody(0);
    setShowButtons(false);
  }, [visible, consent]);

  useEffect(() => {
    if (!visible || consent !== null) return;

    if (typedHeader < copy.header.length) {
      const timer = setTimeout(() => setTypedHeader((p) => p + 1), 8);
      return () => clearTimeout(timer);
    }

    if (typedBody < flatBody.length) {
      const timer = setTimeout(() => setTypedBody((p) => p + 1), 4);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setShowButtons(true), 120);
    return () => clearTimeout(timer);
  }, [visible, consent, typedHeader, typedBody, copy, flatBody]);

  const handleAccept = useCallback(() => setConsent(true), [setConsent]);

  const handleBackdropClick = useCallback(() => {
    setDismissed(true);
  }, []);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const show = visible && consent === null && !dismissed;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDismissed(true);
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show]);

  useEffect(() => {
    if (!show || !showButtons) return;
    const btn = panelRef.current?.querySelector<HTMLButtonElement>('button');
    btn?.focus();
  }, [show, showButtons]);

  const headerChars = copy.header.slice(0, typedHeader);
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

      <AnimatePresence>
        {show && (
          <motion.div
            key="cookie-consent"
            ref={panelRef}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE }}
            className="fixed bottom-0 inset-x-0 z-[55] p-3 sm:p-4 md:p-6 pointer-events-auto"
            onClick={handleContainerClick}
          >
            <ModalCard>
              <ModalContent
                t={copy}
                headerChars={headerChars}
                typedHeader={typedHeader}
                visibleLines={visibleLines}
                isTypingBody={isTypingBody}
                showButtons={showButtons}
              >
                <button
                  type="button"
                  onClick={handleAccept}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 sm:flex-none text-[11px] sm:text-xs font-semibold text-white transition-all rounded border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/25 boot-glow-text cookie-accept-glow"
                  style={{ fontFamily: MONO_FONT }}
                >
                  {copy.accept}
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
  t: { header: string; body: string; accept: string };
  headerChars: string;
  typedHeader: number;
  visibleLines: string[];
  isTypingBody: boolean;
  showButtons: boolean;
  children: React.ReactNode;
}

function ModalContent({
  t,
  headerChars,
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
          {[0, 1, 2, 3].map((idx) => (
            <p
              key={idx}
              className="text-[11px] sm:text-xs leading-relaxed text-white/60"
            >
              {visibleLines[idx] ?? ''}
              {isTypingBody && visibleLines.length === idx + 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-block w-[0.5em] h-[1.1em] bg-white/70 align-text-bottom ml-px"
                  aria-hidden="true"
                />
              )}
            </p>
          ))}
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
