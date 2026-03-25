"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface FloatingWidgetProps {
  position: "top-left" | "top-right";
  icon: ReactNode;
  label: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function FloatingWidget({
  position,
  icon,
  label,
  children,
  defaultExpanded = false,
}: FloatingWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-30`}
      style={{ pointerEvents: "auto" }}
    >
      {/* Collapsed state - icon button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="pixel-button flex items-center gap-2 text-sm"
        style={{
          background: expanded ? "rgba(20, 20, 50, 0.95)" : "rgba(10, 10, 30, 0.85)",
          minWidth: expanded ? "auto" : "auto",
        }}
      >
        <span>{icon}</span>
        <span className="pixel-text text-xs">{label}</span>
        <span className="text-[10px] text-gray-500">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-1 pixel-border overflow-hidden"
            style={{
              background: "rgba(10, 10, 30, 0.95)",
              minWidth: 200,
            }}
          >
            <div className="p-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
