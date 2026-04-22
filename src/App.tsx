import { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Stats } from './components/sections/Stats';
import { Companies } from './components/sections/Companies';
import { TechStack } from './components/sections/TechStack';
import { InteractiveShowcase } from './components/sections/InteractiveShowcase';
import { Experience } from './components/sections/Experience';
import { Portfolio } from './components/sections/Portfolio';
import { Skills } from './components/sections/Skills';
import { Certifications } from './components/sections/Certifications';
import { Languages } from './components/sections/Languages';
import { FAQ } from './components/sections/FAQ';
import { CallToAction } from './components/sections/CallToAction';
import { FloatingCTA } from './components/sections/FloatingCTA';
import './i18n';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main>
        <Hero />
        <Stats />
        <Companies />
        <TechStack />
        <InteractiveShowcase />
        <Experience />
        <Portfolio />
        <Skills />
        <Certifications />
        <Languages />
        <FAQ />
        <CallToAction />
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
}

export default App;