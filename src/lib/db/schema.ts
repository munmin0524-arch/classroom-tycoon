import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// ── 교사 (Teachers) ──────────────────────────────
export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  schoolType: text("school_type"), // 'elementary' | 'middle' | 'high'
  experienceYears: integer("experience_years").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── 게임 세션 (Game Sessions) ────────────────────
export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  teacherId: uuid("teacher_id")
    .references(() => teachers.id, { onDelete: "cascade" })
    .notNull(),
  schoolType: text("school_type").notNull(), // 'elementary' | 'middle' | 'high'
  grade: integer("grade").notNull(),
  region: text("region").default("urban"), // 'urban' | 'rural' | 'newtown'
  currentWeek: integer("current_week").default(1),
  semester: integer("semester").default(1),
  status: text("status").default("active"), // 'active' | 'completed' | 'gameover' | 'abandoned'
  classLevel: integer("class_level").default(1), // 1-5 학급 레벨
  // 4대 자원
  studentTrust: integer("student_trust").default(50),
  parentSatisfaction: integer("parent_satisfaction").default(50),
  schoolReputation: integer("school_reputation").default(50),
  teacherEnergy: integer("teacher_energy").default(100),
  // 교직 포인트
  tycoonPoints: integer("tycoon_points").default(0),
  // 적응형 난이도 (숨겨진 역량 점수)
  competencyScore: integer("competency_score").default(50),
  // AI 생성 학급 컨텍스트
  classContext: jsonb("class_context"),
  gameoverType: text("gameover_type"), // 'burnout' | 'collapse' | 'complaint' | 'discipline' | null
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── 학생 (Students) ─────────────────────────────
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => gameSessions.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  seatNumber: integer("seat_number").notNull(), // 1-30
  gender: text("gender").notNull(), // 'male' | 'female'
  // 성격 (메인 + 서브)
  personalityMain: text("personality_main").notNull(), // 'active' | 'diligent' | 'social' | 'introvert' | 'rebellious'
  personalitySub: text("personality_sub").notNull(),
  // 상세 속성 (JSON)
  personality: jsonb("personality").notNull(), // Big Five 등 상세
  academic: jsonb("academic").notNull(), // {korean, math, english, ...}
  family: jsonb("family").notNull(), // 가정환경
  social: jsonb("social").notNull(), // 교우관계, 그룹
  emotional: jsonb("emotional").notNull(), // {happiness, stress, trustInTeacher}
  // 상태 플래그
  flags: jsonb("flags").default([]), // ['bullying_victim', 'grade_drop', ...]
  // 히든 설정 (교사에게 안 보임)
  hiddenContext: text("hidden_context"),
  backstory: text("backstory"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── 주간 이벤트 (Weekly Events) ──────────────────
export const weeklyEvents = pgTable("weekly_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => gameSessions.id, { onDelete: "cascade" })
    .notNull(),
  weekNumber: integer("week_number").notNull(),
  eventType: text("event_type").notNull(), // 'bullying' | 'academic' | 'behavior' | 'parent' | 'mental' | 'social' | 'class_mgmt' | 'special' | 'admin'
  severity: integer("severity").default(1), // 1-5
  title: text("title").notNull(),
  description: text("description").notNull(),
  involvedStudentIds: jsonb("involved_student_ids").notNull(), // uuid[]
  // AI가 사용할 숨겨진 컨텍스트
  aiContext: jsonb("ai_context"),
  // 프리셋 선택지
  presetChoices: jsonb("preset_choices"), // [{id, text, approach}]
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── 교사 결정 (Decisions) ────────────────────────
export const decisions = pgTable("decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => weeklyEvents.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => gameSessions.id)
    .notNull(),
  teacherId: uuid("teacher_id")
    .references(() => teachers.id)
    .notNull(),
  choiceType: text("choice_type").notNull(), // 'preset' | 'custom'
  choiceText: text("choice_text").notNull(),
  // AI 시뮬레이션 결과
  aiOutcome: jsonb("ai_outcome").notNull(), // {narrative, statChanges, newFlags, rippleEffects, futureSeeds}
  outcomeSummary: text("outcome_summary").notNull(),
  educationalNote: text("educational_note"), // 멘토 피드백
  mentorType: text("mentor_type").default("kim"), // 'kim' | 'park' | 'lee' | 'choi'
  // 자원 변화량
  resourceChanges: jsonb("resource_changes"), // {studentTrust, parentSatisfaction, schoolReputation, teacherEnergy}
  createdAt: timestamp("created_at").defaultNow(),
});

// ── 교실 투자 (Classroom Investments) ────────────
export const classroomInvestments = pgTable("classroom_investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => gameSessions.id, { onDelete: "cascade" })
    .notNull(),
  investmentType: text("investment_type").notNull(), // 'library' | 'art_corner' | 'rules_board' | 'seat_change' | 'class_event'
  weekPurchased: integer("week_purchased").notNull(),
  tpCost: integer("tp_cost").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── 커뮤니티: 공유 시나리오 ─────────────────────
export const sharedScenarios = pgTable("shared_scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => weeklyEvents.id),
  decisionId: uuid("decision_id").references(() => decisions.id),
  teacherId: uuid("teacher_id")
    .references(() => teachers.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── 커뮤니티: 댓글 ──────────────────────────────
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id")
    .references(() => sharedScenarios.id, { onDelete: "cascade" })
    .notNull(),
  teacherId: uuid("teacher_id")
    .references(() => teachers.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
