import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t('footer.message')}
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Lucas Cavalcante. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}