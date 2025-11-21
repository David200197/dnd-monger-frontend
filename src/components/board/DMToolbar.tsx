// src/components/board/DMToolbar.tsx
import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MousePointer,
  Ruler,
  Eye,
  Pencil,
  Hand,
  Grid3x3,
  Plus,
  Trash2,
  Edit,
  MoreHorizontal,
  Settings,
  Map,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DMToolbar = () => {
  const {
    scenes,
    currentSceneId,
    activeTool,
    setActiveTool,
    createScene,
    updateScene,
    deleteScene,
    clearFog,
  } = useBoardStore();

  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newSceneName, setNewSceneName] = useState("");
  const [editSceneName, setEditSceneName] = useState("");

  const currentScene = scenes.find((s) => s.id === currentSceneId);

  // Herramientas compactas con iconos
  const tools = [
    { id: "pointer" as const, icon: MousePointer, label: "Seleccionar" },
    { id: "pan" as const, icon: Hand, label: "Mover" },
    { id: "measure" as const, icon: Ruler, label: "Medir" },
    { id: "fog" as const, icon: Eye, label: "Niebla" },
    { id: "draw" as const, icon: Pencil, label: "Dibujar" },
  ];

  const handleCreateScene = () => {
    if (newSceneName.trim()) {
      createScene(newSceneName.trim());
      setNewSceneName("");
      setIsSceneDialogOpen(false);
    }
  };

  const handleEditScene = () => {
    if (editSceneName.trim() && currentSceneId) {
      updateScene(currentSceneId, { name: editSceneName.trim() });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteScene = () => {
    if (currentSceneId && scenes.length > 1) {
      deleteScene(currentSceneId);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = () => {
    if (currentScene) {
      setEditSceneName(currentScene.name);
      setIsEditDialogOpen(true);
    }
  };

  return (
    <>
      {/* Toolbar compacto */}
      <div className="h-12 px-4 bg-card/90 backdrop-blur-sm border-b border-border/40 flex items-center justify-between">
        {/* Lado izquierdo: Escenas y herramientas */}
        <div className="flex items-center gap-2">
          {/* Dropdown de Escenas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                <span className="max-w-32 truncate">
                  {currentScene?.name || "Sin escena"}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="px-2 py-1.5 text-sm font-semibold">Escenas</div>
              <DropdownMenuSeparator />

              {scenes.map((scene) => (
                <DropdownMenuItem
                  key={scene.id}
                  onClick={() =>
                    useBoardStore.getState().setCurrentScene(scene.id)
                  }
                  className="flex justify-between items-center"
                >
                  <span
                    className={
                      scene.id === currentSceneId ? "font-semibold" : ""
                    }
                  >
                    {scene.name}
                  </span>
                  {scene.id === currentSceneId && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsSceneDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Escena
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separador */}
          <div className="w-px h-6 bg-border mx-2" />

          {/* Herramientas compactas */}
          <div className="flex items-center gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTool(tool.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{tool.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Lado derecho: Acciones y configuración */}
        <div className="flex items-center gap-2">
          {/* Acciones rápidas */}
          {currentScene && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFog}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Limpiar Niebla</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openEditDialog}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Editar Escena</p>
                </TooltipContent>
              </Tooltip>

              {scenes.length > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Eliminar Escena</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}

          {/* Configuración del Grid */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm font-semibold">
                Configuración
              </div>
              <DropdownMenuSeparator />

              {currentScene && (
                <>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Tipo de Grid
                  </div>
                  <div className="flex gap-1 px-2 py-1">
                    <Button
                      variant={
                        currentScene.grid.type === "square"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateScene(currentSceneId!, {
                          grid: { ...currentScene.grid, type: "square" },
                        })
                      }
                      className="flex-1 h-8"
                    >
                      <Grid3x3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={
                        currentScene.grid.type === "hex" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateScene(currentSceneId!, {
                          grid: { ...currentScene.grid, type: "hex" },
                        })
                      }
                      className="flex-1 h-8"
                    >
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M12 12L2 7V17L12 22V12Z M12 12L22 7V17L12 22V12Z" />
                      </svg>
                    </Button>
                  </div>

                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Snap: {currentScene.grid.snap ? "Activado" : "Desactivado"}
                  </div>
                  <DropdownMenuItem
                    onClick={() =>
                      updateScene(currentSceneId!, {
                        grid: {
                          ...currentScene.grid,
                          snap: !currentScene.grid.snap,
                        },
                      })
                    }
                  >
                    {currentScene.grid.snap
                      ? "Desactivar Snap"
                      : "Activar Snap"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Diálogo para crear escena */}
      <Dialog open={isSceneDialogOpen} onOpenChange={setIsSceneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Escena</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="sceneName">Nombre de la escena</Label>
            <Input
              id="sceneName"
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              placeholder="Ingresa el nombre de la escena"
              onKeyDown={(e) => e.key === "Enter" && handleCreateScene()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSceneDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateScene} disabled={!newSceneName.trim()}>
              Crear Escena
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar escena */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Escena</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="editSceneName">Nombre de la escena</Label>
            <Input
              id="editSceneName"
              value={editSceneName}
              onChange={(e) => setEditSceneName(e.target.value)}
              placeholder="Ingresa el nuevo nombre"
              onKeyDown={(e) => e.key === "Enter" && handleEditScene()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditScene} disabled={!editSceneName.trim()}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar escena */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Escena</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              ¿Estás seguro de que quieres eliminar la escena "
              {currentScene?.name}"? Esta acción no se puede deshacer.
            </p>
            {scenes.length === 1 && (
              <p className="text-sm text-destructive">
                No puedes eliminar la única escena existente.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteScene}
              disabled={scenes.length <= 1}
            >
              Eliminar Escena
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
