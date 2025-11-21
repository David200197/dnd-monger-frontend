// src/components/GameBoard/Layers/FogLayer.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Rect } from "react-konva";

export const FogLayer = () => {
  const { scenes, currentSceneId } = useBoardStore();
  const currentScene = scenes.find((s) => s.id === currentSceneId);

  if (!currentScene || !currentScene.fogOfWar.enabled) {
    return null;
  }

  const { fogOfWar } = currentScene;
  const width = window.innerWidth * 2;
  const height = window.innerHeight * 2;

  // Si no hay áreas reveladas, mostrar niebla completa
  if (fogOfWar.revealedAreas.length === 0) {
    return (
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width * 2}
        height={height * 2}
        fill="black"
        opacity={0.7}
      />
    );
  }

  // TODO: Implementar máscara compleja para áreas reveladas
  // Por ahora, mostramos niebla simple
  return (
    <Rect
      x={-width / 2}
      y={-height / 2}
      width={width * 2}
      height={height * 2}
      fill="black"
      opacity={0.7}
      globalCompositeOperation="destination-out"
    />
  );
};
