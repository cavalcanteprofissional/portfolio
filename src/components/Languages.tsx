import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/themeStore';
import { Star } from 'lucide-react';

const languages = [
  { key: 'portuguese', stars: 5 },
  { key: 'english', stars: 4 },
  { key: 'spanish', stars: 3 },
  { key: 'japanese', stars: 2 },
];

const starColors: Record<number, string> = {
  5: 'text-yellow-500',
  4: 'text-blue-500',
  3: 'text-yellow-500',
  2: 'text-orange-500',
};

const levelLabels: Record<number, string> = {
  5: 'lang.level.native',
  4: 'lang.level.advanced',
  3: 'lang.level.intermediate',
  2: 'lang.level.basic',
};

export function Languages() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  return (
    <section id="languages" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}>
            {t('sections.languages')}
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.key}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 p-6 hover:shadow-soft-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{t(`lang.${lang.key}`)}</h3>
                <span className="text-sm text-muted-foreground font-medium">
                  {t(levelLabels[lang.stars])}
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <motion.div
                    key={starIndex}
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1 + starIndex * 0.05,
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        starIndex < lang.stars
                          ? starColors[lang.stars as keyof typeof starColors]
                          : 'text-muted/30'
                      } fill-current`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}