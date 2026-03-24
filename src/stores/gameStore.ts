import { create } from "zustand";
import type { Resources, StudentProfile } from "@/types";
import { MOCK_STUDENTS } from "@/lib/mock/students";
import { MOCK_EVENTS, MOCK_OUTCOMES, getDefaultOutcome, type MockEvent, type MockOutcome } from "@/lib/mock/events";
import { checkGameover, calculateClassLevel, calculateTPReward } from "@/lib/game/engine";

interface GameState {
  sessionId: string | null;
  currentWeek: number;
  resources: Resources;
  classLevel: number;
  tycoonPoints: number;
  competencyScore: number;
  status: "active" | "completed" | "gameover" | "abandoned";
  gameoverType: string | null;
  students: (StudentProfile & { id: string; seatNumber: number })[];
  currentEvent: MockEvent | null;
  lastOutcome: MockOutcome | null;
  eventHistory: { week: number; event: MockEvent; choiceText: string; outcome: MockOutcome }[];
  unhandledBullyingCount: number;

  // Actions
  initGame: (sessionId: string) => void;
  advanceWeek: () => void;
  submitDecision: (choiceId: string) => void;
  dismissOutcome: () => void;
  setGameover: (type: string) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  currentWeek: 1,
  resources: {
    studentTrust: 50,
    parentSatisfaction: 50,
    schoolReputation: 50,
    teacherEnergy: 100,
  },
  classLevel: 1,
  tycoonPoints: 0,
  competencyScore: 50,
  status: "active" as const,
  gameoverType: null,
  students: [] as (StudentProfile & { id: string; seatNumber: number })[],
  currentEvent: null as MockEvent | null,
  lastOutcome: null as MockOutcome | null,
  eventHistory: [] as { week: number; event: MockEvent; choiceText: string; outcome: MockOutcome }[],
  unhandledBullyingCount: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  initGame: (sessionId) =>
    set({
      ...initialState,
      sessionId,
      students: MOCK_STUDENTS,
      status: "active",
    }),

  advanceWeek: () => {
    const state = get();
    const nextWeek = state.currentWeek + 1;

    if (nextWeek > 40) {
      set({ status: "completed", currentWeek: nextWeek });
      return;
    }

    // 해당 주차 이벤트 찾기 (없으면 가장 가까운 이벤트)
    const event =
      MOCK_EVENTS.find((e) => e.weekNumber === nextWeek) ||
      MOCK_EVENTS.find((e) => e.weekNumber >= nextWeek) ||
      MOCK_EVENTS[Math.min(nextWeek - 1, MOCK_EVENTS.length - 1) % MOCK_EVENTS.length];

    set({
      currentWeek: nextWeek,
      currentEvent: event ? { ...event, weekNumber: nextWeek } : null,
      lastOutcome: null,
    });
  },

  submitDecision: (choiceId) => {
    const state = get();
    if (!state.currentEvent) return;

    const event = state.currentEvent;
    const choice = event.presetChoices.find((c) => c.id === choiceId);
    if (!choice) return;

    // 결과 가져오기
    const outcomes = MOCK_OUTCOMES[event.id];
    const outcome = outcomes?.[choiceId] || getDefaultOutcome(choice.approach);

    // 자원 업데이트
    const newResources = {
      studentTrust: Math.max(0, Math.min(100, state.resources.studentTrust + outcome.resourceChanges.studentTrust)),
      parentSatisfaction: Math.max(0, Math.min(100, state.resources.parentSatisfaction + outcome.resourceChanges.parentSatisfaction)),
      schoolReputation: Math.max(0, Math.min(100, state.resources.schoolReputation + outcome.resourceChanges.schoolReputation)),
      teacherEnergy: Math.max(0, Math.min(100, state.resources.teacherEnergy + outcome.resourceChanges.teacherEnergy)),
    };

    // 게임오버 체크
    const gameoverCheck = checkGameover(newResources, state.unhandledBullyingCount);

    // TP 보상
    const tpReward = calculateTPReward(event.severity, outcome.resourceChanges);

    // 학급 레벨 계산
    const newClassLevel = calculateClassLevel(newResources, state.currentWeek);

    // 히스토리 추가
    const newHistory = [...state.eventHistory, {
      week: state.currentWeek,
      event,
      choiceText: choice.text,
      outcome,
    }];

    set({
      resources: newResources,
      lastOutcome: outcome,
      currentEvent: null,
      tycoonPoints: state.tycoonPoints + tpReward,
      classLevel: newClassLevel,
      eventHistory: newHistory,
      ...(gameoverCheck ? { status: "gameover", gameoverType: gameoverCheck } : {}),
    });
  },

  dismissOutcome: () => set({ lastOutcome: null }),

  setGameover: (type) => set({ status: "gameover", gameoverType: type }),

  reset: () => set(initialState),
}));
