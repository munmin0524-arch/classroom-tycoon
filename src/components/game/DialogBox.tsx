"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PixelPortrait } from "@/components/pixel/PixelPortrait";
import { CHARACTER_DATA } from "@/lib/pixel-art/characters";
import type { MockEvent, MockOutcome } from "@/lib/mock/events";

interface DialogBoxProps {
  event: MockEvent;
  studentId: string;
  happiness?: number;
  stress?: number;
  outcome?: MockOutcome | null;
  onChoiceSelect: (choiceId: string) => void;
  onDismiss: () => void;
}

export function DialogBox({
  event,
  studentId,
  happiness = 50,
  stress = 30,
  outcome,
  onChoiceSelect,
  onDismiss,
}: DialogBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const fullText = outcome ? outcome.narrative : event.description;
  const charData = CHARACTER_DATA[studentId];

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  const skipTypewriter = useCallback(() => {
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  }, [isTyping, fullText]);

  const handleChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    onChoiceSelect(choiceId);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 inset-x-0 z-50 p-4"
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="pixel-border mx-auto flex gap-4 p-4"
          style={{
            maxWidth: 900,
            background: "rgba(10, 10, 30, 0.95)",
            backdropFilter: "blur(4px)",
          }}
          onClick={skipTypewriter}
        >
          {/* Portrait */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <PixelPortrait
              studentId={studentId}
              happiness={happiness}
              stress={stress}
              scale={3}
            />
            <span className="text-xs text-gray-300 pixel-text">
              {charData?.name ?? "???"}
            </span>
          </div>

          {/* Text + Choices */}
          <div className="flex-1 flex flex-col min-h-[140px]">
            {/* Event title */}
            <div className="text-yellow-300 text-sm pixel-text mb-1 flex items-center gap-2">
              <span className="text-red-400">{"★".repeat(event.severity)}</span>
              <span>{event.title}</span>
            </div>

            {/* Narrative text with typewriter */}
            <div className="text-white text-sm leading-relaxed flex-1 mb-3">
              {displayedText}
              {isTyping && <span className="animate-cursor-blink ml-0.5">▌</span>}
            </div>

            {/* Resource changes (when showing outcome) */}
            {outcome && !isTyping && (
              <div className="flex gap-3 mb-3 flex-wrap">
                {Object.entries(outcome.resourceChanges).map(([key, val]) => {
                  if (val === 0) return null;
                  const labels: Record<string, string> = {
                    studentTrust: "신뢰",
                    parentSatisfaction: "학부모",
                    schoolReputation: "평판",
                    teacherEnergy: "에너지",
                  };
                  return (
                    <span
                      key={key}
                      className={`text-xs px-2 py-1 ${val > 0 ? "text-green-400 bg-green-900/30" : "text-red-400 bg-red-900/30"}`}
                      style={{ border: `1px solid ${val > 0 ? "#22c55e33" : "#ef444433"}` }}
                    >
                      {labels[key]} {val > 0 ? `+${val}` : val}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Mentor feedback (when showing outcome) */}
            {outcome && !isTyping && (
              <div className="text-xs text-blue-300 bg-blue-900/20 p-2 mb-3" style={{ border: "1px solid #3b82f633" }}>
                <span className="text-blue-400">멘토 피드백:</span> {outcome.mentorFeedback}
              </div>
            )}

            {/* Choices or Dismiss */}
            {!isTyping && !outcome && (
              <div className="flex flex-col gap-2">
                {event.presetChoices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoice(choice.id);
                    }}
                    disabled={selectedChoice !== null}
                    className={`pixel-button text-left text-sm transition-all ${
                      selectedChoice === choice.id
                        ? "pixel-button-primary"
                        : selectedChoice !== null
                        ? "opacity-40"
                        : ""
                    }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}

            {outcome && !isTyping && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="pixel-button pixel-button-primary self-end text-sm"
              >
                확인
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
