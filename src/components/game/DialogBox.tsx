"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PixelPortrait } from "@/components/pixel/PixelPortrait";
import { CHARACTER_DATA } from "@/lib/pixel-art/characters";
import { MentorFeedback } from "./MentorCharacter";
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
  const [showComicIntro, setShowComicIntro] = useState(!outcome);
  const [comicPhase, setComicPhase] = useState(0); // 0=panels, 1=choice, 2=outcome

  const fullText = outcome ? outcome.narrative : event.description;
  const charData = CHARACTER_DATA[studentId];

  // When switching to outcome, reset typewriter
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
    }, 25);
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

  // Resource change labels
  const resourceLabels: Record<string, string> = {
    studentTrust: "신뢰",
    parentSatisfaction: "학부모",
    schoolReputation: "평판",
    teacherEnergy: "에너지",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-end justify-center pb-4"
        style={{ background: "rgba(0,0,0,0.4)", pointerEvents: "auto" }}
      >
        {/* Main dialog container - full width comic style */}
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-[92%] max-w-[950px]"
          onClick={skipTypewriter}
        >
          {/* Comic-style border frame */}
          <div
            className="relative"
            style={{
              background: "rgba(10, 10, 30, 0.97)",
              border: "3px solid #fff",
              boxShadow: `
                0 0 0 1px #000,
                0 0 0 5px #333,
                0 -4px 30px rgba(0,0,0,0.5),
                inset 0 0 0 1px rgba(255,255,255,0.08)
              `,
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-1"
              style={{
                background: `linear-gradient(90deg,
                  ${event.severity >= 4 ? "#ef4444" : event.severity >= 2 ? "#eab308" : "#22c55e"} 0%,
                  transparent 100%
                )`,
              }}
            />

            <div className="p-5">
              {/* Header: portrait + title + severity */}
              <div className="flex items-start gap-4 mb-4">
                {/* Portrait with comic-style frame */}
                <div className="flex-shrink-0 relative">
                  <div
                    className="p-1"
                    style={{ border: "2px solid #fff", boxShadow: "2px 2px 0 #000" }}
                  >
                    <PixelPortrait
                      studentId={studentId}
                      happiness={happiness}
                      stress={stress}
                      scale={3}
                    />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-gray-300 pixel-text">
                      {charData?.name ?? "???"}
                    </span>
                  </div>
                </div>

                {/* Title area */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-400 text-base">{"★".repeat(event.severity)}</span>
                    <span className="text-yellow-300 text-base pixel-text">{event.title}</span>
                  </div>

                  {/* Narrative text area with comic-style inner border */}
                  <div
                    className="p-3 min-h-[80px]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderLeft: "3px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <div className="text-white text-sm leading-relaxed">
                      {displayedText}
                      {isTyping && <span className="animate-cursor-blink ml-0.5 text-yellow-300">▌</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource changes (outcome phase) */}
              {outcome && !isTyping && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-3 mb-4 flex-wrap"
                >
                  {Object.entries(outcome.resourceChanges).map(([key, val]) => {
                    if (val === 0) return null;
                    return (
                      <motion.span
                        key={key}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-sm px-3 py-1.5 font-bold ${val > 0 ? "text-green-400 bg-green-900/30" : "text-red-400 bg-red-900/30"}`}
                        style={{ border: `2px solid ${val > 0 ? "#22c55e44" : "#ef444444"}` }}
                      >
                        {resourceLabels[key]} {val > 0 ? `+${val}` : val}
                      </motion.span>
                    );
                  })}
                </motion.div>
              )}

              {/* Mentor feedback (outcome phase) */}
              {outcome && !isTyping && outcome.mentorFeedback && (
                <div className="mb-4">
                  <MentorFeedback feedback={outcome.mentorFeedback} />
                </div>
              )}

              {/* Choice cards (decision phase) */}
              {!isTyping && !outcome && (
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {event.presetChoices.map((choice, i) => (
                    <motion.button
                      key={choice.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChoice(choice.id);
                      }}
                      disabled={selectedChoice !== null}
                      className={`text-left p-3 transition-all ${
                        selectedChoice === choice.id
                          ? "ring-2 ring-yellow-400"
                          : selectedChoice !== null
                          ? "opacity-30"
                          : "hover:bg-white/5"
                      }`}
                      style={{
                        background: selectedChoice === choice.id ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.03)",
                        border: `2px solid ${selectedChoice === choice.id ? "#eab308" : "#333"}`,
                      }}
                    >
                      <div className="text-sm text-white leading-relaxed">{choice.text}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{choice.approach}</div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Dismiss button (outcome phase) */}
              {outcome && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-end mt-4"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss();
                    }}
                    className="pixel-button pixel-button-primary text-sm px-8 py-2"
                  >
                    확인
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
