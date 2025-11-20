import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Grid3x3, Wifi, Mic, Eye } from 'lucide-react';

const features = [
  { icon: Grid3x3, key: 'interactiveBoard' },
  { icon: Wifi, key: 'realtime' },
  { icon: Mic, key: 'voiceChat' },
  { icon: Eye, key: 'fogOfWar' },
];

export const Features = () => {
  const { t } = useTranslation('ui');

  return (
    <section className="py-24 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-primary">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {t(`features.${feature.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(`features.${feature.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
