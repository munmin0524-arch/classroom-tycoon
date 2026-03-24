import type { Resources, GameoverType } from "@/types";

// ── 게임오버 체크 ────────────────────────────────
export function checkGameover(resources: Resources, unhandledBullyingCount: number): GameoverType | null {
  if (resources.teacherEnergy <= 0) return "burnout";
  if (resources.studentTrust <= 20) return "collapse";
  if (resources.parentSatisfaction <= 10) return "complaint";
  if (unhandledBullyingCount >= 3) return "discipline";
  return null;
}

// ── 학급 레벨 계산 ───────────────────────────────
export function calculateClassLevel(resources: Resources, week: number): number {
  const avg = (resources.studentTrust + resources.parentSatisfaction + resources.schoolReputation) / 3;

  if (avg >= 80 && week >= 20) return 5;
  if (avg >= 65 && week >= 15) return 4;
  if (avg >= 50 && week >= 8) return 3;
  if (avg >= 35 && week >= 3) return 2;
  return 1;
}

// ── 역량 점수 업데이트 ──────────────────────────
export function updateCompetencyScore(
  currentScore: number,
  resourceChanges: Partial<Resources>,
  eventResolved: boolean
): number {
  let delta = 0;

  // 자원 변화가 전반적으로 긍정적이면 +
  const totalChange =
    (resourceChanges.studentTrust || 0) +
    (resourceChanges.parentSatisfaction || 0) +
    (resourceChanges.schoolReputation || 0);

  if (totalChange > 10) delta += 5;
  else if (totalChange > 0) delta += 2;
  else if (totalChange < -10) delta -= 5;
  else if (totalChange < 0) delta -= 2;

  // 이벤트 해결 여부
  if (eventResolved) delta += 3;
  else delta -= 3;

  return Math.max(0, Math.min(100, currentScore + delta));
}

// ── 난이도 티어 계산 ─────────────────────────────
export type DifficultyTier = "easy" | "normal" | "hard";

export function getDifficultyTier(competencyScore: number): DifficultyTier {
  if (competencyScore >= 70) return "hard";
  if (competencyScore >= 40) return "normal";
  return "easy";
}

// ── 주간 이벤트 난이도 범위 ──────────────────────
export function getEventSeverityRange(
  week: number,
  difficulty: DifficultyTier
): { min: number; max: number } {
  // 기본 주차별 난이도 곡선
  let baseMin = 1;
  let baseMax = 2;

  if (week >= 30) { baseMin = 2; baseMax = 5; }
  else if (week >= 20) { baseMin = 2; baseMax = 4; }
  else if (week >= 10) { baseMin = 1; baseMax = 3; }

  // 역량에 따른 조절
  if (difficulty === "hard") {
    baseMin = Math.min(baseMin + 1, 4);
    baseMax = Math.min(baseMax + 1, 5);
  } else if (difficulty === "easy") {
    baseMax = Math.max(baseMax - 1, baseMin);
  }

  return { min: baseMin, max: baseMax };
}

// ── TP 보상 계산 ─────────────────────────────────
export function calculateTPReward(severity: number, resourceChanges: Partial<Resources>): number {
  const baseTP = severity * 5; // 난이도 비례
  const totalChange =
    (resourceChanges.studentTrust || 0) +
    (resourceChanges.parentSatisfaction || 0) +
    (resourceChanges.schoolReputation || 0);

  // 좋은 결과일수록 보너스
  const bonus = totalChange > 10 ? 10 : totalChange > 0 ? 5 : 0;
  return baseTP + bonus;
}

// ── 게임오버 메시지 ──────────────────────────────
export const GAMEOVER_MESSAGES: Record<GameoverType, { title: string; description: string }> = {
  burnout: {
    title: "번아웃 엔딩",
    description: "체력이 바닥나 휴직을 결정했습니다. 교사의 건강도 중요합니다.",
  },
  collapse: {
    title: "학급 붕괴 엔딩",
    description: "학생들의 신뢰를 잃어 학급 운영이 불가능해졌습니다.",
  },
  complaint: {
    title: "민원 폭주 엔딩",
    description: "학부모 불만이 폭주하여 교장실에 불려갔습니다.",
  },
  discipline: {
    title: "징계 엔딩",
    description: "학교폭력에 적절히 대응하지 못해 징계를 받았습니다.",
  },
};
