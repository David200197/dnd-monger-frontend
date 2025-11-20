import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ZoomIn,
  ZoomOut,
  Move,
  Plus,
  Eye,
  MessageSquare,
  Mic,
  MicOff,
  Settings,
  Users,
} from 'lucide-react';

const GameBoard = () => {
  const { t } = useTranslation(['board', 'ui']);
  const { id } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-lg flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{t('board:title')}</Badge>
          <span className="text-sm text-muted-foreground">Game #{id}</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Move className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('board:addToken')}
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            {t('board:toggleFog')}
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Board Area */}
        <div className="flex-1 relative bg-gradient-to-br from-background via-background-secondary to-background">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* TODO: Implement actual board with grid, tokens, drag & drop */}
            <div className="text-center space-y-4">
              <div className="w-full max-w-2xl aspect-square border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">{t('board:title')}</p>
                  <p className="text-sm">{t('board:grid')} - Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <Card className="w-80 m-4 flex flex-col shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="p-4 border-b border-border/40">
              <h3 className="font-semibold">{t('ui:chat.title')}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('ui:chat.noMessages')}
              </p>
            </div>
            <div className="p-4 border-t border-border/40">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('ui:chat.placeholder')}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" className="bg-gradient-primary">
                  {t('ui:chat.send')}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
