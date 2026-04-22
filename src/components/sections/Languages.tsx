import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Languages() {
  const { t } = useTranslation();
  const languages = t('languages.items', { returnObjects: true }) as Array<{
    language: string;
    level: string;
    flag: string;
  }>;

  return (
    <section id="languages" className="py-16 bg-secondary/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('languages.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('languages.subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.language}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 bg-card rounded-lg border border-border flex items-center gap-4"
            >
              <span className="text-3xl">{lang.flag}</span>
              <div>
                <h3 className="font-semibold">{lang.language}</h3>
                <p className="text-sm text-muted-foreground">{lang.level}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}