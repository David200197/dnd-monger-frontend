// src/components/GameBoard/InitiativeTracker.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Plus,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface InitiativeEntry {
  id: string;
  tokenId: string;
  name: string;
  initiative: number;
  hp?: number;
  maxHp?: number;
  conditions: string[];
}

const SortableInitiativeItem = ({
  entry,
  onRemove,
}: {
  entry: InitiativeEntry;
  onRemove: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm truncate">{entry.name}</span>
          <Badge variant="secondary" className="ml-2">
            {entry.initiative}
          </Badge>
        </div>

        {entry.hp !== undefined && entry.maxHp !== undefined && (
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-secondary rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${(entry.hp / entry.maxHp) * 100}%`,
                  backgroundColor:
                    entry.hp > entry.maxHp * 0.5
                      ? "#10b981"
                      : entry.hp > entry.maxHp * 0.25
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {entry.hp}/{entry.maxHp}
            </span>
          </div>
        )}

        {entry.conditions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.conditions.map((condition) => (
              <Badge key={condition} variant="outline" className="text-xs">
                {condition}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(entry.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export const InitiativeTracker = () => {
  const { scenes, currentSceneId } = useBoardStore();
  const [initiativeOrder, setInitiativeOrder] = useState<InitiativeEntry[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const tokens = currentScene?.tokens || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const generateInitiative = () => {
    const entries: InitiativeEntry[] = tokens.map((token) => ({
      id: `init-${token.id}`,
      tokenId: token.id,
      name: token.name,
      initiative: Math.floor(Math.random() * 20) + 1,
      hp: token.health?.current,
      maxHp: token.health?.max,
      conditions: token.conditions,
    }));

    // Ordenar por iniciativa (mayor primero)
    const sorted = entries.sort((a, b) => b.initiative - a.initiative);
    setInitiativeOrder(sorted);
    setCurrentTurn(0);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setInitiativeOrder((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const nextTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % initiativeOrder.length);
  };

  const previousTurn = () => {
    setCurrentTurn(
      (prev) => (prev - 1 + initiativeOrder.length) % initiativeOrder.length
    );
  };

  const resetTracker = () => {
    setCurrentTurn(0);
    setIsPlaying(false);
  };

  const removeEntry = (id: string) => {
    setInitiativeOrder((prev) => prev.filter((entry) => entry.id !== id));
    if (currentTurn >= initiativeOrder.length - 1) {
      setCurrentTurn(0);
    }
  };

  const addTokenToInitiative = (tokenId: string) => {
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return;

    const newEntry: InitiativeEntry = {
      id: `init-${Date.now()}`,
      tokenId,
      name: token.name,
      initiative: Math.floor(Math.random() * 20) + 1,
      hp: token.health?.current,
      maxHp: token.health?.max,
      conditions: token.conditions,
    };

    const updated = [...initiativeOrder, newEntry].sort(
      (a, b) => b.initiative - a.initiative
    );
    setInitiativeOrder(updated);
  };

  const currentEntry = initiativeOrder[currentTurn];

  return (
    <div className="p-4 space-y-4">
      {/* Controles principales */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Iniciativa</h4>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={generateInitiative}>
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={previousTurn}>
            <SkipForward className="h-3 w-3 rotate-180" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextTurn}>
            <SkipForward className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Turno actual */}
      {currentEntry && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-primary">Turno Actual</span>
            <Badge variant="default">
              {currentTurn + 1}/{initiativeOrder.length}
            </Badge>
          </div>
          <div className="font-medium">{currentEntry.name}</div>
          {currentEntry.hp !== undefined && (
            <div className="text-sm text-muted-foreground">
              HP: {currentEntry.hp}/{currentEntry.maxHp}
            </div>
          )}
        </div>
      )}

      {/* Lista de iniciativa */}
      <ScrollArea className="h-64">
        {initiativeOrder.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={initiativeOrder.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {initiativeOrder.map((entry, index) => (
                  <SortableInitiativeItem
                    key={entry.id}
                    entry={entry}
                    onRemove={removeEntry}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay iniciativa</p>
            <p className="text-sm">
              Genera iniciativa o añade tokens manualmente
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Añadir tokens manualmente */}
      {tokens.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Añadir a iniciativa
          </div>
          <ScrollArea className="h-20">
            <div className="flex flex-wrap gap-1">
              {tokens
                .filter(
                  (token) =>
                    !initiativeOrder.some((entry) => entry.tokenId === token.id)
                )
                .map((token) => (
                  <Badge
                    key={token.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addTokenToInitiative(token.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {token.name}
                  </Badge>
                ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Estadísticas rápidas */}
      {initiativeOrder.length > 0 && (
        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Total participantes:</span>
            <span>{initiativeOrder.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Turno actual:</span>
            <span>{currentTurn + 1}</span>
          </div>
        </div>
      )}
    </div>
  );
};
