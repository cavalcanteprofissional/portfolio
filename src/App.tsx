import { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import { Companies } from './components/sections/Companies';
import { TechStack } from './components/sections/TechStack';
import './i18n';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
        <div className="section-container flex justify-between items-center">
          <h1 className="text-xl font-bold">Lucas Cavalcante</h1>
          <button
            onClick={() => useThemeStore.getState().toggleTheme()}
            className="p-2 rounded border"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="section-container py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Lucas Cavalcante</h2>
          <p className="text-muted-foreground">Analista de Dados | IA & Machine Learning</p>
        </section>

        <Companies />
        <TechStack />
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="section-container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Lucas Cavalcante</p>
        </div>
      </footer>
    </div>
  );
}

export default App;