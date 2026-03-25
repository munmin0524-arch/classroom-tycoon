// CSS box-shadow pixel art data for 15 student desk sprites (12x16 grid)
// Each pixel is represented as [x, y, color]
// Emotion variants modify rows 8-10 (face area)

export type Emotion = "happy" | "neutral" | "worried" | "sad";

export interface CharacterData {
  id: string;
  name: string;
  hairColor: string;
  skinColor: string;
  uniformColor: string;
  hairStyle: "short" | "long" | "ponytail" | "messy" | "buzz";
  accessory?: "glasses" | "hairpin" | "headband";
  gender: "male" | "female";
}

const SKIN_TONES = {
  light: "#FFD5B8",
  medium: "#E8B88A",
  tan: "#C68642",
};

const HAIR_COLORS = {
  black: "#1a1a1a",
  darkBrown: "#3d2314",
  brown: "#654321",
  lightBrown: "#8B6914",
};

export const CHARACTER_DATA: Record<string, CharacterData> = {
  s1:  { id: "s1",  name: "김민준", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.medium, uniformColor: "#2a4a8a", hairStyle: "short", gender: "male" },
  s2:  { id: "s2",  name: "이서윤", hairColor: HAIR_COLORS.darkBrown, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "long", accessory: "hairpin", gender: "female" },
  s3:  { id: "s3",  name: "박지호", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.medium, uniformColor: "#2a4a8a", hairStyle: "messy", gender: "male" },
  s4:  { id: "s4",  name: "최수아", hairColor: HAIR_COLORS.brown, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "ponytail", gender: "female" },
  s5:  { id: "s5",  name: "정하늘", hairColor: HAIR_COLORS.darkBrown, skinColor: SKIN_TONES.medium, uniformColor: "#2a4a8a", hairStyle: "short", gender: "male" },
  s6:  { id: "s6",  name: "한예은", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "long", accessory: "glasses", gender: "female" },
  s7:  { id: "s7",  name: "윤서준", hairColor: HAIR_COLORS.darkBrown, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "messy", gender: "male" },
  s8:  { id: "s8",  name: "임소율", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "ponytail", gender: "female" },
  s9:  { id: "s9",  name: "강도윤", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.medium, uniformColor: "#2a4a8a", hairStyle: "buzz", accessory: "glasses", gender: "male" },
  s10: { id: "s10", name: "오하린", hairColor: HAIR_COLORS.lightBrown, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "long", accessory: "headband", gender: "female" },
  s11: { id: "s11", name: "신우진", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.medium, uniformColor: "#2a4a8a", hairStyle: "buzz", gender: "male" },
  s12: { id: "s12", name: "배지민", hairColor: HAIR_COLORS.darkBrown, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "ponytail", gender: "female" },
  s13: { id: "s13", name: "조현우", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.tan, uniformColor: "#2a4a8a", hairStyle: "short", gender: "male" },
  s14: { id: "s14", name: "류채원", hairColor: HAIR_COLORS.brown, skinColor: SKIN_TONES.light, uniformColor: "#2a4a8a", hairStyle: "long", gender: "female" },
  s15: { id: "s15", name: "남시우", hairColor: HAIR_COLORS.black, skinColor: SKIN_TONES.medium, uniformColor: "#2a4a8a", hairStyle: "messy", gender: "male" },
};

// Generate box-shadow CSS for a character sprite (12x16 grid)
export function generateCharacterShadow(data: CharacterData, emotion: Emotion): string {
  const pixels: string[] = [];
  const { hairColor, skinColor, uniformColor, hairStyle, accessory, gender } = data;
  const eyeColor = "#1a1a1a";

  // Helper to add pixel
  const px = (x: number, y: number, color: string) => {
    pixels.push(`${x}px ${y}px 0 ${color}`);
  };

  // ── Hair (rows 0-4) ──
  if (hairStyle === "short" || hairStyle === "buzz") {
    for (let x = 3; x <= 8; x++) px(x, 0, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 1, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 2, hairColor);
    if (hairStyle === "short") {
      px(2, 3, hairColor); px(3, 3, hairColor);
      px(8, 3, hairColor); px(9, 3, hairColor);
    }
  } else if (hairStyle === "long") {
    for (let x = 3; x <= 8; x++) px(x, 0, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 1, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 2, hairColor);
    px(2, 3, hairColor); px(9, 3, hairColor);
    px(2, 4, hairColor); px(9, 4, hairColor);
    px(1, 3, hairColor); px(10, 3, hairColor);
    px(1, 4, hairColor); px(10, 4, hairColor);
    px(1, 5, hairColor); px(10, 5, hairColor);
    px(1, 6, hairColor); px(10, 6, hairColor);
  } else if (hairStyle === "ponytail") {
    for (let x = 3; x <= 8; x++) px(x, 0, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 1, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 2, hairColor);
    px(2, 3, hairColor); px(9, 3, hairColor);
    // Ponytail
    px(10, 1, hairColor); px(11, 2, hairColor); px(11, 3, hairColor); px(11, 4, hairColor);
  } else if (hairStyle === "messy") {
    px(4, 0, hairColor); px(6, 0, hairColor); px(8, 0, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 1, hairColor);
    for (let x = 2; x <= 9; x++) px(x, 2, hairColor);
    px(2, 3, hairColor); px(3, 3, hairColor);
    px(8, 3, hairColor); px(9, 3, hairColor);
    px(1, 2, hairColor); px(10, 1, hairColor);
  }

  // ── Face (rows 3-6) ──
  for (let x = 3; x <= 8; x++) {
    px(x, 3, skinColor);
    px(x, 4, skinColor);
    px(x, 5, skinColor);
    px(x, 6, skinColor);
  }

  // ── Eyes (row 4) ──
  px(4, 4, eyeColor);
  px(7, 4, eyeColor);

  // ── Emotion face (row 5 = mouth) ──
  switch (emotion) {
    case "happy":
      px(5, 5, "#e74c3c"); px(6, 5, "#e74c3c"); // smile
      px(4, 4, eyeColor); px(7, 4, eyeColor); // normal eyes
      break;
    case "neutral":
      px(5, 5, "#a0522d"); px(6, 5, "#a0522d"); // flat mouth
      break;
    case "worried":
      px(5, 5, "#a0522d"); px(6, 6, "#a0522d"); // slanted mouth
      break;
    case "sad":
      px(5, 6, "#5555aa"); px(6, 6, "#5555aa"); // frown
      px(4, 5, "#66aaff"); px(7, 5, "#66aaff"); // tears
      break;
  }

  // ── Accessories ──
  if (accessory === "glasses") {
    px(3, 4, "#666666"); px(4, 4, "#666666"); px(5, 4, "#666666");
    px(6, 4, "#666666"); px(7, 4, "#666666"); px(8, 4, "#666666");
    // Re-draw eyes on top
    px(4, 4, eyeColor); px(7, 4, eyeColor);
  } else if (accessory === "hairpin") {
    px(9, 2, "#ff69b4"); px(10, 2, "#ff69b4");
  } else if (accessory === "headband") {
    for (let x = 2; x <= 9; x++) px(x, 2, "#ff4444");
  }

  // ── Body/Uniform (rows 7-12) ──
  const collarColor = "#ffffff";
  // Collar
  px(4, 7, collarColor); px(5, 7, collarColor); px(6, 7, collarColor); px(7, 7, collarColor);
  // Uniform body
  for (let y = 8; y <= 12; y++) {
    for (let x = 3; x <= 8; x++) {
      px(x, y, uniformColor);
    }
  }
  // Arms
  for (let y = 8; y <= 11; y++) {
    px(2, y, uniformColor);
    px(9, y, uniformColor);
  }
  // Hands
  px(2, 12, skinColor); px(9, 12, skinColor);

  // ── Legs (rows 13-15) ──
  const pantsColor = gender === "male" ? "#1a1a3a" : "#1a1a3a";
  for (let y = 13; y <= 14; y++) {
    px(4, y, pantsColor); px(5, y, pantsColor);
    px(6, y, pantsColor); px(7, y, pantsColor);
  }
  // Shoes
  px(3, 15, "#2a2a2a"); px(4, 15, "#2a2a2a"); px(5, 15, "#2a2a2a");
  px(6, 15, "#2a2a2a"); px(7, 15, "#2a2a2a"); px(8, 15, "#2a2a2a");

  return pixels.join(",");
}

// Teacher character (14x20 grid - slightly taller than students)
export function generateTeacherShadow(): string {
  const pixels: string[] = [];
  const hairColor = "#2a1a0a";
  const skinColor = "#E8B88A";
  const suitColor = "#1a2a1a";
  const shirtColor = "#ffffff";
  const tieColor = "#8b2020";
  const glassColor = "#555555";
  const eyeColor = "#1a1a1a";

  const px = (x: number, y: number, color: string) => {
    pixels.push(`${x}px ${y}px 0 ${color}`);
  };

  // Hair (rows 0-3)
  for (let x = 4; x <= 9; x++) px(x, 0, hairColor);
  for (let x = 3; x <= 10; x++) px(x, 1, hairColor);
  for (let x = 3; x <= 10; x++) px(x, 2, hairColor);
  px(3, 3, hairColor); px(10, 3, hairColor);

  // Face (rows 3-7)
  for (let y = 3; y <= 7; y++) {
    for (let x = 4; x <= 9; x++) px(x, y, skinColor);
  }

  // Glasses
  px(4, 5, glassColor); px(5, 5, glassColor); px(6, 5, glassColor);
  px(7, 5, glassColor); px(8, 5, glassColor); px(9, 5, glassColor);
  // Eyes behind glasses
  px(5, 5, eyeColor); px(8, 5, eyeColor);
  // Smile
  px(6, 6, "#c0522d"); px(7, 6, "#c0522d");

  // Collar + Tie (row 8)
  for (let x = 4; x <= 9; x++) px(x, 8, shirtColor);
  px(6, 8, tieColor); px(7, 8, tieColor);

  // Suit body (rows 9-14)
  for (let y = 9; y <= 14; y++) {
    for (let x = 3; x <= 10; x++) px(x, y, suitColor);
    // Shirt/tie line
    px(6, y, y <= 12 ? tieColor : suitColor);
    px(7, y, y <= 12 ? tieColor : suitColor);
  }
  // Suit arms
  for (let y = 9; y <= 13; y++) {
    px(2, y, suitColor); px(11, y, suitColor);
  }
  // Hands
  px(2, 14, skinColor); px(11, 14, skinColor);
  // Book in hand
  px(11, 13, "#8b4513"); px(12, 13, "#8b4513"); px(13, 13, "#8b4513");
  px(11, 14, "#8b4513"); px(12, 14, "#8b4513"); px(13, 14, "#8b4513");
  px(12, 12, "#8b4513"); px(13, 12, "#8b4513");

  // Pants (rows 15-17)
  const pantsColor = "#0a0a2a";
  for (let y = 15; y <= 17; y++) {
    px(4, y, pantsColor); px(5, y, pantsColor);
    px(6, y, pantsColor); px(7, y, pantsColor);
    px(8, y, pantsColor); px(9, y, pantsColor);
  }

  // Shoes (rows 18-19)
  px(3, 18, "#1a1a1a"); px(4, 18, "#1a1a1a"); px(5, 18, "#1a1a1a");
  px(8, 18, "#1a1a1a"); px(9, 18, "#1a1a1a"); px(10, 18, "#1a1a1a");
  px(3, 19, "#1a1a1a"); px(4, 19, "#1a1a1a"); px(5, 19, "#1a1a1a");
  px(8, 19, "#1a1a1a"); px(9, 19, "#1a1a1a"); px(10, 19, "#1a1a1a");

  return pixels.join(",");
}

// Get emotion from happiness/stress scores
export function getEmotion(happiness: number, stress: number): Emotion {
  const score = happiness - stress;
  if (score >= 40) return "happy";
  if (score >= 10) return "neutral";
  if (score >= -10) return "worried";
  return "sad";
}
