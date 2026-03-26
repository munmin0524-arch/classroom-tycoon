"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PixelPortrait } from "@/components/pixel/PixelPortrait";
import { CHARACTER_DATA } from "@/lib/pixel-art/characters";
import type { MockEvent } from "@/lib/mock/events";

interface ComicPanelProps {
  event: MockEvent;
  studentId: string;
  happiness?: number;
  stress?: number;
  onPanelsComplete: () => void;
}

/**
 * Comic-style event introduction with 2-3 panels
 * that appear sequentially like a manga/comic strip
 */
export function ComicPanel({ event, studentId, happiness = 50, stress = 30, onPanelsComplete }: ComicPanelProps) {
  const [visiblePanels, setVisiblePanels] = useState(0);
  const charData = CHARACTER_DATA[studentId];

  // Break description into panels
  const sentences = event.description.split(/[.!?。]\s*/).filter(Boolean);
  const panels = [
    { text: sentences[0] || event.description, type: "scene" as const },
    { text: sentences[1] || event.title, type: "dialogue" as const },
    { text: sentences.slice(2).join(". ") || "...", type: "tension" as const },
  ].filter((p) => p.text.trim().length > 0);

  // Sequentially reveal panels
  useEffect(() => {
    if (visiblePanels < panels.length) {
      const timer = setTimeout(() => setVisiblePanels((v) => v + 1), 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onPanelsComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [visiblePanels, panels.length, onPanelsComplete]);

  const handleSkip = () => {
    setVisiblePanels(panels.length);
    onPanelsComplete();
  };

  return (
    <div className="absolute inset-0 z-[52] flex items-center justify-center" onClick={handleSkip}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)" }}
      />

      {/* Comic strip container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-[85%] max-w-[900px]"
      >
        {/* Event title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-4"
        >
          <span className="text-red-400 text-lg">{"★".repeat(event.severity)}</span>
          <span className="text-yellow-300 pixel-text text-xl ml-3">{event.title}</span>
        </motion.div>

        {/* Comic panels */}
        <div className={`grid ${panels.length >= 3 ? "grid-cols-3" : panels.length === 2 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
          <AnimatePresence>
            {panels.slice(0, visiblePanels).map((panel, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
                style={{
                  background: "rgba(13, 13, 26, 0.95)",
                  border: "3px solid #fff",
                  boxShadow: "4px 4px 0 #000, inset 0 0 0 1px rgba(255,255,255,0.1)",
                  minHeight: 200,
                }}
              >
                {/* Panel number */}
                <div
                  className="absolute -top-2 -left-2 w-7 h-7 flex items-center justify-center text-xs pixel-text text-black font-bold"
                  style={{ background: "#eab308", border: "2px solid #000" }}
                >
                  {i + 1}
                </div>

                {/* Panel content */}
                <div className="p-4 pt-6 h-full flex flex-col">
                  {/* Character portrait in first panel */}
                  {i === 0 && (
                    <div className="flex items-center gap-3 mb-3">
                      <PixelPortrait studentId={studentId} happiness={happiness} stress={stress} scale={2.5} />
                      <div>
                        <div className="text-sm text-white pixel-text">{charData?.name || "???"}</div>
                        <div className="text-[10px] text-gray-500">{event.eventType}</div>
                      </div>
                    </div>
                  )}

                  {/* Speech bubble / narrative */}
                  <div
                    className="flex-1 relative p-3"
                    style={{
                      background: panel.type === "dialogue" ? "rgba(255,255,255,0.08)" : "transparent",
                      border: panel.type === "dialogue" ? "2px solid rgba(255,255,255,0.15)" : "none",
                      borderRadius: panel.type === "dialogue" ? "12px 12px 12px 2px" : 0,
                    }}
                  >
                    <div className={`text-sm leading-relaxed ${
                      panel.type === "tension" ? "text-red-200" : "text-gray-200"
                    }`}>
                      {panel.text}
                    </div>
                  </div>

                  {/* Speed lines for tension panels */}
                  {panel.type === "tension" && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(6)].map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: "-100%", opacity: [0, 0.3, 0] }}
                          transition={{ duration: 0.8, delay: j * 0.1, repeat: 0 }}
                          className="absolute h-px bg-white/20"
                          style={{ top: `${20 + j * 12}%` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Skip hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="text-center mt-4 text-xs text-gray-500"
        >
          클릭하여 건너뛰기
        </motion.div>
      </motion.div>
    </div>
  );
}
