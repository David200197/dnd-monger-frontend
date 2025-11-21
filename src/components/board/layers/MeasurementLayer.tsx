// src/components/GameBoard/Layers/MeasurementLayer.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Line, Text } from "react-konva";
import { useState, useEffect } from "react";

export const MeasurementLayer = () => {
  const { measurementStart, activeTool, scenes, currentSceneId } =
    useBoardStore();
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });

  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const gridSize = currentScene?.grid.size || 50;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCurrentMousePos({ x: e.clientX, y: e.clientY });
    };

    if (activeTool === "measure" && measurementStart) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeTool, measurementStart]);

  if (activeTool !== "measure" || !measurementStart) {
    return null;
  }

  const distance = Math.sqrt(
    Math.pow(currentMousePos.x - measurementStart.x, 2) +
      Math.pow(currentMousePos.y - measurementStart.y, 2)
  );

  // Convertir a unidades del juego (pies/metros basado en grid)
  const gameUnits = Math.round((distance / gridSize) * 5); // 5 pies por celda
  const displayText = `${gameUnits} ft (${Math.round(distance)}px)`;

  // Calcular ángulo para posicionar el texto
  const angle = Math.atan2(
    currentMousePos.y - measurementStart.y,
    currentMousePos.x - measurementStart.x
  );
  const textX =
    measurementStart.x + (currentMousePos.x - measurementStart.x) / 2;
  const textY =
    measurementStart.y + (currentMousePos.y - measurementStart.y) / 2;

  return (
    <>
      <Line
        points={[
          measurementStart.x,
          measurementStart.y,
          currentMousePos.x,
          currentMousePos.y,
        ]}
        stroke="#ff4444"
        strokeWidth={2}
        dash={[5, 5]}
      />

      {/* Punto inicial */}
      <Line
        points={[
          measurementStart.x - 5,
          measurementStart.y - 5,
          measurementStart.x + 5,
          measurementStart.y + 5,
          measurementStart.x - 5,
          measurementStart.y + 5,
          measurementStart.x + 5,
          measurementStart.y - 5,
        ]}
        stroke="#ff4444"
        strokeWidth={2}
        closed
      />

      {/* Punto final */}
      <Line
        points={[
          currentMousePos.x - 5,
          currentMousePos.y - 5,
          currentMousePos.x + 5,
          currentMousePos.y + 5,
          currentMousePos.x - 5,
          currentMousePos.y + 5,
          currentMousePos.x + 5,
          currentMousePos.y - 5,
        ]}
        stroke="#ff4444"
        strokeWidth={2}
        closed
      />

      {/* Texto de distancia */}
      <Text
        x={textX}
        y={textY}
        text={displayText}
        fill="#ff4444"
        fontSize={14}
        fontStyle="bold"
        padding={5}
        background="#00000080"
        cornerRadius={3}
        offsetX={-20}
        offsetY={-10}
      />
    </>
  );
};
