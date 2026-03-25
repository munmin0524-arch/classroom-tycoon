"use client";

import { useGameStore } from "@/stores/gameStore";

const STEPS = [
  {
    title: "1. 이벤트 확인",
    description: "학생 위에 뜨는 노란색 ! 말풍선을 클릭하세요.\n이벤트가 발생한 학생의 상황을 확인할 수 있습니다.",
    highlight: "top",
  },
  {
    title: "2. 선택지 결정",
    description: "대화창에서 선택지를 골라 대응하세요.\n선택에 따라 자원(신뢰/학부모/평판/에너지)이 변합니다.",
    highlight: "center",
  },
  {
    title: "3. 교사 폰 활용",
    description: "우측 하단 📱 교사 폰을 눌러보세요.\n학생 명부, 알림함, 자원 현황을 확인하고\n다음 주로 진행할 수 있습니다.",
    highlight: "bottom-right",
  },
];

export function TutorialOverlay() {
  const { tutorialStep, nextTutorialStep } = useGameStore();

  if (tutorialStep === null) return null;
  const step = STEPS[tutorialStep];
  if (!step) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center cursor-pointer"
      style={{ background: "rgba(0, 0, 0, 0.7)" }}
      onClick={nextTutorialStep}
    >
      {/* Arrow pointing to relevant area */}
      {step.highlight === "top" && (
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 text-yellow-300 text-4xl animate-exclamation">
          ↑
        </div>
      )}
      {step.highlight === "bottom-right" && (
        <div className="absolute bottom-20 right-28 text-yellow-300 text-4xl animate-exclamation">
          ↘
        </div>
      )}

      {/* Tutorial card */}
      <div
        className="pixel-border p-6 text-center max-w-md mx-4"
        style={{ background: "rgba(10, 10, 30, 0.98)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-yellow-300 text-lg pixel-text mb-3">{step.title}</div>
        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-6">
          {step.description}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: i === tutorialStep ? "#ffd700" : "#333" }}
            />
          ))}
        </div>

        <button
          onClick={nextTutorialStep}
          className="pixel-button pixel-button-primary px-8 py-2 text-sm"
        >
          {tutorialStep < STEPS.length - 1 ? "다음" : "시작하기!"}
        </button>

        <div className="text-[9px] text-gray-600 mt-2">화면 아무 곳이나 클릭해도 넘어갑니다</div>
      </div>
    </div>
  );
}
