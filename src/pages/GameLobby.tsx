import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Crown, Play, Users } from 'lucide-react';

const GameLobby = () => {
  const { t } = useTranslation(['games', 'common']);
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with actual data from backend
  const game = {
    id,
    name: 'Epic Adventure',
    description: 'A thrilling campaign in the Forgotten Realms',
    maxPlayers: 4,
    dm: { username: 'GameMaster', role: 'dm' },
  };

  const players = [
    { id: '1', username: 'GameMaster', role: 'dm' },
    { id: '2', username: 'Player1', role: 'player' },
  ];

  const isReady = players.length >= 2;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:px-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/games')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common:back')}
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{game.name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {t('games:lobby')}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('games:players')} ({players.length}/{game.maxPlayers})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.role === 'dm' ? t('ui:roles.dm') : t('ui:roles.player')}
                        </p>
                      </div>
                    </div>
                    {player.role === 'dm' && (
                      <Crown className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t('games:gameInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('games:dm')}:</span>
                  <span className="font-medium">{game.dm.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('games:maxPlayers')}:</span>
                  <span className="font-medium">{game.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('games:status')}:</span>
                  <Badge variant="secondary">{t('games:waiting')}</Badge>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-gradient-primary hover:shadow-glow"
              disabled={!isReady}
              onClick={() => navigate(`/game/${id}/board`)}
            >
              <Play className="h-4 w-4 mr-2" />
              {t('games:startGame')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameLobby;
