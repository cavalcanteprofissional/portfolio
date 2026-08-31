import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { X, Check, ArrowLeft, Send, CheckCircle2, Loader2, Zap } from 'lucide-react';
import { EASE, DURATION } from '../lib/motion';
import { SERVICES } from '../data/services';
import type { Urgencia } from '../lib/pricing';
import { submitOrcamento } from '../lib/api';

const URGENCIAS: Urgencia[] = ['normal', 'urgente', 'muito_urgente'];

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

export function QuoteModal({ open, onClose }: QuoteModalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : i18n.resolvedLanguage === 'es' ? 'es' : 'pt';

  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [urgencia, setUrgencia] = useState<Urgencia>('normal');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [descricao, setDescricao] = useState('');

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const reset = useCallback(() => {
    setStep(1);
    setSelected([]);
    setUrgencia('normal');
    setNome('');
    setEmail('');
    setWhatsapp('');
    setCpfCnpj('');
    setDescricao('');
    setError(null);
    setCode(null);
    setSending(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  function toggleService(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    previousFocusRef.current = prevFocus;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
    return () => {
      prevFocus?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (sending) return;
        handleClose();
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
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, sending, handleClose]);

  function goNext() {
    if (selected.length === 0) {
      setError(t('quote.serviceError'));
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nome.trim() || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('quote.emailError'));
      return;
    }

    setSending(true);
    try {
      const res = await submitOrcamento({
        nome: nome.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
        cpf_cnpj: cpfCnpj.trim() || undefined,
        itens: selected.map((slug) => ({ slug, qtd: 1 })),
        urgencia,
        descricao: descricao.trim() || undefined,
      });
      setCode(res.codigo);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('quote.submitError'));
    } finally {
      setSending(false);
    }
  }

  const inputCls =
    'w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50';

  const modal = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: DURATION.fast, ease: EASE }}
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: DURATION.base, ease: EASE }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h3 id="quote-modal-title" className="text-lg font-bold">{t('quote.title')}</h3>
          <button onClick={handleClose} aria-label={t('quote.close')} className="p-1.5 rounded-full hover:bg-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step < 3 && (
          <div className="px-6 pb-3">
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: DURATION.fast, ease: EASE }}
              />
            </div>
          </div>
        )}

        <div className="px-6 pb-6 pt-2">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t('quote.services')} *</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {SERVICES.map((svc) => {
                    const active = selected.includes(svc.slug);
                    return (
                      <button
                        key={svc.slug}
                        type="button"
                        onClick={() => toggleService(svc.slug)}
                        className={`text-left px-4 py-3 rounded-lg border transition-all ${
                          active ? 'bg-primary/15 border-primary/50' : 'bg-secondary/50 border-border hover:border-primary/30'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          {svc.name[lang] ?? svc.slug}
                          {active && <Check className="w-4 h-4 text-primary" />}
                        </span>
                        {svc.description?.[lang] && (
                          <span className="block text-xs text-muted-foreground mt-1">{svc.description[lang]}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t('quote.urgencyLabel')}</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label={t('quote.urgencyLabel')}>
                  {URGENCIAS.map((u) => {
                    const active = urgencia === u;
                    return (
                      <button
                        key={u}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setUrgencia(u)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border font-medium text-sm transition-all ${
                          active
                            ? 'bg-primary/15 border-primary/50 text-primary'
                            : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                        }`}
                      >
                        {active && <Zap className="w-3.5 h-3.5" />}
                        {t(`quote.urgency.${u}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button onClick={goNext} className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                {t('quote.next')}
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="qm-nome" className="text-sm text-muted-foreground">{t('quote.name')} *</label>
                <input id="qm-nome" value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label htmlFor="qm-email" className="text-sm text-muted-foreground">{t('quote.email')} *</label>
                <input id="qm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label htmlFor="qm-whatsapp" className="text-sm text-muted-foreground">{t('quote.whatsapp')}</label>
                <input id="qm-whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+55 (85) 9 9999-9999" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label htmlFor="qm-cpf" className="text-sm text-muted-foreground">{t('quote.cpfCnpj')}</label>
                <input id="qm-cpf" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} placeholder="000.000.000-00" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label htmlFor="qm-desc" className="text-sm text-muted-foreground">{t('quote.description')}</label>
                <textarea id="qm-desc" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
              </div>

              <p className="text-xs text-muted-foreground">{t('quote.privacy')}</p>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary hover:bg-secondary/80 border border-border">
                  <ArrowLeft className="w-4 h-4" />
                  {t('quote.back')}
                </button>
                <button type="submit" disabled={sending} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all">
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {t('quote.submit')}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 pt-2">
              <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
              <h4 className="text-xl font-bold">{t('quote.successTitle')}</h4>
              <p className="text-muted-foreground">{t('quote.successBody')}</p>
              {code && (
                <div className="inline-block px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 font-mono text-2xl font-bold">
                  {code}
                </div>
              )}
              <p className="text-sm text-muted-foreground">{t('quote.successNote')}</p>
              <button onClick={handleClose} className="w-full px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                {t('quote.close')}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(<AnimatePresence>{open && modal}</AnimatePresence>, document.body);
}
