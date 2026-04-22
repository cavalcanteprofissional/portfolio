import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Stats() {
  const { t } = useTranslation();

  const stats = [
    { key: 'stats.years', value: '5+' },
    { key: 'stats.projects', value: '30+' },
    { key: 'stats.clients', value: '15+' },
    { key: 'stats.certifications', value: '8+' },
  ];

  return (
    <section id="stats" className="py-16 bg-secondary/30">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {t(stat.key)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}