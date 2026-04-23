import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Database,
  Terminal,
  GraduationCap,
  Laptop,
  Code,
  BookOpen,
  Gamepad,
  Palette,
  Wrench,
  FileText,
} from 'lucide-react';

const certifications = [
  {
    id: '1',
    titleKey: 'cert.1.title',
    icon: 'laptop-code',
    url: '/portfolio/documents/certifications/montagem_manutencao.pdf',
  },
  {
    id: '2',
    titleKey: 'cert.2.title',
    icon: 'palette',
    url: '/portfolio/documents/certifications/design_grafico.pdf',
  },
  {
    id: '3',
    titleKey: 'cert.3.title',
    icon: 'gamepad',
    url: null,
  },
  {
    id: '4',
    titleKey: 'cert.4.title',
    icon: 'graduation-cap',
    url: '/portfolio/documents/certifications/ciencias_sociais_ufc.pdf',
  },
  {
    id: '5',
    titleKey: 'cert.5.title',
    icon: 'code',
    url: '/portfolio/documents/certifications/fullstack_iel.pdf',
  },
  {
    id: '6',
    titleKey: 'cert.6.title',
    icon: 'terminal',
    url: '/portfolio/documents/certifications/devops_ada.pdf',
  },
  {
    id: '7',
    titleKey: 'cert.7.title',
    icon: 'database',
    url: '/portfolio/documents/certifications/ciencia_dados_uece.pdf',
  },
  {
    id: '8',
    titleKey: 'cert.8.title',
    icon: 'book-open',
    url: '/portfolio/documents/certifications/ads_unifor.pdf',
  },
  {
    id: '9',
    titleKey: 'cert.9.title',
    icon: 'wrench',
    url: '/portfolio/documents/certifications/engenharia_software.pdf',
  },
  {
    id: '10',
    titleKey: 'cert.10.title',
    icon: 'file-text',
    url: '/portfolio/documents/certifications/banco_dados.pdf',
  },
];

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  'laptop-code': Laptop,
  palette: Palette,
  gamepad: Gamepad,
  'graduation-cap': GraduationCap,
  code: Code,
  terminal: Terminal,
  database: Database,
  'book-open': BookOpen,
  wrench: Wrench,
  'file-text': FileText,
};

export function Certifications() {
  const { t } = useTranslation();

  return (
    <section id="certifications" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('sections.certifications')}
          </h2>
          <p className="text-muted-foreground">{t('certifications.subtitle')}</p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => {
            const IconComponent = iconComponents[cert.icon] || FileText;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {t(cert.titleKey)}
                    </h3>
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {t('buttons.view')}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}