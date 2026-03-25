"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { PixelBackground } from "@/components/pixel/PixelBackground";
import { ZoomContainer } from "@/components/game/ZoomContainer";
import { SeatMap } from "@/components/classroom/SeatMap";
import { DialogBox } from "@/components/game/DialogBox";
import { WeekTransition } from "@/components/game/WeekTransition";
import { PhoneToggleButton, PhoneOverlay } from "@/components/game/PhoneUI";
import { TutorialOverlay } from "@/components/game/TutorialOverlay";
import { EventBanner } from "@/components/game/EventBanner";
import { ChalkboardHUD } from "@/components/game/ChalkboardHUD";
import { TeacherCharacter, FloorClickArea } from "@/components/game/TeacherCharacter";
import { StudentTooltip, StudentProximityChecker } from "@/components/game/StudentTooltip";
import { CLASS_LEVELS } from "@/types";
import { GAMEOVER_MESSAGES } from "@/lib/game/engine";
import type { Region, SchoolType, GameoverType, Resources } from "@/types";

/** Full game HUD with week, level, resources+trends, TP, events */
function GameHUD() {
  const {
    resources, previousResources, currentWeek, classLevel, tycoonPoints,
    activeEventStudentIds, lastResourceChanges, showDialog, zoomPhase,
  } = useGameStore();

  const levelInfo = CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS];
  const eventCount = activeEventStudentIds.length;

  function getTrend(key: keyof Resources): { arrow: string; color: string } {
    if (!previousResources) return { arrow: "", color: "#888" };
    const diff = resources[key] - previousResources[key];
    if (diff > 0) return { arrow: "↑", color: "#4ade80" };
    if (diff < 0) return { arrow: "↓", color: "#f87171" };
    return { arrow: "→", color: "#666" };
  }

  const bars: { key: keyof Resources; label: string; color: string }[] = [
    { key: "studentTrust", label: "신뢰", color: "#22c55e" },
    { key: "parentSatisfaction", label: "학부모", color: "#3b82f6" },
    { key: "schoolReputation", label: "평판", color: "#a855f7" },
    { key: "teacherEnergy", label: "에너지", color: "#eab308" },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 flex items-center gap-2 px-3 py-1"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", borderBottom: "2px solid #222" }}
    >
      {/* Week + progress */}
      <div className="flex items-center gap-1 shrink-0 pr-2" style={{ borderRight: "1px solid #333" }}>
        <span className="text-[10px] text-gray-400 pixel-text">{currentWeek}</span>
        <span className="text-[8px] text-gray-600">/40</span>
        <div className="w-8 h-1.5 bg-gray-800 ml-1">
          <div style={{ width: `${(currentWeek / 40) * 100}%`, height: "100%", background: "#4a90d9" }} />
        </div>
      </div>

      {/* Class level */}
      <div className="flex items-center gap-1 shrink-0 pr-2" style={{ borderRight: "1px solid #333" }}>
        <div className="flex gap-px">
          {[1, 2, 3, 4, 5].map((lv) => (
            <span key={lv} className="text-[8px]" style={{ color: lv <= classLevel ? "#eab308" : "#333" }}>★</span>
          ))}
        </div>
        <span className="text-[8px] text-gray-400 pixel-text hidden xl:inline">{levelInfo?.name}</span>
      </div>

      {/* 4 Resource bars with trends */}
      <div className="flex-1 flex gap-2">
        {bars.map((bar) => {
          const val = resources[bar.key];
          const isDanger = val <= 25;
          const trend = getTrend(bar.key);
          const change = lastResourceChanges?.[bar.key];

          return (
            <div key={bar.key} className="flex-1 flex items-center gap-1 relative">
              <span className="text-[8px] text-gray-500 w-7 shrink-0">{bar.label}</span>
              <span className="text-[9px] shrink-0" style={{ color: trend.color }}>{trend.arrow}</span>
              <div className="flex-1 h-2 bg-gray-800/60" style={{ border: "1px solid #222" }}>
                <div
                  className={isDanger ? "animate-resource-flash" : ""}
                  style={{
                    width: `${val}%`,
                    height: "100%",
                    background: isDanger ? "#ef4444" : bar.color,
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <span className={`text-[9px] w-6 text-right shrink-0 ${isDanger ? "text-red-400" : "text-gray-400"}`}>
                {val}
              </span>
              {/* Floating resource change */}
              {change !== undefined && change !== 0 && (
                <span
                  className="absolute -top-3 right-0 text-[9px] font-bold animate-float-up pointer-events-none"
                  style={{ color: change > 0 ? "#4ade80" : "#f87171" }}
                >
                  {change > 0 ? `+${change}` : change}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* TP */}
      <div className="shrink-0 pl-2" style={{ borderLeft: "1px solid #333" }}>
        <span className="text-[10px] text-yellow-300 pixel-text">{tycoonPoints}TP</span>
      </div>

      {/* Event count */}
      <div
        className="shrink-0 pl-2 cursor-pointer"
        style={{ borderLeft: "1px solid #333" }}
        onClick={() => {
          const store = useGameStore.getState();
          if (!store.phoneOpen) store.togglePhone();
          store.setPhoneApp("notifications");
        }}
      >
        {eventCount > 0 ? (
          <span className="text-[10px] text-red-400 pixel-text animate-resource-flash">{eventCount}건</span>
        ) : (
          <span className="text-[10px] text-green-400 pixel-text">OK</span>
        )}
      </div>
    </div>
  );
}

/** Action prompt telling player what to do */
function ActionPrompt() {
  const { activeEventStudentIds, showDialog, zoomPhase, isTransitioning, status } = useGameStore();

  if (showDialog || zoomPhase !== "idle" || isTransitioning || status !== "active") return null;

  const hasEvents = activeEventStudentIds.length > 0;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-15 animate-fade-in">
      <div
        className="px-4 py-2 pixel-text text-[11px] text-center"
        style={{
          background: hasEvents ? "rgba(180, 40, 40, 0.85)" : "rgba(30, 80, 50, 0.85)",
          border: `1px solid ${hasEvents ? "#ff666644" : "#66cc6644"}`,
          color: hasEvents ? "#ffaaaa" : "#aaffaa",
        }}
      >
        {hasEvents
          ? "학생 위의 ! 를 클릭하여 이벤트에 대응하세요"
          : "📱 교사 폰에서 다음 주로 진행하세요"
        }
      </div>
    </div>
  );
}

function GameOverScreen() {
  const { gameoverType, tycoonPoints, classLevel, eventHistory } = useGameStore();
  const msg = GAMEOVER_MESSAGES[gameoverType as GameoverType] || { title: "게임 오버", description: "" };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.9)" }}>
      <div className="pixel-border p-8 text-center" style={{ background: "rgba(20, 10, 10, 0.95)", maxWidth: 500 }}>
        <div className="text-red-400 text-2xl pixel-text mb-4">{msg.title}</div>
        <div className="text-gray-300 text-sm mb-6">{msg.description}</div>
        <div className="text-gray-400 text-xs space-y-1 mb-6">
          <div>획득 TP: {tycoonPoints}</div>
          <div>학급 레벨: {CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS]?.name}</div>
          <div>처리한 이벤트: {eventHistory.length}건</div>
        </div>
        <a href="/game/new" className="pixel-button pixel-button-primary inline-block">
          다시 시작
        </a>
      </div>
    </div>
  );
}

function CompletionScreen() {
  const { tycoonPoints, classLevel, eventHistory, resources } = useGameStore();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.9)" }}>
      <div className="pixel-border p-8 text-center" style={{ background: "rgba(10, 10, 30, 0.95)", maxWidth: 500 }}>
        <div className="text-yellow-300 text-2xl pixel-text mb-4">학기 완료!</div>
        <div className="text-gray-300 text-sm mb-6">40주의 여정을 마쳤습니다.</div>
        <div className="text-gray-400 text-xs space-y-1 mb-6">
          <div>총 TP: {tycoonPoints}</div>
          <div>최종 학급: {CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS]?.name}</div>
          <div>처리한 이벤트: {eventHistory.length}건</div>
          <div>최종 신뢰도: {resources.studentTrust}</div>
        </div>
        <a href="/game/new" className="pixel-button pixel-button-primary inline-block">
          새 게임
        </a>
      </div>
    </div>
  );
}

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;

  const {
    status,
    currentWeek,
    students,
    region,
    activeEventStudentIds,
    showDialog,
    currentEvent,
    lastOutcome,
    dialogStudentId,
    isTransitioning,
    initGame,
    completeTransition,
    triggerEvent,
    submitDecision,
    dismissOutcome,
  } = useGameStore();

  useEffect(() => {
    const r = (searchParams.get("region") as Region) || "urban";
    const st = (searchParams.get("schoolType") as SchoolType) || "middle";
    const g = parseInt(searchParams.get("grade") || "1");
    initGame(sessionId, r, st, g);
  }, [sessionId, searchParams, initGame]);

  const dialogStudent = dialogStudentId ? students.find((s) => s.id === dialogStudentId) : null;

  return (
    <>
      {/* Mobile gate */}
      <div className="mobile-gate fixed inset-0 z-[300] flex items-center justify-center bg-[#1a1a2e] p-8">
        <div className="pixel-border p-6 text-center" style={{ background: "rgba(10,10,30,0.95)" }}>
          <div className="text-yellow-300 text-lg pixel-text mb-3">교실 타이쿤</div>
          <div className="text-gray-300 text-sm">PC 또는 태블릿에서 이용해주세요.</div>
          <div className="text-gray-500 text-xs mt-2">최소 768px 이상의 화면이 필요합니다.</div>
        </div>
      </div>

      {/* Game container */}
      <div className="game-container relative w-screen h-screen overflow-hidden" data-region={region}>
        {/* Layer 1: Background */}
        <PixelBackground region={region} />

        {/* Layer 2: Zoom + Students */}
        <ZoomContainer>
          <SeatMap
            students={students}
            activeEventStudentIds={activeEventStudentIds}
            onStudentEvent={triggerEvent}
          />
        </ZoomContainer>

        {/* Layer 3: Chalkboard HUD (rendered on the blackboard) */}
        <ChalkboardHUD />

        {/* Layer 3b: Thin top bar (compact fallback) */}
        <GameHUD />

        {/* Floor click area for teacher movement */}
        <FloorClickArea />

        {/* Teacher character */}
        <TeacherCharacter />
        <StudentProximityChecker />
        <StudentTooltip />

        {/* Event banner (slides down after week transition) */}
        <EventBanner />

        {/* Action prompt (bottom center) */}
        <ActionPrompt />

        {/* Layer 4: Phone toggle button (bottom-right) */}
        <PhoneToggleButton />

        {/* Layer 5: Phone overlay */}
        <PhoneOverlay />

        {/* Layer 6: Dialog Box */}
        {showDialog && currentEvent && dialogStudent && (
          <DialogBox
            event={currentEvent}
            studentId={dialogStudent.id}
            happiness={dialogStudent.emotional.happiness}
            stress={dialogStudent.emotional.stress}
            outcome={lastOutcome}
            onChoiceSelect={submitDecision}
            onDismiss={dismissOutcome}
          />
        )}

        {/* Layer 7: Week Transition */}
        <WeekTransition
          fromWeek={currentWeek}
          toWeek={currentWeek + 1}
          isActive={isTransitioning}
          onComplete={completeTransition}
        />

        {/* Tutorial overlay */}
        <TutorialOverlay />

        {/* Game Over / Completion Overlays */}
        {status === "gameover" && <GameOverScreen />}
        {status === "completed" && <CompletionScreen />}
      </div>
    </>
  );
}
