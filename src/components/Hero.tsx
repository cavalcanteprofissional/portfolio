import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github, FileText, ChevronDown, MessageCircle } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { BOOT_TIMELINE, EASE, STAGGER, scaleIn, slideFrom, staggerChild, staggerContainer } from '../lib/motion';

export function Hero() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [bioOpen, setBioOpen] = useState(false);

  const heroButtons = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
      className="grid grid-cols-1 gap-y-6 justify-items-center md:justify-items-start"
    >
      <a
        href={`mailto:${t('contact.email')}`}
        className="w-full max-w-xs md:max-w-md inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-gradient-blue text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <Mail className="w-4 h-4" aria-hidden="true" />
        {t('contact.email')}
      </a>
      <div className="w-full max-w-xs md:max-w-md flex items-center justify-between gap-2">
        <a
          href={t('contact.linkedin')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="inline-flex items-center justify-center gap-1.5 w-11 h-11 md:w-auto md:h-auto md:px-3 md:py-3 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary md:text-[10px] lg:text-xs font-medium whitespace-nowrap transition-all"
        >
          <Linkedin className="w-4 h-4 md:w-3.5 md:h-3.5" aria-hidden="true" />
          <span className="hidden md:inline">LinkedIn</span>
        </a>
        <a
          href="https://wa.me/5585996859051"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="inline-flex items-center justify-center gap-1.5 w-11 h-11 md:w-auto md:h-auto md:px-3 md:py-3 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary md:text-[10px] lg:text-xs font-medium whitespace-nowrap transition-all"
        >
          <MessageCircle className="w-4 h-4 md:w-3.5 md:h-3.5" aria-hidden="true" />
          <span className="hidden md:inline">WhatsApp</span>
        </a>
        <a
          href={t('contact.github')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="inline-flex items-center justify-center gap-1.5 w-11 h-11 md:w-auto md:h-auto md:px-3 md:py-3 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary md:text-[10px] lg:text-xs font-medium whitespace-nowrap transition-all"
        >
          <Github className="w-4 h-4 md:w-3.5 md:h-3.5" aria-hidden="true" />
          <span className="hidden md:inline">GitHub</span>
        </a>
        <a
          href={t('hero.resume')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('buttons.resume')}
          className="inline-flex items-center justify-center gap-1.5 w-11 h-11 md:w-auto md:h-auto md:px-3 md:py-3 rounded-full border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary md:text-[10px] lg:text-xs font-medium whitespace-nowrap transition-all"
        >
          <FileText className="w-4 h-4 md:w-3.5 md:h-3.5" aria-hidden="true" />
          <span className="hidden md:inline">{t('buttons.resume')}</span>
        </a>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="show"
      variants={slideFrom('up', 80, BOOT_TIMELINE.hero)}
      className="min-h-screen pt-20 md:pt-24 pb-16 flex items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-blue-light dark:bg-gradient-blue-dark opacity-50" />
      <img
        src="/portfolio-cavalcante/images/map/fortaleza-blueprint.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-10 dark:opacity-5"
      />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer(STAGGER.child, BOOT_TIMELINE.hero + BOOT_TIMELINE.heroChildren)}
            className="space-y-6 text-center md:text-left"
          >
            <motion.div variants={staggerChild()}>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" aria-hidden="true"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                {t('availability.label')}
              </div>
            </motion.div>

            <motion.div variants={staggerChild()} className="md:hidden">
              <div className="relative w-48 h-56 mx-auto">
                <a
                  href={t('contact.github')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="glow-hover group relative block w-full h-full rounded-2xl"
                >
                  <img
                    src="/portfolio-cavalcante/images/profile/foto-perfil.webp"
                    alt="Lucas Cavalcante"
                    width={192}
                    height={224}
                    loading="eager"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Github className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </div>
                </a>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full flex items-center justify-center pointer-events-none">
                  <img
                    src={theme === 'dark'
                      ? '/portfolio-cavalcante/images/navbar/logo-navbar-darkmode.png'
                      : '/portfolio-cavalcante/images/navbar/logo-navbar-lightmode.png'}
                    alt="LC"
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-14 h-14"
                  />
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={staggerChild()}
              className={`text-4xl lg:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gradient-blue'}`}
            >
              {t('hero.name')}
            </motion.h1>

            <motion.button
              type="button"
              aria-expanded={bioOpen}
              aria-controls="hero-bio"
              onClick={() => setBioOpen((v) => !v)}
              variants={staggerChild()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`md:hidden inline-flex items-center gap-2 text-xl font-medium transition-colors duration-300 ${
                bioOpen ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span>{t('hero.title')}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${bioOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </motion.button>

            <motion.div
              id="hero-bio"
              initial={false}
              animate={{ height: bioOpen ? 'auto' : 0, opacity: bioOpen ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="md:hidden overflow-hidden"
            >
              <p className="text-muted-foreground text-base leading-relaxed mt-3">
                {t('hero.description')}
              </p>
              <div className="mt-4">
                {heroButtons}
              </div>
            </motion.div>

            <motion.p variants={staggerChild()} className="hidden md:block text-lg text-muted-foreground font-medium md:whitespace-nowrap">
              {t('hero.title')}
            </motion.p>

            <motion.p variants={staggerChild()} className="hidden md:block text-muted-foreground text-lg max-w-xl">
              {t('hero.description')}
            </motion.p>

            <div className="hidden md:block">
              {heroButtons}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={scaleIn(0.25)}
            className="relative hidden md:block"
          >
            <div className="relative w-64 h-72 md:w-88 md:h-96 mx-auto">
              <a
                href={t('contact.github')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="glow-hover group relative block w-full h-full rounded-2xl"
              >
                <img
                  src="/portfolio-cavalcante/images/profile/foto-perfil.webp"
                  alt="Lucas Cavalcante"
                  width={288}
                  height={320}
                  loading="eager"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Github className="w-14 h-14 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </div>
              </a>
              <div className="absolute -bottom-14 -right-14 w-28 h-28 md:-bottom-16 md:-right-16 md:w-32 md:h-32 rounded-full flex items-center justify-center pointer-events-none">
                <img
                  src={theme === 'dark'
                    ? '/portfolio-cavalcante/images/navbar/logo-navbar-darkmode.png'
                    : '/portfolio-cavalcante/images/navbar/logo-navbar-lightmode.png'}
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
    </motion.section>
  );
}
