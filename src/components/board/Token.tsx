// src/components/GameBoard/Token.tsx
import { Group, Circle, Rect, Text } from "react-konva";
import { useRef } from "react";
import { Token as TokenType } from "@/store/useBoardStore";
import { useTokenInteractions } from "@/hooks/useTokenInteractions";

interface TokenProps {
  token: TokenType;
  isSelected: boolean;
}

export const Token = ({ token, isSelected }: TokenProps) => {
  const groupRef = useRef<any>(null);
  const { handleDragStart, handleDragEnd } = useTokenInteractions(token.id);

  // Renderizar según la forma (podría extenderse)
  const renderTokenShape = () => {
    const size = token.size;

    if (token.imageUrl) {
      // TODO: Implementar imagen con useImage de Konva
      return (
        <Rect
          width={size}
          height={size}
          fill="#4f46e5"
          stroke={isSelected ? "#f59e0b" : "transparent"}
          strokeWidth={2}
        />
      );
    }

    // Token circular por defecto
    return (
      <Circle
        radius={size / 2}
        fill="#4f46e5"
        stroke={isSelected ? "#f59e0b" : "transparent"}
        strokeWidth={2}
      />
    );
  };

  const renderHealthBar = () => {
    if (!token.health) return null;

    const { current, max } = token.health;
    const healthPercent = (current / max) * 100;
    const barWidth = token.size;
    const barHeight = 4;

    return (
      <Group y={token.size / 2 + 5}>
        <Rect
          width={barWidth}
          height={barHeight}
          fill="#374151"
          cornerRadius={2}
        />
        <Rect
          width={(barWidth * healthPercent) / 100}
          height={barHeight}
          fill={
            healthPercent > 50
              ? "#10b981"
              : healthPercent > 25
              ? "#f59e0b"
              : "#ef4444"
          }
          cornerRadius={2}
        />
      </Group>
    );
  };

  const renderConditions = () => {
    if (!token.conditions.length) return null;

    return (
      <Group y={-token.size / 2 - 10}>
        <Text
          text={token.conditions.join(", ")}
          fontSize={10}
          fill="#ffffff"
          padding={4}
          background="#00000080"
          cornerRadius={4}
        />
      </Group>
    );
  };

  return (
    <Group
      ref={groupRef}
      x={token.position.x}
      y={token.position.y}
      rotation={token.rotation}
      draggable={!token.locked}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {renderTokenShape()}
      {renderHealthBar()}
      {renderConditions()}

      {/* Nombre del token */}
      <Text
        y={token.size / 2 + 15}
        text={token.name}
        fontSize={12}
        fill="#ffffff"
        width={token.size * 1.5}
        align="center"
        padding={2}
        background="#00000080"
        cornerRadius={4}
      />
    </Group>
  );
};
