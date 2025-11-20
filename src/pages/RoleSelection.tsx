import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices, Sword, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const RoleSelection = () => {
  const { t } = useTranslation(['ui', 'common']);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'player' | 'dm' | null>(null);

  const handleRoleSelection = () => {
    if (!selectedRole) return;
    // TODO: Save role to backend
    console.log('Selected role:', selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Dices className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('ui:roles.selectRole')}
          </h1>
          <p className="text-muted-foreground">{t('common:welcome')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                selectedRole === 'player'
                  ? 'border-primary shadow-glow bg-card/90'
                  : 'border-border/50 hover:border-primary/50 bg-card/80'
              } backdrop-blur-sm`}
              onClick={() => setSelectedRole('player')}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-lg bg-gradient-primary">
                    <Sword className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">{t('ui:roles.player')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {t('ui:hero.playAsPlayer')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                selectedRole === 'dm'
                  ? 'border-primary shadow-glow bg-card/90'
                  : 'border-border/50 hover:border-primary/50 bg-card/80'
              } backdrop-blur-sm`}
              onClick={() => setSelectedRole('dm')}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-lg bg-gradient-primary">
                    <Crown className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">{t('ui:roles.dm')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {t('ui:hero.playAsDM')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole}
            className="bg-gradient-primary hover:shadow-glow px-8 py-6 text-lg"
          >
            {t('common:getStarted')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
