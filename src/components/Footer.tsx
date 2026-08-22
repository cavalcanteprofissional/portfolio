import { BookOpen, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { BOOT_TIMELINE, STAGGER, slideFrom, staggerChild, staggerContainer } from '../lib/motion';

export function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/cavalcante-Lucas',
      icon: Linkedin
    },
    {
      name: 'GitHub',
      url: 'https://github.com/cavalcanteprofissional',
      icon: Github
    },
    {
      name: 'Lattes',
      url: 'https://lattes.cnpq.br/7686247677030579',
      icon: BookOpen
    },
    {
      name: 'Email',
      url: 'mailto:cavalcanteprofissional@outlook.com',
      icon: Mail
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/5585996859051?text=${encodeURIComponent(t('cta.whatsappMsg'))}`,
      icon: Phone
    },
  ];
  return (
    <motion.footer
      initial="hidden"
      animate="show"
      variants={slideFrom('up', 60, BOOT_TIMELINE.footer)}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/30 py-3"
    >
      <div className="section-container">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer(STAGGER.child, BOOT_TIMELINE.footer)}
          className="flex items-center justify-center gap-3"
        >
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerChild()}
                className="p-2.5 rounded-full bg-secondary/30 hover:bg-gradient-blue hover:text-white transition-all group shadow-sm hover:shadow-soft"
                title={link.name}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </motion.footer>
  );
}
