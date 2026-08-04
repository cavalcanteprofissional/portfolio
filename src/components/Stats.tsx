import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Award, Users, Briefcase, Clock } from 'lucide-react';
import projectsData from '../data/projects.json';
import companiesData from '../data/companies.json';
import { translations } from '../i18n';
import { SectionHeader, Stagger, StaggerItem, STAGGER } from '../lib/motion';

const certCount = Object.keys(translations.pt.cert).length;
const projectCount = projectsData.projects.length;
const clientCount = companiesData.companies.length;

const statValues: Record<string, string> = {
  years: '6+',
  projects: `${projectCount}+`,
  clients: `${clientCount}+`,
  certifications: `${certCount}+`,
};

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
        <SectionHeader title={t('stats.title')} size="sm" spacing="mb-12" />

        <Stagger
          stagger={STAGGER.card}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {statIcons.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.key}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4"
                  >
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-primary mb-2"
                  >
                    {statValues[stat.key]}
                  </motion.div>
                  <div className="text-muted-foreground text-sm">
                    {t(`stats.${stat.key}`)}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
