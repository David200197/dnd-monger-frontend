import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Games = () => {
  const { t } = useTranslation(['ui', 'common']);

  // TODO: Replace with actual data from backend
  const games = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('ui:games.availableGames')}</h1>
            <p className="text-xl text-muted-foreground">{t('ui:games.joinGameDesc')}</p>
          </div>
          <Link to="/games/create">
            <Button className="bg-gradient-primary hover:shadow-glow mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              {t('ui:games.createGame')}
            </Button>
          </Link>
        </div>

        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-4">{t('ui:games.noGamesAvailable')}</p>
                <Link to="/games/create">
                  <Button className="bg-gradient-primary hover:shadow-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('ui:games.createFirstGame')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game: any, index: number) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {game.name}
                      </CardTitle>
                      <Badge variant="secondary">{game.status}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{game.currentPlayers}/{game.maxPlayers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{game.createdAt}</span>
                      </div>
                    </div>
                    <Link to={`/game/${game.id}/lobby`}>
                      <Button className="w-full" variant="outline">
                        {t('ui:games.joinGame')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
