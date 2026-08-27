import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Linkedin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Reveal } from '../lib/motion';
import { SERVICES } from '../data/services';
import { computeQuote, formatBRL, type Urgencia } from '../lib/pricing';
import { submitOrcamento } from '../lib/api';

const NOTICE_KEY = 'portfolio-quote-notice';

export function Contact() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : i18n.resolvedLanguage === 'es' ? 'es' : 'pt';

  const [selected, setSelected] = useState<string[]>([]);
  const [urgencia, setUrgencia] = useState<Urgencia>('normal');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ codigo: string } | null>(null);

  const preview = computeQuote(selected, urgencia, lang);

  function toggle(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nome.trim() || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('quote.emailError'));
      return;
    }
    if (selected.length === 0) {
      setError(t('quote.serviceError'));
      return;
    }

    setSending(true);
    try {
      const res = await submitOrcamento({
        nome: nome.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
        itens: selected.map((slug) => ({ slug, qtd: 1 })),
        urgencia,
        descricao: descricao.trim() || undefined,
      });
      setResult({ codigo: res.codigo });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('quote.submitError'));
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (result) {
      try {
        sessionStorage.setItem(NOTICE_KEY, result.codigo);
      } catch { /* noop */ }
    }
  }, [result]);

  const contactButtons = [
    { icon: Mail, href: 'mailto:cavalcanteprofissional@outlook.com', labelKey: 'cta.contact', primary: true },
    { icon: MessageCircle, href: `https://wa.me/5585996859051?text=${encodeURIComponent(t('cta.whatsappMsg'))}`, labelKey: 'cta.whatsapp', primary: false },
    { icon: Linkedin, href: 'https://linkedin.com/in/cavalcante-Lucas', labelKey: 'cta.linkedin', primary: false },
  ];

  if (result) {
    return (
      <section id="contact" className="py-20 px-4">
        <Reveal className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/20 border border-border p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            <div className="relative space-y-4">
              <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold">
                {t('quote.successTitle')}
              </motion.h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('quote.successBody')}
              </p>
              <div className="inline-block px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 font-mono text-2xl font-bold">
                {result.codigo}
              </div>
              <p className="text-sm text-muted-foreground">{t('quote.successNote')}</p>
            </div>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-4">
      <Reveal className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/20 border border-border p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

          <div className="relative text-center space-y-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="text-3xl md:text-4xl font-bold">
              {t('cta.title')}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }} className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('cta.subtitle')}
            </motion.p>
          </div>

          {/* Formulário de orçamento */}
          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
            <p className="font-semibold text-lg">{t('quote.title')}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quote-name" className="text-sm text-muted-foreground">{t('quote.name')}</label>
                <input id="quote-name" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label htmlFor="quote-email" className="text-sm text-muted-foreground">{t('quote.email')} *</label>
                <input id="quote-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="quote-whatsapp" className="text-sm text-muted-foreground">{t('quote.whatsapp')}</label>
              <input id="quote-whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+55 (85) 9 9999-9999" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50" />
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t('quote.services')} *</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICES.map((svc) => {
                  const active = selected.includes(svc.slug);
                  return (
                    <button
                      key={svc.slug}
                      type="button"
                      onClick={() => toggle(svc.slug)}
                      className={`text-left px-4 py-3 rounded-lg border transition-all ${
                        active ? 'bg-primary/15 border-primary/50' : 'bg-secondary/50 border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="font-medium">{svc.name[lang] ?? svc.slug}</span>
                      <span className="block text-xs text-muted-foreground mt-1">{formatBRL(svc.base_price * svc.complexity)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="quote-urg" className="text-sm text-muted-foreground">{t('quote.urgencyLabel')}</label>
              <select id="quote-urg" value={urgencia} onChange={(e) => setUrgencia(e.target.value as Urgencia)} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50">
                <option value="normal">{t('quote.urgency.normal')}</option>
                <option value="urgente">{t('quote.urgency.urgente')}</option>
                <option value="muito_urgente">{t('quote.urgency.muito')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quote-desc" className="text-sm text-muted-foreground">{t('quote.description')}</label>
              <textarea id="quote-desc" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50 resize-none" />
            </div>

            {selected.length > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
                <span className="text-sm text-muted-foreground">{t('quote.estimate')}</span>
                <span className="font-bold text-lg">{formatBRL(preview.total)}</span>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {t('quote.submit')}
            </button>
          </form>

          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">{t('quote.orDirect')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center">
            {contactButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <motion.a
                  key={btn.labelKey}
                  href={btn.href}
                  target={btn.href.startsWith('http') ? '_blank' : undefined}
                  rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    btn.primary ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/30 hover:-translate-y-0.5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{t(btn.labelKey)}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
