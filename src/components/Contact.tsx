import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { FileText, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { Reveal } from '../lib/motion';
import { QuoteModal } from './QuoteModal';

export function Contact() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const contactButtons = [
    { icon: Mail, href: 'mailto:cavalcanteprofissional@outlook.com', labelKey: 'cta.contact', primary: false },
    { icon: MessageCircle, href: `https://wa.me/5585996859051?text=${encodeURIComponent(t('cta.whatsappMsg'))}`, labelKey: 'cta.whatsapp', primary: false },
    { icon: Linkedin, href: 'https://linkedin.com/in/cavalcante-Lucas', labelKey: 'cta.linkedin', primary: false },
  ];

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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <motion.button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                {t('quote.requestCta')}
              </motion.button>

              {contactButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <motion.a
                    key={btn.labelKey}
                    href={btn.href}
                    target={btn.href.startsWith('http') ? '_blank' : undefined}
                    rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/30 hover:-translate-y-0.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span>{t(btn.labelKey)}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>
      </Reveal>

      <QuoteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
