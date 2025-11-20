import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';

export const Header = () => {
  const { t } = useTranslation(['common', 'ui']);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Dices className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('common:appName')}
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Button variant="ghost">{t('common:features')}</Button>
          <Button variant="ghost">{t('common:about')}</Button>
          <LanguageSwitcher />
          <Button variant="ghost" onClick={() => window.location.href = '/login'}>
            {t('ui:auth.login')}
          </Button>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all" onClick={() => window.location.href = '/signup'}>
            {t('ui:auth.signup')}
          </Button>
        </nav>
      </div>
    </header>
  );
};
