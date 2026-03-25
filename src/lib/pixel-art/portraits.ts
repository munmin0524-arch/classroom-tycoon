// Large portrait pixel art data for dialog box (32x32 grid)
// These are rendered at 4x scale = 128x128px display

import { type CharacterData, type Emotion } from "./characters";

export function generatePortraitShadow(data: CharacterData, emotion: Emotion): string {
  const pixels: string[] = [];
  const { hairColor, skinColor, uniformColor, hairStyle, accessory } = data;
  const eyeColor = "#1a1a1a";
  const eyeWhite = "#ffffff";

  const px = (x: number, y: number, color: string) => {
    pixels.push(`${x}px ${y}px 0 ${color}`);
  };

  // ── Hair (rows 0-8) ──
  // Top of hair
  for (let x = 8; x <= 23; x++) px(x, 2, hairColor);
  for (let x = 6; x <= 25; x++) px(x, 3, hairColor);
  for (let x = 5; x <= 26; x++) {
    px(x, 4, hairColor);
    px(x, 5, hairColor);
    px(x, 6, hairColor);
  }

  if (hairStyle === "long" || hairStyle === "ponytail") {
    // Side hair
    for (let y = 7; y <= 18; y++) {
      px(4, y, hairColor); px(5, y, hairColor);
      px(26, y, hairColor); px(27, y, hairColor);
    }
    if (hairStyle === "ponytail") {
      for (let y = 5; y <= 14; y++) {
        px(28, y, hairColor); px(29, y, hairColor);
      }
    }
  } else if (hairStyle === "messy") {
    px(7, 1, hairColor); px(12, 1, hairColor); px(19, 1, hairColor); px(24, 1, hairColor);
    px(4, 3, hairColor); px(27, 3, hairColor);
    for (let y = 7; y <= 9; y++) {
      px(5, y, hairColor); px(26, y, hairColor);
    }
  } else {
    // Short/buzz - minimal side hair
    for (let y = 7; y <= 8; y++) {
      px(5, y, hairColor); px(26, y, hairColor);
    }
  }

  // ── Face (rows 7-18) ──
  for (let y = 7; y <= 18; y++) {
    for (let x = 6; x <= 25; x++) {
      px(x, y, skinColor);
    }
  }

  // ── Eyes (rows 11-13) ──
  // Left eye
  px(9, 11, eyeWhite); px(10, 11, eyeWhite); px(11, 11, eyeWhite);
  px(9, 12, eyeWhite); px(10, 12, eyeColor); px(11, 12, eyeColor);
  px(9, 13, eyeWhite); px(10, 13, eyeWhite); px(11, 13, eyeWhite);
  // Right eye
  px(20, 11, eyeWhite); px(21, 11, eyeWhite); px(22, 11, eyeWhite);
  px(20, 12, eyeColor); px(21, 12, eyeColor); px(22, 12, eyeWhite);
  px(20, 13, eyeWhite); px(21, 13, eyeWhite); px(22, 13, eyeWhite);

  // Eyebrows
  for (let x = 9; x <= 12; x++) px(x, 10, hairColor);
  for (let x = 19; x <= 22; x++) px(x, 10, hairColor);

  // Nose
  px(15, 14, "#d4a574"); px(16, 14, "#d4a574");

  // ── Emotion (mouth rows 16-17) ──
  switch (emotion) {
    case "happy":
      px(13, 16, "#e74c3c"); px(14, 16, "#e74c3c"); px(15, 16, "#e74c3c");
      px(16, 16, "#e74c3c"); px(17, 16, "#e74c3c"); px(18, 16, "#e74c3c");
      px(14, 17, "#cc3333"); px(15, 17, "#cc3333"); px(16, 17, "#cc3333"); px(17, 17, "#cc3333");
      // Happy eyes (squint)
      px(10, 12, eyeColor); px(11, 12, eyeColor); px(9, 12, eyeColor);
      px(20, 12, eyeColor); px(21, 12, eyeColor); px(22, 12, eyeColor);
      break;
    case "neutral":
      for (let x = 13; x <= 18; x++) px(x, 16, "#a0522d");
      break;
    case "worried":
      px(13, 17, "#a0522d"); px(14, 16, "#a0522d"); px(15, 16, "#a0522d");
      px(16, 16, "#a0522d"); px(17, 16, "#a0522d"); px(18, 17, "#a0522d");
      // Worried eyebrows (angled)
      px(9, 9, hairColor); px(12, 10, hairColor);
      px(22, 9, hairColor); px(19, 10, hairColor);
      break;
    case "sad":
      px(14, 17, "#5555aa"); px(15, 17, "#5555aa"); px(16, 17, "#5555aa"); px(17, 17, "#5555aa");
      px(13, 16, "#5555aa"); px(18, 16, "#5555aa");
      // Tears
      px(12, 14, "#66aaff"); px(12, 15, "#66aaff");
      px(19, 14, "#66aaff"); px(19, 15, "#66aaff");
      break;
  }

  // ── Glasses accessory ──
  if (accessory === "glasses") {
    const glassColor = "#555555";
    // Left frame
    for (let x = 8; x <= 12; x++) { px(x, 11, glassColor); px(x, 13, glassColor); }
    px(8, 12, glassColor); px(12, 12, glassColor);
    // Right frame
    for (let x = 19; x <= 23; x++) { px(x, 11, glassColor); px(x, 13, glassColor); }
    px(19, 12, glassColor); px(23, 12, glassColor);
    // Bridge
    for (let x = 13; x <= 18; x++) px(x, 11, glassColor);
  } else if (accessory === "hairpin") {
    px(25, 5, "#ff69b4"); px(26, 5, "#ff69b4"); px(27, 5, "#ff69b4");
    px(26, 4, "#ff69b4"); px(26, 6, "#ff69b4");
  } else if (accessory === "headband") {
    for (let x = 5; x <= 26; x++) px(x, 6, "#ff4444");
  }

  // ── Neck + Collar (rows 19-20) ──
  for (let x = 13; x <= 18; x++) px(x, 19, skinColor);
  for (let x = 8; x <= 23; x++) px(x, 20, "#ffffff");

  // ── Uniform (rows 21-31) ──
  for (let y = 21; y <= 31; y++) {
    for (let x = 6; x <= 25; x++) {
      px(x, y, uniformColor);
    }
  }
  // Uniform button line
  for (let y = 22; y <= 30; y++) {
    px(15, y, "#ffffff"); px(16, y, "#ffffff");
  }

  return pixels.join(",");
}
