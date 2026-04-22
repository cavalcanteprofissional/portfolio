import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { companiesData } from '../../data/companies.ts';

export function Companies() {
  const { t } = useTranslation();

  return (
    <section id="companies" className="py-16">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('companies.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('companies.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {companiesData.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-4 bg-card rounded-lg border border-border"
            >
              <img
                src={`/companies/${company.logo}`}
                alt={company.name}
                className="h-8 md:h-12 w-auto grayscale hover:grayscale-0 transition-all"
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="#contact" className="inline-flex items-center gap-2 text-primary hover:underline">
            {t('buttons.collaborate')} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}