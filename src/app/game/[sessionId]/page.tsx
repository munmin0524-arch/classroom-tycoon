"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { PixelBackground } from "@/components/pixel/PixelBackground";
import { ZoomContainer } from "@/components/game/ZoomContainer";
import { SeatMap } from "@/components/classroom/SeatMap";
import { DialogBox } from "@/components/game/DialogBox";
import { WeekTransition } from "@/components/game/WeekTransition";
import { PhonePeek } from "@/components/game/PhoneUI";
import { TutorialOverlay } from "@/components/game/TutorialOverlay";
import { EventBanner } from "@/components/game/EventBanner";
import { ChalkboardHUD } from "@/components/game/ChalkboardHUD";
import { TeacherCharacter, FloorClickArea } from "@/components/game/TeacherCharacter";
import { StudentTooltip, StudentProximityChecker } from "@/components/game/StudentTooltip";
import { CLASS_LEVELS } from "@/types";
import { GAMEOVER_MESSAGES } from "@/lib/game/engine";
import type { Region, SchoolType, GameoverType } from "@/types";

/** Action prompt telling player what to do - pointer-events-none so it doesn't block clicks */
function ActionPrompt() {
  const { activeEventStudentIds, showDialog, zoomPhase, isTransitioning, status } = useGameStore();

  if (showDialog || zoomPhase !== "idle" || isTransitioning || status !== "active") return null;

  const hasEvents = activeEventStudentIds.length > 0;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[15] pointer-events-none animate-fade-in">
      <div
        className="px-5 py-2.5 pixel-text text-sm text-center"
        style={{
          background: hasEvents ? "rgba(180, 40, 40, 0.85)" : "rgba(30, 80, 50, 0.85)",
          border: `2px solid ${hasEvents ? "#ff666666" : "#66cc6666"}`,
          color: hasEvents ? "#ffaaaa" : "#aaffaa",
        }}
      >
        {hasEvents
          ? "학생 위의 ! 를 클릭하여 이벤트에 대응하세요"
          : "우측 📱 교사 폰에서 다음 주로 진행하세요"
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
        <a href="/game/new" className="pixel-button pixel-button-primary inline-block">다시 시작</a>
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
        <a href="/game/new" className="pixel-button pixel-button-primary inline-block">새 게임</a>
      </div>
    </div>
  );
}

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;

  const {
    status, currentWeek, students, region, classLevel,
    activeEventStudentIds, showDialog, currentEvent,
    lastOutcome, dialogStudentId, isTransitioning,
    purchasedInvestments,
    initGame, completeTransition, triggerEvent,
    submitDecision, dismissOutcome,
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
        <PixelBackground region={region} classLevel={classLevel} purchasedInvestments={purchasedInvestments} />

        {/* Layer 2: Zoom + Students */}
        <ZoomContainer>
          <SeatMap
            students={students}
            activeEventStudentIds={activeEventStudentIds}
            onStudentEvent={triggerEvent}
          />
        </ZoomContainer>

        {/* Chalkboard HUD (on the blackboard, pointer-events-none) */}
        <ChalkboardHUD />

        {/* Floor click area for teacher movement (z-15, above background) */}
        <FloorClickArea />

        {/* Teacher character */}
        <TeacherCharacter />
        <StudentProximityChecker />
        <StudentTooltip />

        {/* Event banner (slides down after week transition) */}
        <EventBanner />

        {/* Action prompt (pointer-events-none) */}
        <ActionPrompt />

        {/* Phone peek system (right edge) */}
        <PhonePeek />

        {/* Dialog Box */}
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

        {/* Week Transition */}
        <WeekTransition
          fromWeek={currentWeek}
          toWeek={currentWeek + 1}
          isActive={isTransitioning}
          onComplete={completeTransition}
        />

        {/* Tutorial */}
        <TutorialOverlay />

        {/* Game Over / Completion */}
        {status === "gameover" && <GameOverScreen />}
        {status === "completed" && <CompletionScreen />}
      </div>
    </>
  );
}
