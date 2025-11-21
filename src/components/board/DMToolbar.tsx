// src/components/GameBoard/DMToolbar.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  MousePointer,
  Ruler,
  Eye,
  Circle,
  Pencil,
  Hand,
  Grid3x3,
  Hexagon,
  Upload,
  Trash2,
} from "lucide-react";

export const DMToolbar = () => {
  const {
    scenes,
    currentSceneId,
    activeTool,
    setActiveTool,
    createScene,
    updateScene,
    clearFog,
  } = useBoardStore();

  const currentScene = scenes.find((s) => s.id === currentSceneId);

  if (!currentScene) {
    return (
      <div className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/40">
        <Button onClick={() => createScene("Nueva Escena")}>
          Crear Primera Escena
        </Button>
      </div>
    );
  }

  const tools = [
    { id: "pointer" as const, icon: MousePointer, label: "Seleccionar" },
    { id: "pan" as const, icon: Hand, label: "Mover" },
    { id: "measure" as const, icon: Ruler, label: "Medir" },
    { id: "fog" as const, icon: Eye, label: "Niebla" },
    { id: "draw" as const, icon: Pencil, label: "Dibujar" },
    { id: "token" as const, icon: Circle, label: "Token" },
  ];

  return (
    <div className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/40 space-y-4">
      {/* Selección de escenas */}
      <div className="flex items-center gap-4">
        <Select value={currentSceneId} onValueChange={setActiveTool}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar escena" />
          </SelectTrigger>
          <SelectContent>
            {scenes.map((scene) => (
              <SelectItem key={scene.id} value={scene.id}>
                {scene.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => createScene(`Escena ${scenes.length + 1}`)}
        >
          Nueva Escena
        </Button>
      </div>

      {/* Herramientas */}
      <div className="flex items-center gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool(tool.id)}
              className="flex flex-col items-center gap-1 h-12 w-12"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{tool.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Configuración del grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Tipo de Grid</label>
          <div className="flex gap-2">
            <Button
              variant={
                currentScene.grid.type === "square" ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                updateScene(currentSceneId, {
                  grid: { ...currentScene.grid, type: "square" },
                })
              }
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={currentScene.grid.type === "hex" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateScene(currentSceneId, {
                  grid: { ...currentScene.grid, type: "hex" },
                })
              }
            >
              <Hexagon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">
            Tamaño: {currentScene.grid.size}px
          </label>
          <Slider
            value={[currentScene.grid.size]}
            onValueChange={([value]) =>
              updateScene(currentSceneId, {
                grid: { ...currentScene.grid, size: value },
              })
            }
            min={20}
            max={200}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Snap to Grid</label>
          <Button
            variant={currentScene.grid.snap ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateScene(currentSceneId, {
                grid: { ...currentScene.grid, snap: !currentScene.grid.snap },
              })
            }
          >
            {currentScene.grid.snap ? "Activado" : "Desactivado"}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Acciones</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Fondo
            </Button>
            <Button variant="outline" size="sm" onClick={clearFog}>
              <Trash2 className="h-4 w-4 mr-1" />
              Limpiar Niebla
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
