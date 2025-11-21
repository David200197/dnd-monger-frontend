// src/components/GameBoard/Layers/TokensLayer.tsx
import { useBoardStore } from "@/store/useBoardStore";
import { Token } from "../Token";

export const TokensLayer = () => {
  const { scenes, currentSceneId, selection } = useBoardStore();
  const currentScene = scenes.find((s) => s.id === currentSceneId);

  if (!currentScene) {
    return null;
  }

  return (
    <>
      {currentScene.tokens.map((token) => (
        <Token
          key={token.id}
          token={token}
          isSelected={selection.includes(token.id)}
        />
      ))}
    </>
  );
};
