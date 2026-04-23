import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import companiesData from '../data/companies.json';

export function Companies() {
  const { t } = useTranslation();
  const { companies } = companiesData;

  return (
    <section id="companies" className="py-16 bg-muted/20 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t('companies.title')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t('companies.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
          {companies.map((company, index) => (
            <motion.a
              key={company.id}
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="flex items-center justify-center p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 transition-all min-h-[140px]"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain dark:brightness-0 dark:invert"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}