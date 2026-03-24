// ── 학교 유형 ────────────────────────────────────
export type SchoolType = "elementary" | "middle" | "high";
export type Region = "urban" | "rural" | "newtown";

// ── 성격 유형 ────────────────────────────────────
export type PersonalityType =
  | "active"     // 활발형
  | "diligent"   // 성실형
  | "social"     // 사교형
  | "introvert"  // 내향형
  | "rebellious"; // 반항형

// ── 가정환경 ─────────────────────────────────────
export type FamilyType =
  | "stable"         // 안정적
  | "dual_income"    // 맞벌이(방치)
  | "overprotective" // 과잉보호
  | "single_parent"  // 한부모
  | "low_income"     // 경제적 어려움
  | "multicultural"; // 다문화

// ── 이벤트 카테고리 ──────────────────────────────
export type EventCategory =
  | "bullying"     // 학교폭력/왕따
  | "academic"     // 학업/성적
  | "behavior"     // 행동/생활지도
  | "parent"       // 학부모 관계
  | "mental"       // 학생 심리/복지
  | "social"       // 교우관계
  | "class_mgmt"   // 학급 운영
  | "special"      // 특수 상황
  | "admin";       // 학교 행정

// ── 게임 상태 ────────────────────────────────────
export type GameStatus = "active" | "completed" | "gameover" | "abandoned";
export type GameoverType = "burnout" | "collapse" | "complaint" | "discipline";

// ── 멘토 타입 ────────────────────────────────────
export type MentorType = "kim" | "park" | "lee" | "choi";

// ── 학급 레벨 ────────────────────────────────────
export const CLASS_LEVELS = {
  1: { name: "혼돈의 교실", description: "학기 초, 아이들이 서로 모르는 상태" },
  2: { name: "탐색기", description: "교우관계 형성 중, 소소한 갈등" },
  3: { name: "안정기", description: "규칙이 자리잡힘, 학급 문화 형성" },
  4: { name: "성장기", description: "학생들이 자율적으로 문제 해결 시작" },
  5: { name: "꿈의 학급", description: "학생들이 서로 돕고, 교사 개입 최소화" },
} as const;

// ── 교실 투자 ────────────────────────────────────
export const INVESTMENTS = {
  library: { name: "학급 문고 설치", cost: 50, effect: "학업 이벤트 긍정 확률 +10%" },
  art_corner: { name: "미술 코너 설치", cost: 30, effect: "학생 감정 회복 속도 +15%" },
  rules_board: { name: "학급 규칙 게시", cost: 20, effect: "행동 문제 발생 빈도 -10%" },
  seat_change: { name: "자리배치 변경", cost: 10, effect: "특정 학생 관계 리셋" },
  class_event: { name: "학급 이벤트 개최", cost: 40, effect: "전체 신뢰도 +5, 에너지 -5" },
} as const;

export type InvestmentType = keyof typeof INVESTMENTS;

// ── 4대 자원 ─────────────────────────────────────
export interface Resources {
  studentTrust: number;
  parentSatisfaction: number;
  schoolReputation: number;
  teacherEnergy: number;
}

// ── 학생 프로필 (AI 생성) ────────────────────────
export interface StudentProfile {
  name: string;
  gender: "male" | "female";
  personalityMain: PersonalityType;
  personalitySub: PersonalityType;
  personality: {
    openness: number;       // 개방성 0-100
    conscientiousness: number; // 성실성
    extraversion: number;   // 외향성
    agreeableness: number;  // 우호성
    neuroticism: number;    // 신경성
  };
  academic: {
    korean: number;   // 0-100
    math: number;
    english: number;
    science: number;
    social: number;
    overall: "top" | "middle" | "bottom" | "uneven";
  };
  family: {
    type: FamilyType;
    description: string;
  };
  social: {
    groupType: "popular" | "quiet" | "independent" | "isolated";
    role: "leader" | "follower" | "boundary" | "independent";
    friendIds: number[]; // seat numbers
  };
  emotional: {
    happiness: number;     // 0-100
    stress: number;
    trustInTeacher: number;
  };
  flags: string[];
  hiddenContext: string;
  backstory: string;
}

// ── 이벤트 (AI 생성) ────────────────────────────
export interface GeneratedEvent {
  eventType: EventCategory;
  severity: number; // 1-5
  title: string;
  description: string;
  involvedStudentIds: string[]; // student UUIDs
  aiContext: string;
  presetChoices: PresetChoice[];
}

export interface PresetChoice {
  id: string;
  text: string;
  approach: string; // 'authoritative' | 'democratic' | 'permissive' | 'professional'
}

// ── 결과 (AI 생성) ──────────────────────────────
export interface SimulatedOutcome {
  narrative: string;
  statChanges: {
    studentId: string;
    changes: Partial<{
      happiness: number;
      stress: number;
      trustInTeacher: number;
      academicChange: number;
    }>;
    newFlags: string[];
    removedFlags: string[];
  }[];
  resourceChanges: {
    studentTrust: number;
    parentSatisfaction: number;
    schoolReputation: number;
    teacherEnergy: number;
  };
  rippleEffects: string;
  futureSeeds: string[];
}
