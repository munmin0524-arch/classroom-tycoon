"use client";

import { useMemo } from "react";
import { CHARACTER_DATA, generateCharacterShadow, getEmotion, type Emotion } from "@/lib/pixel-art/characters";

interface PixelCharacterProps {
  studentId: string;
  happiness?: number;
  stress?: number;
  emotion?: Emotion;
  scale?: number;
  className?: string;
}

export function PixelCharacter({
  studentId,
  happiness = 50,
  stress = 30,
  emotion: emotionOverride,
  scale = 3,
  className = "",
}: PixelCharacterProps) {
  const charData = CHARACTER_DATA[studentId];
  const emotion = emotionOverride ?? getEmotion(happiness, stress);

  const boxShadow = useMemo(() => {
    if (!charData) return "";
    return generateCharacterShadow(charData, emotion);
  }, [charData, emotion]);

  if (!charData) return null;

  return (
    <div
      className={`pixel-art ${className}`}
      style={{
        position: "relative",
        width: 12 * scale,
        height: 16 * scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          boxShadow,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
