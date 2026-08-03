import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
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
      <AnimatePresence>
        {!booted && <BootScreen onComplete={handleBootComplete} ready={resourcesReady} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background text-foreground">
        <a href="#main-content" className="skip-to-content">
          {t('acessibilidade.skipToContent')}
        </a>
        {booted && <Nav />}

        <PoolEffect />

        <main id="main-content" className="pb-20">
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
        </main>

        {booted && <Footer />}
        <ScrollToTop />
      </div>
    </ErrorBoundary>
  );
}

export default App;