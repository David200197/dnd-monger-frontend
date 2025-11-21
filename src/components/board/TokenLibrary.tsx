// src/components/GameBoard/TokenLibrary.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Circle,
  Square,
  Triangle,
  Skull,
  User,
  Shield,
  Search,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface TokenTemplate {
  id: string;
  name: string;
  type: "circle" | "square" | "triangle" | "custom";
  color: string;
  size: number;
  category: "players" | "npcs" | "monsters" | "objects";
}

const defaultTokens: TokenTemplate[] = [
  // Jugadores
  {
    id: "player-1",
    name: "Jugador",
    type: "circle",
    color: "#4f46e5",
    size: 50,
    category: "players",
  },
  {
    id: "player-2",
    name: "Guerrero",
    type: "circle",
    color: "#dc2626",
    size: 50,
    category: "players",
  },
  {
    id: "player-3",
    name: "Mago",
    type: "circle",
    color: "#7c3aed",
    size: 50,
    category: "players",
  },
  {
    id: "player-4",
    name: "Pícaro",
    type: "circle",
    color: "#059669",
    size: 50,
    category: "players",
  },

  // NPCs
  {
    id: "npc-1",
    name: "NPC Amigable",
    type: "circle",
    color: "#10b981",
    size: 45,
    category: "npcs",
  },
  {
    id: "npc-2",
    name: "Mercader",
    type: "circle",
    color: "#f59e0b",
    size: 45,
    category: "npcs",
  },
  {
    id: "npc-3",
    name: "Aldeano",
    type: "circle",
    color: "#84cc16",
    size: 45,
    category: "npcs",
  },

  // Monstruos
  {
    id: "monster-1",
    name: "Goblin",
    type: "circle",
    color: "#65a30d",
    size: 40,
    category: "monsters",
  },
  {
    id: "monster-2",
    name: "Orco",
    type: "circle",
    color: "#15803d",
    size: 55,
    category: "monsters",
  },
  {
    id: "monster-3",
    name: "Dragón",
    type: "circle",
    color: "#dc2626",
    size: 80,
    category: "monsters",
  },
  {
    id: "monster-4",
    name: "Esqueleto",
    type: "circle",
    color: "#6b7280",
    size: 45,
    category: "monsters",
  },
  {
    id: "monster-5",
    name: "Zombie",
    type: "circle",
    color: "#525252",
    size: 50,
    category: "monsters",
  },

  // Objetos
  {
    id: "object-1",
    name: "Cofre",
    type: "square",
    color: "#d97706",
    size: 40,
    category: "objects",
  },
  {
    id: "object-2",
    name: "Poción",
    type: "circle",
    color: "#db2777",
    size: 30,
    category: "objects",
  },
  {
    id: "object-3",
    name: "Arma",
    type: "triangle",
    color: "#374151",
    size: 35,
    category: "objects",
  },
  {
    id: "object-4",
    name: "Trampa",
    type: "triangle",
    color: "#ef4444",
    size: 40,
    category: "objects",
  },
];

const categoryIcons = {
  players: User,
  npcs: Shield,
  monsters: Skull,
  objects: Square,
};

const categoryLabels = {
  players: "Jugadores",
  npcs: "PNJs",
  monsters: "Monstruos",
  objects: "Objetos",
};

export const TokenLibrary = () => {
  const { addToken } = useBoardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleAddToken = (template: TokenTemplate) => {
    addToken({
      name: template.name,
      position: {
        x: window.innerWidth / 2 - template.size / 2,
        y: window.innerHeight / 2 - template.size / 2,
      },
      size: template.size,
      rotation: 0,
      health:
        template.category === "monsters" ? { current: 30, max: 30 } : undefined,
      conditions: [],
      layer: "token",
      locked: false,
    });
  };

  const filteredTokens = defaultTokens.filter((token) => {
    const matchesSearch = token.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || token.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tokensByCategory = filteredTokens.reduce((acc, token) => {
    if (!acc[token.category]) {
      acc[token.category] = [];
    }
    acc[token.category].push(token);
    return acc;
  }, {} as Record<string, TokenTemplate[]>);

  const renderTokenShape = (token: TokenTemplate) => {
    const baseProps = {
      className: "mx-auto",
      style: { color: token.color },
      size: 24,
    };

    switch (token.type) {
      case "circle":
        return <Circle {...baseProps} />;
      case "square":
        return <Square {...baseProps} />;
      case "triangle":
        return <Triangle {...baseProps} />;
      default:
        return <Circle {...baseProps} />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="whitespace-nowrap"
        >
          Todos
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const Icon = categoryIcons[key as keyof typeof categoryIcons];
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className="whitespace-nowrap"
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Button>
          );
        })}
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6">
          {Object.entries(tokensByCategory).map(([category, tokens]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span>
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {tokens.map((token) => (
                    <Button
                      key={token.id}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-3 hover:bg-accent/50 transition-colors"
                      onClick={() => handleAddToken(token)}
                    >
                      {renderTokenShape(token)}
                      <span className="text-xs font-medium">{token.name}</span>
                      <div
                        className="w-3 h-3 rounded-full border-2 border-border"
                        style={{ backgroundColor: token.color }}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredTokens.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No se encontraron tokens</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sección para tokens personalizados */}
      <div className="pt-4 border-t border-border">
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Subir Token Personalizado
        </Button>
      </div>
    </div>
  );
};
