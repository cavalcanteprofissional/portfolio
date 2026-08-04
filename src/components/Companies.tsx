import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import companiesData from '../data/companies.json';
import { SectionHeader, Stagger, StaggerItem, STAGGER } from '../lib/motion';

export function Companies() {
  const { t } = useTranslation();
  const { companies } = companiesData;

  return (
    <section className="py-16 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          title={t('companies.title')}
          subtitle={t('companies.subtitle')}
          size="sm"
          spacing="mb-12"
        />

        <Stagger stagger={STAGGER.card} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {companies.map((company) => (
            <StaggerItem key={company.id}>
              <motion.a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex items-center justify-center p-4 rounded-soft bg-card/50 border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all min-h-[100px]"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  width={120}
                  height={60}
                  loading="lazy"
                  className="w-full h-full object-contain dark:brightness-0 dark:invert transition-all"
                />
              </motion.a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
