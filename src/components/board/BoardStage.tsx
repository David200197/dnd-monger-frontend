// src/components/GameBoard/BoardStage.tsx
import { Stage, Layer } from "react-konva";
import { useBoardStore } from "@/store/useBoardStore";
import { BackgroundLayer } from "./layers/BackgroundLayer";
import { GridLayer } from "./layers/GridLayer";
import { FogLayer } from "./layers/FogLayer";
import { TokensLayer } from "./layers/TokensLayer";
import { DrawingLayer } from "./layers/DrawingLayer";
import { MeasurementLayer } from "./layers/MeasurementLayer";
import { useBoardInteractions } from "@/hooks/useBoardInteractions";

interface BoardStageProps {
  width: number;
  height: number;
}

export const BoardStage = ({ width, height }: BoardStageProps) => {
  const { scale, position, activeTool } = useBoardStore();
  const { handleWheel, handleMouseDown, handleMouseMove, handleMouseUp } =
    useBoardInteractions();

  return (
    <Stage
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      draggable={activeTool === "pan"}
    >
      {/* Orden de renderizado según capas */}
      <Layer>
        <BackgroundLayer />
      </Layer>

      <Layer>
        <GridLayer />
      </Layer>

      <Layer>
        <FogLayer />
      </Layer>

      <Layer>
        <TokensLayer />
      </Layer>

      <Layer>
        <DrawingLayer />
      </Layer>

      <Layer>
        <MeasurementLayer />
      </Layer>
    </Stage>
  );
};
