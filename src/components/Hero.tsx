import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github, FileText } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

export function Hero() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  return (
    <section
      id="hero"
      className="min-h-screen pt-20 md:pt-24 pb-16 flex items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-blue-light dark:bg-gradient-blue-dark opacity-50" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t('availability.label')}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-4xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}
            >
              {t('hero.name')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground font-medium"
            >
              {t('hero.title')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-lg max-w-xl"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-2"
            >
              <a
                href={`mailto:${t('contact.email')}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-blue text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Mail className="w-3.5 h-3.5" />
                {t('contact.email')}
              </a>
              <a
                href={t('contact.linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-xs font-medium transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href={t('contact.github')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-xs font-medium transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a
                href={t('hero.resume')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-xs font-medium transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                {t('buttons.resume')}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-64 h-72 md:w-88 md:h-96 mx-auto">
              <picture className="block w-full h-full">
                <source srcSet="/portfolio/images/profile/foto-perfil.webp" type="image/webp" />
                <img
                  src="/portfolio/images/profile/foto-perfil.png"
                  alt="Lucas Cavalcante"
                  width={288}
                  height={320}
                  loading="eager"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </picture>
              <div className="absolute -bottom-8 -right-4 w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center">
                <img
                  src={theme === 'dark'
                    ? '/portfolio/images/navbar/logo-navbar-darkmode.png'
                    : '/portfolio/images/navbar/logo-navbar-lightmode.png'}
                  alt="LC"
                  width={80}
                  height={80}
                  loading="lazy"
                  className="w-20 h-20"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
