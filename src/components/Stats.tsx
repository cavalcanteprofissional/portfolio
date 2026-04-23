import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Award, Users, Briefcase, Clock } from 'lucide-react';

const statIcons = [
  { key: 'years', icon: Clock },
  { key: 'projects', icon: Briefcase },
  { key: 'clients', icon: Users },
  { key: 'certifications', icon: Award },
];

export function Stats() {
  const { t } = useTranslation();

  return (
    <section id="stats" className="py-16 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t('stats.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statIcons.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-primary mb-2"
                >
                  {t(`stats.${stat.key}Value`)}
                </motion.div>
                <div className="text-muted-foreground text-sm">
                  {t(`stats.${stat.key}`)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}