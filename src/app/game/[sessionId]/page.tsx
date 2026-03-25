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
import { CLASS_LEVELS } from "@/types";
import { GAMEOVER_MESSAGES } from "@/lib/game/engine";
import type { Region, SchoolType, GameoverType } from "@/types";

/** Thin top bar showing 4 resource bars + week number */
function MiniResourceBar() {
  const { resources, currentWeek, togglePhone } = useGameStore();

  const bars = [
    { key: "studentTrust", value: resources.studentTrust, color: "#22c55e", label: "신뢰" },
    { key: "parentSatisfaction", value: resources.parentSatisfaction, color: "#3b82f6", label: "학부모" },
    { key: "schoolReputation", value: resources.schoolReputation, color: "#a855f7", label: "평판" },
    { key: "teacherEnergy", value: resources.teacherEnergy, color: "#eab308", label: "에너지" },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-1.5 cursor-pointer"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={() => {
        const store = useGameStore.getState();
        if (!store.phoneOpen) store.togglePhone();
        store.setPhoneApp("resources");
      }}
    >
      <span className="text-[10px] text-gray-400 pixel-text shrink-0">{currentWeek}주차</span>
      <div className="flex-1 flex gap-2">
        {bars.map((bar) => {
          const isDanger = bar.value <= 25;
          return (
            <div key={bar.key} className="flex-1 flex items-center gap-1">
              <span className="text-[8px] text-gray-500 w-6">{bar.label}</span>
              <div className="flex-1 h-2 bg-gray-800/50" style={{ border: "1px solid #222" }}>
                <div
                  className={isDanger ? "animate-resource-flash" : ""}
                  style={{
                    width: `${bar.value}%`,
                    height: "100%",
                    background: isDanger ? "#ef4444" : bar.color,
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <span className={`text-[8px] w-5 text-right ${isDanger ? "text-red-400" : "text-gray-500"}`}>
                {bar.value}
              </span>
            </div>
          );
        })}
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

        {/* Layer 3: Mini resource bar (top) */}
        <MiniResourceBar />

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
