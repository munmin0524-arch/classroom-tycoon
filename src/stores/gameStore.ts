import { create } from "zustand";
import type { Resources, StudentProfile, Region, SchoolType, ZoomPhase } from "@/types";
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
  resolvedEventIds: string[];

  // Region & School
  region: Region;
  schoolType: SchoolType;
  grade: number;

  // Zoom state
  zoomTarget: { studentId: string; seatIndex: number } | null;
  zoomPhase: ZoomPhase;

  // UI state
  activeEventStudentIds: string[];
  showDialog: boolean;
  dialogEvent: MockEvent | null;
  dialogStudentId: string | null;
  isTransitioning: boolean;

  // Pending gameover from delayed triggers
  pendingGameover: { week: number; type: string } | null;

  // Phone UI state
  phoneOpen: boolean;
  phoneApp: "home" | "roster" | "notifications" | "resources" | "history" | "classinfo" | "nextweek" | null;
  phoneSelectedStudentId: string | null;

  // Actions
  togglePhone: () => void;
  setPhoneApp: (app: GameState["phoneApp"]) => void;
  setPhoneSelectedStudent: (id: string | null) => void;
  triggerEventFromPhone: (studentId: string) => void;
  initGame: (sessionId: string, region?: Region, schoolType?: SchoolType, grade?: number) => void;
  advanceWeek: () => void;
  completeTransition: () => void;
  triggerEvent: (studentId: string) => void;
  submitDecision: (choiceId: string) => void;
  dismissOutcome: () => void;
  setZoomTarget: (target: { studentId: string; seatIndex: number } | null) => void;
  setZoomPhase: (phase: ZoomPhase) => void;
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
  resolvedEventIds: [] as string[],
  region: "urban" as Region,
  schoolType: "middle" as SchoolType,
  grade: 1,
  zoomTarget: null as { studentId: string; seatIndex: number } | null,
  zoomPhase: "idle" as ZoomPhase,
  activeEventStudentIds: [] as string[],
  showDialog: false,
  dialogEvent: null as MockEvent | null,
  dialogStudentId: null as string | null,
  isTransitioning: false,
  pendingGameover: null as { week: number; type: string } | null,
  phoneOpen: false,
  phoneApp: null as GameState["phoneApp"],
  phoneSelectedStudentId: null as string | null,
};

// Select eligible events for a given week
function selectEventsForWeek(
  week: number,
  resolvedEventIds: string[],
): MockEvent[] {
  const eligible = MOCK_EVENTS.filter((e) => {
    // Already resolved
    if (resolvedEventIds.includes(e.id)) return false;
    // Check week range
    if (week < e.weekRange[0] || week > e.weekRange[1]) return false;
    // Check prerequisite
    if (e.prerequisiteEventId && !resolvedEventIds.includes(e.prerequisiteEventId)) return false;
    return true;
  });

  // Select 1-2 events, preferring variety of students
  const selected: MockEvent[] = [];
  const usedStudents = new Set<string>();

  // Sort by severity descending for priority
  const sorted = [...eligible].sort((a, b) => b.severity - a.severity);

  for (const event of sorted) {
    if (selected.length >= 2) break;
    if (usedStudents.has(event.triggerStudentId)) continue;
    selected.push(event);
    usedStudents.add(event.triggerStudentId);
  }

  return selected;
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  initGame: (sessionId, region = "urban", schoolType = "middle", grade = 1) => {
    // Select initial events for week 1
    const initialEvents = selectEventsForWeek(1, []);
    const activeStudentIds = initialEvents.map((e) => e.triggerStudentId);

    set({
      ...initialState,
      sessionId,
      region,
      schoolType,
      grade,
      students: MOCK_STUDENTS,
      status: "active",
      activeEventStudentIds: activeStudentIds,
    });
  },

  advanceWeek: () => {
    const state = get();
    const nextWeek = state.currentWeek + 1;

    if (nextWeek > 40) {
      set({ status: "completed", currentWeek: nextWeek });
      return;
    }

    // Check pending gameover
    if (state.pendingGameover && nextWeek >= state.pendingGameover.week) {
      set({
        status: "gameover",
        gameoverType: state.pendingGameover.type,
        currentWeek: nextWeek,
      });
      return;
    }

    // Start transition animation
    set({ isTransitioning: true });
  },

  completeTransition: () => {
    const state = get();
    const nextWeek = state.currentWeek + 1;

    // Select events for the new week
    const events = selectEventsForWeek(nextWeek, state.resolvedEventIds);
    const activeStudentIds = events.map((e) => e.triggerStudentId);

    set({
      currentWeek: nextWeek,
      isTransitioning: false,
      lastOutcome: null,
      currentEvent: null,
      activeEventStudentIds: activeStudentIds,
      showDialog: false,
      dialogEvent: null,
      dialogStudentId: null,
      zoomTarget: null,
      zoomPhase: "idle",
    });
  },

  triggerEvent: (studentId) => {
    const state = get();
    const event = MOCK_EVENTS.find(
      (e) =>
        e.triggerStudentId === studentId &&
        !state.resolvedEventIds.includes(e.id) &&
        state.currentWeek >= e.weekRange[0] &&
        state.currentWeek <= e.weekRange[1] &&
        (!e.prerequisiteEventId || state.resolvedEventIds.includes(e.prerequisiteEventId))
    );

    if (!event) return;

    const student = state.students.find((s) => s.id === studentId);
    if (!student) return;

    // Start zoom
    set({
      currentEvent: event,
      dialogStudentId: studentId,
      zoomTarget: { studentId, seatIndex: student.seatNumber },
      zoomPhase: "zooming-in",
    });

    // After zoom completes, show dialog (handled by ZoomContainer effect)
  },

  submitDecision: (choiceId) => {
    const state = get();
    if (!state.currentEvent) return;

    const event = state.currentEvent;
    const choice = event.presetChoices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Get outcome
    const outcomes = MOCK_OUTCOMES[event.id];
    const outcome = outcomes?.[choiceId] || getDefaultOutcome(choice.approach);

    // Update resources
    const newResources = {
      studentTrust: Math.max(0, Math.min(100, state.resources.studentTrust + outcome.resourceChanges.studentTrust)),
      parentSatisfaction: Math.max(0, Math.min(100, state.resources.parentSatisfaction + outcome.resourceChanges.parentSatisfaction)),
      schoolReputation: Math.max(0, Math.min(100, state.resources.schoolReputation + outcome.resourceChanges.schoolReputation)),
      teacherEnergy: Math.max(0, Math.min(100, state.resources.teacherEnergy + outcome.resourceChanges.teacherEnergy)),
    };

    // Gameover check
    const gameoverCheck = checkGameover(newResources, state.unhandledBullyingCount);

    // TP reward
    const tpReward = calculateTPReward(event.severity, outcome.resourceChanges);

    // Class level
    const newClassLevel = calculateClassLevel(newResources, state.currentWeek);

    // History
    const newHistory = [...state.eventHistory, { week: state.currentWeek, event, choiceText: choice.text, outcome }];

    // Handle delayed gameover trigger
    let pendingGameover = state.pendingGameover;
    if (outcome.triggersGameover && outcome.gameoverDelay) {
      pendingGameover = {
        week: state.currentWeek + outcome.gameoverDelay,
        type: "discipline",
      };
    }

    // Mark event resolved
    const resolvedEventIds = [...state.resolvedEventIds, event.id];

    // Remove this student from active events
    const activeEventStudentIds = state.activeEventStudentIds.filter((id) => id !== event.triggerStudentId);

    set({
      resources: newResources,
      lastOutcome: outcome,
      tycoonPoints: state.tycoonPoints + tpReward,
      classLevel: newClassLevel,
      eventHistory: newHistory,
      resolvedEventIds,
      activeEventStudentIds,
      showDialog: true,
      pendingGameover,
      ...(gameoverCheck ? { status: "gameover", gameoverType: gameoverCheck } : {}),
    });
  },

  dismissOutcome: () => {
    set({
      lastOutcome: null,
      currentEvent: null,
      showDialog: false,
      dialogEvent: null,
      dialogStudentId: null,
      zoomPhase: "zooming-out",
    });
    // ZoomContainer will handle the zoom-out → idle transition
  },

  setZoomTarget: (target) => set({ zoomTarget: target }),
  setZoomPhase: (phase) => {
    const state = get();
    set({ zoomPhase: phase });

    // When zoom-in completes, show dialog
    if (phase === "zoomed" && state.currentEvent) {
      set({ showDialog: true, dialogEvent: state.currentEvent });
    }
  },

  setGameover: (type) => set({ status: "gameover", gameoverType: type }),
  reset: () => set(initialState),

  // Phone actions
  togglePhone: () => {
    const state = get();
    set({
      phoneOpen: !state.phoneOpen,
      phoneApp: !state.phoneOpen ? "home" : null,
      phoneSelectedStudentId: null,
    });
  },
  setPhoneApp: (app) => set({ phoneApp: app, phoneSelectedStudentId: null }),
  setPhoneSelectedStudent: (id) => set({ phoneSelectedStudentId: id }),
  triggerEventFromPhone: (studentId) => {
    // Close phone, then trigger event
    set({ phoneOpen: false, phoneApp: null, phoneSelectedStudentId: null });
    // Small delay so phone closes before zoom starts
    setTimeout(() => get().triggerEvent(studentId), 200);
  },
}));
