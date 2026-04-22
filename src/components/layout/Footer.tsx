import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary/30 border-t border-border py-12">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t('contact.location')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{t('contact.phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{t('contact.email')}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Links</h3>
            <div className="space-y-2">
              <a href="#experience" className="block text-sm text-muted-foreground hover:text-primary">
                {t('nav.experience')}
              </a>
              <a href="#portfolio" className="block text-sm text-muted-foreground hover:text-primary">
                {t('nav.portfolio')}
              </a>
              <a href="#skills" className="block text-sm text-muted-foreground hover:text-primary">
                {t('nav.skills')}
              </a>
              <a href="#certifications" className="block text-sm text-muted-foreground hover:text-primary">
                {t('nav.certifications')}
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {t('footer.message')}
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lucas Cavalcante. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}