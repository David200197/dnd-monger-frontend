// src/components/GameBoard/Layers/DrawingLayer.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Line, Circle, Rect } from "react-konva";

export const DrawingLayer = () => {
  const { scenes, currentSceneId } = useBoardStore();
  const currentScene = scenes.find((s) => s.id === currentSceneId);

  if (!currentScene) {
    return null;
  }

  return (
    <>
      {currentScene.drawings.map((drawing) => {
        switch (drawing.type) {
          case "line":
            return (
              <Line
                key={drawing.id}
                points={drawing.points}
                stroke={drawing.color}
                strokeWidth={drawing.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            );

          case "circle":
            if (drawing.points.length >= 4) {
              const [x1, y1, x2, y2] = drawing.points;
              const radius = Math.sqrt(
                Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
              );
              return (
                <Circle
                  key={drawing.id}
                  x={x1}
                  y={y1}
                  radius={radius}
                  stroke={drawing.color}
                  strokeWidth={drawing.strokeWidth}
                  fill="transparent"
                />
              );
            }
            return null;

          case "rectangle":
            if (drawing.points.length >= 4) {
              const [x1, y1, x2, y2] = drawing.points;
              return (
                <Rect
                  key={drawing.id}
                  x={Math.min(x1, x2)}
                  y={Math.min(y1, y2)}
                  width={Math.abs(x2 - x1)}
                  height={Math.abs(y2 - y1)}
                  stroke={drawing.color}
                  strokeWidth={drawing.strokeWidth}
                  fill="transparent"
                />
              );
            }
            return null;

          case "freehand":
            return (
              <Line
                key={drawing.id}
                points={drawing.points}
                stroke={drawing.color}
                strokeWidth={drawing.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};
