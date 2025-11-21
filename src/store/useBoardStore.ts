// src/store/useBoardStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BoardPosition {
  x: number;
  y: number;
}

export interface Token {
  id: string;
  name: string;
  imageUrl?: string;
  position: BoardPosition;
  size: number; // px
  rotation: number;
  health?: {
    current: number;
    max: number;
  };
  conditions: string[];
  layer: "token" | "background" | "foreground";
  locked: boolean;
  ownedBy?: string; // playerId
}

export interface Scene {
  id: string;
  name: string;
  backgroundImage?: string;
  grid: {
    type: "square" | "hex";
    size: number;
    color: string;
    opacity: number;
    snap: boolean;
  };
  tokens: Token[];
  fogOfWar: {
    enabled: boolean;
    revealedAreas: Array<{
      id: string;
      points: number[]; // [x1, y1, x2, y2, ...]
      type: "polygon" | "brush";
    }>;
  };
  drawings: Array<{
    id: string;
    type: "line" | "rectangle" | "circle" | "freehand";
    points: number[];
    color: string;
    strokeWidth: number;
  }>;
}

export type Tool = "pointer" | "measure" | "fog" | "token" | "draw" | "pan";

interface BoardState {
  // Escenas y estado actual
  scenes: Scene[];
  currentSceneId: string | null;

  // Herramientas y vista
  activeTool: Tool;
  scale: number;
  position: BoardPosition;

  // Estado temporal (no persistido)
  isDragging: boolean;
  selection: string[]; // token IDs
  measurementStart: BoardPosition | null;

  // Acciones
  setCurrentScene: (sceneId: string) => void;
  createScene: (name: string) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  setActiveTool: (tool: Tool) => void;
  setScale: (scale: number) => void;
  setPosition: (position: BoardPosition) => void;
  addToken: (token: Omit<Token, "id">) => void;
  updateToken: (tokenId: string, updates: Partial<Token>) => void;
  moveToken: (tokenId: string, newPosition: BoardPosition) => void;
  removeToken: (tokenId: string) => void;
  revealFogArea: (points: number[], type: "polygon" | "brush") => void;
  clearFog: () => void;
  addDrawing: (drawing: Omit<Scene["drawings"][0], "id">) => void;
  startMeasurement: (position: BoardPosition) => void;
  endMeasurement: () => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      scenes: [],
      currentSceneId: null,
      activeTool: "pointer",
      scale: 1,
      position: { x: 0, y: 0 },
      isDragging: false,
      selection: [],
      measurementStart: null,

      // Acciones
      setCurrentScene: (sceneId) => set({ currentSceneId: sceneId }),

      createScene: (name) => {
        const newScene: Scene = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          grid: {
            type: "square",
            size: 50,
            color: "#000000",
            opacity: 0.3,
            snap: true,
          },
          tokens: [],
          fogOfWar: {
            enabled: false,
            revealedAreas: [],
          },
          drawings: [],
        };

        set((state) => ({
          scenes: [...state.scenes, newScene],
          currentSceneId: newScene.id,
        }));
      },

      updateScene: (sceneId, updates) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, ...updates } : scene
          ),
        })),

      setActiveTool: (tool) => set({ activeTool: tool }),

      setScale: (scale) => set({ scale: Math.max(0.1, Math.min(5, scale)) }),

      setPosition: (position) => set({ position }),

      addToken: (tokenData) => {
        const newToken: Token = {
          ...tokenData,
          id: Math.random().toString(36).substr(2, 9),
        };

        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === state.currentSceneId
              ? { ...scene, tokens: [...scene.tokens, newToken] }
              : scene
          ),
        }));
      },

      updateToken: (tokenId, updates) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === state.currentSceneId
              ? {
                  ...scene,
                  tokens: scene.tokens.map((token) =>
                    token.id === tokenId ? { ...token, ...updates } : token
                  ),
                }
              : scene
          ),
        })),

      moveToken: (tokenId, newPosition) => {
        const state = get();
        const currentScene = state.scenes.find(
          (s) => s.id === state.currentSceneId
        );
        if (!currentScene) return;

        // Aplicar snap to grid si está activado
        let finalPosition = newPosition;
        if (currentScene.grid.snap) {
          finalPosition = {
            x:
              Math.round(newPosition.x / currentScene.grid.size) *
              currentScene.grid.size,
            y:
              Math.round(newPosition.y / currentScene.grid.size) *
              currentScene.grid.size,
          };
        }

        state.updateToken(tokenId, { position: finalPosition });
      },

      removeToken: (tokenId) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === state.currentSceneId
              ? {
                  ...scene,
                  tokens: scene.tokens.filter((token) => token.id !== tokenId),
                }
              : scene
          ),
        })),

      revealFogArea: (points, type) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === state.currentSceneId
              ? {
                  ...scene,
                  fogOfWar: {
                    ...scene.fogOfWar,
                    revealedAreas: [
                      ...scene.fogOfWar.revealedAreas,
                      {
                        id: Math.random().toString(36).substr(2, 9),
                        points,
                        type,
                      },
                    ],
                  },
                }
              : scene
          ),
        })),

      clearFog: () =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === state.currentSceneId
              ? {
                  ...scene,
                  fogOfWar: {
                    ...scene.fogOfWar,
                    revealedAreas: [],
                  },
                }
              : scene
          ),
        })),

      addDrawing: (drawingData) => {
        const newDrawing: Scene["drawings"][0] = {
          ...drawingData,
          id: Math.random().toString(36).substr(2, 9),
        };

        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === state.currentSceneId
              ? { ...scene, drawings: [...scene.drawings, newDrawing] }
              : scene
          ),
        }));
      },

      startMeasurement: (position) => set({ measurementStart: position }),

      endMeasurement: () => set({ measurementStart: null }),
    }),
    {
      name: "board-storage",
      partialize: (state) => ({
        scenes: state.scenes,
        currentSceneId: state.currentSceneId,
        activeTool: state.activeTool,
        scale: state.scale,
        position: state.position,
      }),
    }
  )
);
