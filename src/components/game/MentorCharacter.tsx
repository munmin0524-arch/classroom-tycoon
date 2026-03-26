"use client";

import { motion } from "motion/react";
import { useGameStore, MENTOR_DATA } from "@/stores/gameStore";
import type { MentorType } from "@/types";

/**
 * Pixel art mentor sprite generator using CSS box-shadow
 */
function generateMentorShadow(mentorType: MentorType): string {
  const pixels: string[] = [];
  const px = (x: number, y: number, color: string) => {
    pixels.push(`${x}px ${y}px 0 ${color}`);
  };

  const skinColor = "#E8B88A";
  const eyeColor = "#1a1a1a";

  // Different styles per mentor
  const styles: Record<MentorType, { hairColor: string; outfitColor: string; accentColor: string }> = {
    kim: { hairColor: "#1a1a1a", outfitColor: "#6b21a8", accentColor: "#a78bfa" }, // purple - counselor
    park: { hairColor: "#2a2a2a", outfitColor: "#1e40af", accentColor: "#60a5fa" }, // blue - admin
    lee: { hairColor: "#8B6914", outfitColor: "#166534", accentColor: "#4ade80" }, // green - experienced
    choi: { hairColor: "#3d2314", outfitColor: "#9a3412", accentColor: "#f97316" }, // orange - academic
  };

  const s = styles[mentorType];

  // Hair (rows 0-3)
  for (let x = 3; x <= 8; x++) px(x, 0, s.hairColor);
  for (let x = 2; x <= 9; x++) px(x, 1, s.hairColor);
  for (let x = 2; x <= 9; x++) px(x, 2, s.hairColor);
  px(2, 3, s.hairColor); px(9, 3, s.hairColor);

  // Face (rows 3-6)
  for (let y = 3; y <= 6; y++) {
    for (let x = 3; x <= 8; x++) px(x, y, skinColor);
  }

  // Eyes
  px(4, 4, eyeColor); px(7, 4, eyeColor);
  // Smile
  px(5, 5, "#c0522d"); px(6, 5, "#c0522d");

  // Glasses for kim and choi
  if (mentorType === "kim" || mentorType === "choi") {
    px(3, 4, "#555"); px(5, 4, "#555"); px(6, 4, "#555"); px(8, 4, "#555");
    px(4, 4, eyeColor); px(7, 4, eyeColor);
  }

  // Collar (row 7)
  for (let x = 4; x <= 7; x++) px(x, 7, "#ffffff");

  // Outfit body (rows 8-12)
  for (let y = 8; y <= 12; y++) {
    for (let x = 3; x <= 8; x++) {
      px(x, y, s.outfitColor);
    }
  }
  // Accent line
  px(5, 8, s.accentColor); px(6, 8, s.accentColor);
  px(5, 9, s.accentColor); px(6, 9, s.accentColor);

  // Arms
  for (let y = 8; y <= 11; y++) {
    px(2, y, s.outfitColor); px(9, y, s.outfitColor);
  }
  px(2, 12, skinColor); px(9, 12, skinColor);

  // Legs
  for (let y = 13; y <= 14; y++) {
    px(4, y, "#1a1a3a"); px(5, y, "#1a1a3a");
    px(6, y, "#1a1a3a"); px(7, y, "#1a1a3a");
  }
  px(3, 15, "#2a2a2a"); px(4, 15, "#2a2a2a"); px(5, 15, "#2a2a2a");
  px(6, 15, "#2a2a2a"); px(7, 15, "#2a2a2a"); px(8, 15, "#2a2a2a");

  return pixels.join(",");
}

interface MentorFeedbackProps {
  feedback: string;
  mentorType?: MentorType;
}

export function MentorFeedback({ feedback, mentorType }: MentorFeedbackProps) {
  const { currentMentor } = useGameStore();
  const type = mentorType || currentMentor;
  const mentor = MENTOR_DATA[type];
  const shadow = generateMentorShadow(type);

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      className="flex gap-3 p-3"
      style={{
        background: `${mentor.color}11`,
        border: `2px solid ${mentor.color}33`,
      }}
    >
      {/* Mentor sprite */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div
          className="pixel-art"
          style={{
            width: 1,
            height: 1,
            boxShadow: shadow,
            transform: "scale(2.5)",
            transformOrigin: "top left",
            marginRight: 24,
            marginBottom: 36,
          }}
        />
        <span className="text-[10px] pixel-text" style={{ color: mentor.color }}>{mentor.name}</span>
        <span className="text-[8px] text-gray-500">{mentor.title}</span>
      </div>

      {/* Speech bubble */}
      <div className="flex-1 relative">
        {/* Bubble tail */}
        <div
          className="absolute -left-2 top-4 w-0 h-0"
          style={{
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: `8px solid ${mentor.color}33`,
          }}
        />
        <div
          className="p-3 text-sm leading-relaxed"
          style={{
            background: `${mentor.color}08`,
            border: `1px solid ${mentor.color}22`,
            color: "#ccc",
          }}
        >
          <div className="text-xs mb-1" style={{ color: mentor.color }}>
            {mentor.name} 선생님의 조언
          </div>
          {feedback}
        </div>
      </div>
    </motion.div>
  );
}
