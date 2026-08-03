import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useThemeStore } from './stores/themeStore';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Nav, Hero, Stats, Footer, ScrollToTop, BootScreen, PoolEffect } from './components';
import './i18n';

const Companies = lazy(() => import('./components/Companies').then(m => ({ default: m.Companies })));
const TechStack = lazy(() => import('./components/TechStack').then(m => ({ default: m.TechStack })));
const Experience = lazy(() => import('./components/Experience').then(m => ({ default: m.Experience })));
const Portfolio = lazy(() => import('./components/Portfolio').then(m => ({ default: m.Portfolio })));
const Skills = lazy(() => import('./components/Skills').then(m => ({ default: m.Skills })));
// const Showcase = lazy(() => import('./components/Showcase').then(m => ({ default: m.Showcase })));
const Certifications = lazy(() => import('./components/Certifications').then(m => ({ default: m.Certifications })));
const Languages = lazy(() => import('./components/Languages').then(m => ({ default: m.Languages })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));

const SectionFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem('booted') === 'true'
  );
  const [resourcesReady, setResourcesReady] = useState(false);

  useEffect(() => {
    if (booted) return;

    let cancelled = false;
    const finish = () => {
      if (!cancelled) setResourcesReady(true);
    };

    const chunks = Promise.all([
      import('./components/Companies'),
      import('./components/TechStack'),
      import('./components/Experience'),
      import('./components/Portfolio'),
      import('./components/Skills'),
      import('./components/Certifications'),
      import('./components/Languages'),
      import('./components/FAQ'),
      import('./components/Contact'),
    ]).catch(() => {});

    const load = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    });

    const fallback = setTimeout(finish, 8000);

    Promise.all([chunks, load]).then(() => {
      clearTimeout(fallback);
      finish();
    });

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [booted]);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('booted', 'true');
    setBooted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {!booted && <BootScreen onComplete={handleBootComplete} ready={resourcesReady} />}
        </AnimatePresence>

        <motion.div
          className="fixed inset-0 z-[45] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: booted ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: booted ? 0.05 : 0 }}
          style={{ backgroundColor: 'hsl(215 45% 8%)' }}
          aria-hidden="true"
        />

        <div className="min-h-screen bg-background text-foreground">
          <a href="#main-content" className="skip-to-content">
            {t('acessibilidade.skipToContent')}
          </a>
          {booted && <Nav />}

          <PoolEffect intense={!booted} />

          <motion.main
            id="main-content"
            className="pb-20"
            initial={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
            animate={
              booted
                ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                : { opacity: 0, scale: 1.03, filter: 'blur(8px)' }
            }
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {booted && <Hero />}
            <Stats />
            <Suspense fallback={<SectionFallback />}><Companies /></Suspense>
            <Suspense fallback={<SectionFallback />}><TechStack /></Suspense>
            <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
            <Suspense fallback={<SectionFallback />}><Portfolio /></Suspense>
            <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
            {/* <Suspense fallback={<SectionFallback />}><Showcase /></Suspense> */}
            <Suspense fallback={<SectionFallback />}><Certifications /></Suspense>
            <Suspense fallback={<SectionFallback />}><Languages /></Suspense>
            <Suspense fallback={<SectionFallback />}><FAQ /></Suspense>
            <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
          </motion.main>

          {booted && <Footer />}
          <ScrollToTop />
        </div>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;