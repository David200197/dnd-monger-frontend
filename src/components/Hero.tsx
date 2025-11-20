import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Swords, Shield } from 'lucide-react';

export const Hero = () => {
  const { t } = useTranslation('ui');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-sm font-medium text-primary">{t('common:tagline')}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-muted-foreground/80 max-w-2xl mx-auto"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Swords className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {t('hero.playAsPlayer')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Shield className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t('hero.playAsDM')}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
    </section>
  );
};
