// src/hooks/useBoardInteractions.ts
import { useCallback, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useBoardStore } from "@/store/useBoardStore";

export const useBoardInteractions = () => {
  const {
    scale,
    position,
    setScale,
    setPosition,
    activeTool,
    startMeasurement,
    measurementStart,
    endMeasurement,
  } = useBoardStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<number[]>([]);

  // Zoom con rueda del ratón
  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const oldScale = scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      // Calcular nueva escala
      const zoomFactor = 1.1;
      const newScale =
        e.evt.deltaY > 0 ? oldScale / zoomFactor : oldScale * zoomFactor;

      // Limitar zoom
      const clampedScale = Math.max(0.1, Math.min(5, newScale));
      setScale(clampedScale);

      // Ajustar posición para zoom centrado en el cursor
      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      };

      setPosition(newPos);
    },
    [scale, position, setScale, setPosition]
  );

  // Manejo de herramientas
  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const point = stage.getPointerPosition();
      if (!point) return;

      switch (activeTool) {
        case "measure":
          startMeasurement(point);
          break;

        case "draw":
          setIsDrawing(true);
          setCurrentDrawing([point.x, point.y]);
          break;

        case "fog":
          // Iniciar revelado de fog of war
          setIsDrawing(true);
          setCurrentDrawing([point.x, point.y]);
          break;

        default:
          break;
      }
    },
    [activeTool, startMeasurement]
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawing) return;

      const stage = e.target.getStage();
      if (!stage) return;

      const point = stage.getPointerPosition();
      if (!point) return;

      switch (activeTool) {
        case "draw":
          setCurrentDrawing((prev) => [...prev, point.x, point.y]);
          break;

        case "fog":
          setCurrentDrawing((prev) => [...prev, point.x, point.y]);
          break;

        default:
          break;
      }
    },
    [isDrawing, activeTool]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;

    const { addDrawing, revealFogArea } = useBoardStore.getState();

    switch (activeTool) {
      case "draw":
        if (currentDrawing.length >= 4) {
          addDrawing({
            type: "freehand",
            points: currentDrawing,
            color: "#ff0000",
            strokeWidth: 2,
          });
        }
        break;

      case "fog":
        if (currentDrawing.length >= 4) {
          revealFogArea(currentDrawing, "brush");
        }
        break;

      default:
        break;
    }

    setIsDrawing(false);
    setCurrentDrawing([]);
  }, [isDrawing, activeTool, currentDrawing]);

  return {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
