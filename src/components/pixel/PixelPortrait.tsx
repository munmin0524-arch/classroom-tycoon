"use client";

import { useMemo } from "react";
import { CHARACTER_DATA, getEmotion, type Emotion } from "@/lib/pixel-art/characters";
import { generatePortraitShadow } from "@/lib/pixel-art/portraits";

interface PixelPortraitProps {
  studentId: string;
  happiness?: number;
  stress?: number;
  emotion?: Emotion;
  scale?: number;
  className?: string;
}

export function PixelPortrait({
  studentId,
  happiness = 50,
  stress = 30,
  emotion: emotionOverride,
  scale = 4,
  className = "",
}: PixelPortraitProps) {
  const charData = CHARACTER_DATA[studentId];
  const emotion = emotionOverride ?? getEmotion(happiness, stress);

  const boxShadow = useMemo(() => {
    if (!charData) return "";
    return generatePortraitShadow(charData, emotion);
  }, [charData, emotion]);

  if (!charData) return null;

  return (
    <div
      className={`pixel-art pixel-border-inner ${className}`}
      style={{
        position: "relative",
        width: 32 * scale,
        height: 32 * scale,
        overflow: "hidden",
        background: "#1a1a3e",
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
