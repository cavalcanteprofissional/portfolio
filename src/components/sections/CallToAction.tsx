import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';

export function CallToAction() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-secondary/50 to-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('cta.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:lucascavalcante.dev@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {t('cta.email')}
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {t('cta.whatsapp')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}