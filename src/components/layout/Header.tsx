import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { LanguageSelector } from '../ui/LanguageSelector';

export function Header() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', href: '#' },
    { key: 'nav.showcase', href: '#showcase' },
    { key: 'nav.experience', href: '#experience' },
    { key: 'nav.portfolio', href: '#portfolio' },
    { key: 'nav.skills', href: '#skills' },
    { key: 'nav.certifications', href: '#certifications' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="section-container">
        <nav className="flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold text-primary">
            Lucas Cavalcante
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t(item.key)}
              </a>
            ))}
            <LanguageSelector />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {t(item.key)}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}