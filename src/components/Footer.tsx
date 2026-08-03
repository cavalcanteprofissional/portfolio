import { BookOpen, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  { 
    name: 'LinkedIn', 
    url: 'https://linkedin.com/in/cavalcante-lucas', 
    icon: Linkedin 
  },
  { 
    name: 'GitHub', 
    url: 'https://github.com/cavalcanteprofissional', 
    icon: Github 
  },
  { 
    name: 'Lattes', 
    url: 'http://lattes.cnpq.br/7686247677030579', 
    icon: BookOpen 
  },
  { 
    name: 'Email', 
    url: 'mailto:cavalcanteprofissional@outlook.com', 
    icon: Mail 
  },
  { 
    name: 'WhatsApp', 
    url: 'https://wa.me/5585996859051', 
    icon: Phone 
  },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/30 py-3"
    >
      <div className="section-container">
        <div className="flex items-center justify-center gap-3">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.03, duration: 0.3 }}
                className="p-2.5 rounded-full bg-secondary/30 hover:bg-gradient-blue hover:text-white transition-all group shadow-sm hover:shadow-soft"
                title={link.name}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.footer>
  );
}