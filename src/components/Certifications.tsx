import { useTranslation } from 'react-i18next';
import { SectionHeader, Stagger, StaggerItem, STAGGER } from '../lib/motion';
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
  ExternalLink,
} from 'lucide-react';

const certifications = [
  {
    id: '10',
    titleKey: 'cert.10.title',
    yearKey: 'cert.10.year',
    icon: 'file-text',
    url: '/portfolio-cavalcante/documents/certifications/banco_dados.pdf',
  },
  {
    id: '9',
    titleKey: 'cert.9.title',
    yearKey: 'cert.9.year',
    icon: 'wrench',
    url: '/portfolio-cavalcante/documents/certifications/engenharia_software.pdf',
  },
  {
    id: '8',
    titleKey: 'cert.8.title',
    yearKey: 'cert.8.year',
    icon: 'book-open',
    url: '/portfolio-cavalcante/documents/certifications/ads_unifor.pdf',
  },
  {
    id: '7',
    titleKey: 'cert.7.title',
    yearKey: 'cert.7.year',
    icon: 'database',
    url: '/portfolio-cavalcante/documents/certifications/ciencia_dados_uece.pdf',
  },
  {
    id: '6',
    titleKey: 'cert.6.title',
    yearKey: 'cert.6.year',
    icon: 'terminal',
    url: '/portfolio-cavalcante/documents/certifications/devops_ada.pdf',
  },
  {
    id: '5',
    titleKey: 'cert.5.title',
    yearKey: 'cert.5.year',
    icon: 'code',
    url: '/portfolio-cavalcante/documents/certifications/fullstack_iel.pdf',
  },
  {
    id: '4',
    titleKey: 'cert.4.title',
    yearKey: 'cert.4.year',
    icon: 'graduation-cap',
    url: '/portfolio-cavalcante/documents/certifications/ciencias_sociais_ufc.pdf',
  },
  {
    id: '3',
    titleKey: 'cert.3.title',
    yearKey: 'cert.3.year',
    icon: 'gamepad',
    url: '/portfolio-cavalcante/documents/certifications/pjd_estacio.pdf',
  },
  {
    id: '2',
    titleKey: 'cert.2.title',
    yearKey: 'cert.2.year',
    icon: 'palette',
    url: '/portfolio-cavalcante/documents/certifications/design_grafico.pdf',
  },
  {
    id: '1',
    titleKey: 'cert.1.title',
    yearKey: 'cert.1.year',
    icon: 'laptop-code',
    url: '/portfolio-cavalcante/documents/certifications/montagem_manutencao.pdf',
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
        <SectionHeader
          title={t('sections.certifications')}
          subtitle={t('certifications.subtitle')}
          spacing="mb-16"
        />

        <Stagger stagger={STAGGER.card} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => {
            const IconComponent = iconComponents[cert.icon] || FileText;

            return (
              <StaggerItem key={cert.id}>
                <div className="bg-card/80 backdrop-blur-sm rounded-soft-xl border border-border/30 p-5 hover:border-primary/30 hover:shadow-soft-lg transition-all group flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-full bg-gradient-blue text-white">
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                      {t(cert.yearKey)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {t(cert.titleKey)}
                  </h3>
                  
                  <div className="mt-auto pt-2">
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                      >
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        {t('buttons.view')}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
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