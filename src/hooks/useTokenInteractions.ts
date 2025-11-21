// src/hooks/useTokenInteractions.ts
import { useCallback } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useBoardStore } from "@/store/useBoardStore";

export const useTokenInteractions = (tokenId: string) => {
  const { moveToken, selection, updateToken } = useBoardStore();

  const handleDragStart = useCallback((e: KonvaEventObject<DragEvent>) => {
    // Podemos hacer algo al empezar a arrastrar, como cambiar el cursor o mostrar información
    e.target.setAttrs({
      shadowOffset: {
        x: 0,
        y: 0,
      },
      scaleX: 1.1,
      scaleY: 1.1,
    });
  }, []);

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.target.setAttrs({
        shadowOffset: {
          x: 0,
          y: 0,
        },
        scaleX: 1,
        scaleY: 1,
      });

      // Actualizar la posición del token en el store
      const newPosition = {
        x: e.target.x(),
        y: e.target.y(),
      };
      moveToken(tokenId, newPosition);
    },
    [tokenId, moveToken]
  );

  return {
    handleDragStart,
    handleDragEnd,
  };
};
