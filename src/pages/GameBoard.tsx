// src/pages/GameBoard.tsx (completamente renovado)
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useBoardStore } from "@/store/useBoardStore";
import { BoardStage } from "@/components/board/BoardStage";
import { DMToolbar } from "@/components/board/DMToolbar";
import { TokenLibrary } from "@/components/board/TokenLibrary";
import { InitiativeTracker } from "@/components/board/InitiativeTracker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Mic,
  MicOff,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const GameBoard = () => {
  const { t } = useTranslation(["board", "chat"]);
  const { id } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTokenLibrary, setShowTokenLibrary] = useState(true);
  const [showInitiative, setShowInitiative] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Inicializar escena si no hay ninguna
  const { scenes, createScene } = useBoardStore();
  useEffect(() => {
    if (scenes.length === 0) {
      createScene("Escena Inicial");
    }
  }, [scenes.length, createScene]);

  // Actualizar dimensiones del tablero
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Barra superior del DM */}
      <DMToolbar />

      {/* Área principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel lateral izquierdo - Biblioteca de tokens */}
        {showTokenLibrary && (
          <div className="w-80 border-r border-border/40 bg-card/50 backdrop-blur-sm flex flex-col">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="font-semibold">Biblioteca de Tokens</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTokenLibrary(false)}
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TokenLibrary />
            </div>
          </div>
        )}

        {/* Área central del tablero */}
        <div ref={containerRef} className="flex-1 relative bg-muted/20">
          {dimensions.width > 0 && dimensions.height > 0 && (
            <BoardStage width={dimensions.width} height={dimensions.height} />
          )}

          {/* Botón para mostrar/ocultar panel lateral */}
          {!showTokenLibrary && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 left-4"
              onClick={() => setShowTokenLibrary(true)}
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Panel lateral derecho */}
        <div className="flex">
          {/* Tracker de iniciativa */}
          {showInitiative && (
            <div className="w-64 border-l border-border/40 bg-card/50 backdrop-blur-sm">
              <div className="p-4 border-b border-border/40 flex items-center justify-between">
                <h3 className="font-semibold">Iniciativa</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInitiative(false)}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <InitiativeTracker />
            </div>
          )}

          {/* Chat */}
          {showChat && (
            <Card className="w-80 m-4 flex flex-col shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="p-4 border-b border-border/40 flex items-center justify-between">
                <h3 className="font-semibold">{t("chat:title")}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t("chat:noMessages")}
                </p>
              </div>
              <div className="p-4 border-t border-border/40">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t("chat:placeholder")}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm" className="bg-gradient-primary">
                    {t("chat:send")}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Barra inferior de estado */}
      <div className="h-8 border-t border-border/40 bg-background/80 backdrop-blur-lg flex items-center px-4 justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>
            Escala: {Math.round(useBoardStore.getState().scale * 100)}%
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span>Herramienta: {useBoardStore.getState().activeTool}</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInitiative(!showInitiative)}
          >
            <Users className="h-3 w-3 mr-1" />
            Iniciativa
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <MicOff className="h-3 w-3" />
            ) : (
              <Mic className="h-3 w-3" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-3 w-3" />
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
