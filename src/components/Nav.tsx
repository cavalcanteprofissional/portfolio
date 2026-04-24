import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Sun, Moon, Menu, X, Globe, ChevronDown, Github, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../stores/themeStore';
import i18n from '../i18n';

const languages = [
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
];

export function Nav() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => i18n.language || 'pt');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    setLangMenuOpen(false);
    localStorage.setItem('portfolio-lang', langCode);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('portfolio-lang');
    if (savedLang && savedLang !== currentLang) {
      i18n.changeLanguage(savedLang);
      setCurrentLang(savedLang);
    }
  }, []);

  const navItems = [
    { key: 'home', href: '#hero' },
    { key: 'experience', href: '#experience' },
    { key: 'portfolio', href: '#portfolio' },
    { key: 'skills', href: '#skills' },
    { key: 'certifications', href: '#certifications' },
    { key: 'languages', href: '#languages' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-soft">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center justify-center">
            {mounted && (
              <img
                src={theme === 'dark' 
                  ? '/portfolio/images/navbar/logo-navbar-darkmode.png' 
                  : '/portfolio/images/navbar/logo-navbar-lightmode.png'}
                alt="LC"
                className="h-8 w-auto"
              />
            )}
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-full transition-all"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div ref={langMenuRef} className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-secondary transition-colors text-sm font-medium"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" />
                <span className="w-6">{currentLang.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border/50 rounded-soft shadow-soft-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between ${
                        currentLang === lang.code ? 'text-primary font-medium bg-primary/5' : 'text-foreground'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-xs text-muted-foreground">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Hero() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  return (
    <section
      id="hero"
      className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden"
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
              className="flex flex-nowrap items-center gap-2 overflow-x-auto"
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
            <div className="relative w-72 h-80 md:w-88 md:h-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-blue rounded-2xl" />
              <div className="absolute inset-0 bg-card/90 rounded-xl overflow-hidden shadow-soft">
                <img
                  src="/portfolio/images/profile/foto-perfil.png"
                  alt="Lucas Cavalcante"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full flex items-center justify-center">
                <img
                  src={theme === 'dark' 
                    ? '/portfolio/images/navbar/logo-navbar-darkmode.png' 
                    : '/portfolio/images/navbar/logo-navbar-lightmode.png'}
                  alt="LC"
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