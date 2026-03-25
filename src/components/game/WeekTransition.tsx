"use client";

import { AnimatePresence, motion } from "motion/react";

interface WeekTransitionProps {
  fromWeek: number;
  toWeek: number;
  isActive: boolean;
  onComplete: () => void;
}

export function WeekTransition({ fromWeek, toWeek, isActive, onComplete }: WeekTransitionProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#000" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={(definition) => {
            // After entrance animation, wait and then trigger exit
            if (definition === "animate" || (typeof definition === "object" && "opacity" in definition)) {
              setTimeout(onComplete, 800);
            }
          }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-white/60 text-lg pixel-text"
            >
              {fromWeek}주차
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-2xl pixel-text"
              style={{
                color: "#ffffff",
                textShadow: "0 0 10px rgba(100, 200, 255, 0.5), 0 0 20px rgba(100, 200, 255, 0.3)",
              }}
            >
              {toWeek}주차
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
