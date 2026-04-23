import { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import {
  Nav,
  Hero,
  Stats,
  Companies,
  Experience,
  Portfolio,
  Skills,
  Certifications,
  Languages,
  TechStack,
  FAQ,
  Contact,
  Footer,
} from './components';
import './i18n';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        <Hero />
        <Stats />
        <Companies />
        <TechStack />
        <Experience />
        <Portfolio />
        <Skills />
        <Certifications />
        <Languages />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;