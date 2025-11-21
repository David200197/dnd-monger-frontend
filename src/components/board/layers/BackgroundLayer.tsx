// src/components/GameBoard/Layers/BackgroundLayer.tsx
import { useImage } from "@/hooks/useImage";
import { useBoardStore } from "@/store/useBoardStore";
import { Rect, Image as KonvaImage } from "react-konva";

export const BackgroundLayer = () => {
  const { scenes, currentSceneId } = useBoardStore();
  const currentScene = scenes.find((s) => s.id === currentSceneId);

  const { image: backgroundImage } = useImage(
    currentScene?.backgroundImage || ""
  );

  if (!currentScene) {
    return null;
  }

  // Si hay una imagen de fondo, la mostramos
  if (backgroundImage) {
    return (
      <KonvaImage
        image={backgroundImage}
        width={window.innerWidth}
        height={window.innerHeight}
        opacity={0.8}
      />
    );
  }

  // Fondo por defecto (color sólido con patrón sutil)
  return (
    <Rect
      width={window.innerWidth}
      height={window.innerHeight}
      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
      fillLinearGradientEndPoint={{
        x: window.innerWidth,
        y: window.innerHeight,
      }}
      fillLinearGradientColorStops={[
        0,
        "#1e293b",
        0.5,
        "#334155",
        1,
        "#1e293b",
      ]}
    />
  );
};
