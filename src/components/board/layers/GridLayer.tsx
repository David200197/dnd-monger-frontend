// src/components/GameBoard/Layers/GridLayer.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Line } from "react-konva";

export const GridLayer = () => {
  const { scenes, currentSceneId, scale } = useBoardStore();
  const currentScene = scenes.find((s) => s.id === currentSceneId);

  if (!currentScene || !currentScene.grid) {
    return null;
  }

  const { grid } = currentScene;
  const gridSize = grid.size;
  const width = window.innerWidth * 2; // Extender más allá del viewport
  const height = window.innerHeight * 2;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Ajustar stroke width basado en el zoom
  const strokeWidth = Math.max(0.5, 1 / scale);

  const gridLines = [];

  // Líneas verticales
  for (let x = -width; x <= width * 2; x += gridSize) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        points={[x, -height, x, height * 2]}
        stroke={grid.color}
        strokeWidth={strokeWidth}
        opacity={grid.opacity}
        dash={[2, 4]} // Grid punteado sutil
      />
    );
  }

  // Líneas horizontales
  for (let y = -height; y <= height * 2; y += gridSize) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        points={[-width, y, width * 2, y]}
        stroke={grid.color}
        strokeWidth={strokeWidth}
        opacity={grid.opacity}
        dash={[2, 4]} // Grid punteado sutil
      />
    );
  }

  return <>{gridLines}</>;
};
