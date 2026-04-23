import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = [
  { key: 'portuguese', levelKey: 'native' },
  { key: 'english', levelKey: 'advanced' },
  { key: 'spanish', levelKey: 'intermediate' },
  { key: 'japanese', levelKey: 'basic' },
];

const levelColors = {
  native: 'bg-green-500',
  advanced: 'bg-blue-500',
  intermediate: 'bg-yellow-500',
  basic: 'bg-orange-500',
};

const levelWidths = {
  native: 'w-full',
  advanced: 'w-[75%]',
  intermediate: 'w-[50%]',
  basic: 'w-[25%]',
};

export function Languages() {
  const { t } = useTranslation();

  return (
    <section id="languages" className="py-24 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('sections.languages')}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.key}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t(`lang.${lang.key}`)}</h3>
                <span className="text-sm text-primary font-medium">
                  {t(`lang.level.${lang.levelKey}`)}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full ${levelColors[lang.levelKey as keyof typeof levelColors]} rounded-full`}
                  style={{ width: levelWidths[lang.levelKey as keyof typeof levelWidths] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}