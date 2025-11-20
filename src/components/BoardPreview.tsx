import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const BoardPreview = () => {
  const { t } = useTranslation('board');

  // Simple grid for preview
  const gridSize = 12;
  const cells = Array.from({ length: gridSize * gridSize });

  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-hero">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-muted-foreground">
            Interactive grid-based gameplay
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-card">
            <div
              className="grid gap-0.5 bg-border/20 p-1 rounded-lg max-w-2xl mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {cells.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index % 20) * 0.01 }}
                  className="aspect-square bg-muted/30 hover:bg-primary/20 transition-colors duration-200 rounded-sm cursor-pointer"
                />
              ))}
            </div>

            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">{t('tokens.player')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full border border-destructive/20">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm">{t('tokens.enemy')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm">{t('tokens.npc')}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
