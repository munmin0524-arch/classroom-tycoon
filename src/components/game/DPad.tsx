"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";

const STEP = 20; // pixels per tick
const HOLD_INTERVAL = 50; // ms between ticks when holding

type Direction = "up" | "down" | "left" | "right";

function clampToFloor(x: number, y: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: Math.max(w * 0.08, Math.min(w * 0.88, x)),
    y: Math.max(h * 0.42, Math.min(h * 0.92, y)),
  };
}

export function DPad() {
  const { showDialog, zoomPhase, status, isTransitioning } = useGameStore();
  const [activeKeys, setActiveKeys] = useState<Set<Direction>>(new Set());
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const disabled = showDialog || zoomPhase !== "idle" || status !== "active" || isTransitioning;

  const moveDir = useCallback((dir: Direction) => {
    if (disabled) return;
    const state = useGameStore.getState();
    let { x, y } = state.teacherPos;

    if (dir === "up") y -= STEP;
    if (dir === "down") y += STEP;
    if (dir === "left") x -= STEP;
    if (dir === "right") x += STEP;

    const clamped = clampToFloor(x, y);

    // Stop any ongoing auto/click movement
    useGameStore.setState({
      teacherPos: clamped,
      teacherMoving: false,
      teacherTarget: null,
      teacherAutoMove: false,
    });
  }, [disabled]);

  // Re-enable auto-move after inactivity
  const autoMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleAutoResume = useCallback(() => {
    if (autoMoveTimerRef.current) clearTimeout(autoMoveTimerRef.current);
    autoMoveTimerRef.current = setTimeout(() => {
      useGameStore.setState({ teacherAutoMove: true });
    }, 2000);
  }, []);

  // D-Pad button hold (mouse/touch)
  const startHold = useCallback((dir: Direction) => {
    moveDir(dir);
    holdRef.current = setInterval(() => moveDir(dir), HOLD_INTERVAL);
  }, [moveDir]);

  const stopHold = useCallback(() => {
    if (holdRef.current) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
    scheduleAutoResume();
  }, [scheduleAutoResume]);

  // Keyboard listener for visual feedback + movement
  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (!dir) return;
      e.preventDefault();

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(dir);
        return next;
      });

      const state = useGameStore.getState();
      if (state.showDialog || state.zoomPhase !== "idle" || state.status !== "active" || state.isTransitioning) return;

      let { x, y } = state.teacherPos;
      if (dir === "up") y -= STEP;
      if (dir === "down") y += STEP;
      if (dir === "left") x -= STEP;
      if (dir === "right") x += STEP;

      const clamped = clampToFloor(x, y);
      useGameStore.setState({
        teacherPos: clamped,
        teacherMoving: false,
        teacherTarget: null,
        teacherAutoMove: false,
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (!dir) return;
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(dir);
        return next;
      });
      scheduleAutoResume();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [scheduleAutoResume]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (holdRef.current) clearInterval(holdRef.current);
      if (autoMoveTimerRef.current) clearTimeout(autoMoveTimerRef.current);
    };
  }, []);

  const btnClass = (dir: Direction) => {
    const isActive = activeKeys.has(dir);
    return `flex items-center justify-center select-none cursor-pointer transition-all ${
      isActive ? "brightness-150 scale-110" : "hover:brightness-125"
    } ${disabled ? "opacity-30 pointer-events-none" : ""}`;
  };

  const btnStyle = (active: boolean) => ({
    width: 36,
    height: 36,
    background: active ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.08)",
    border: `2px solid ${active ? "#eab308" : "rgba(255,255,255,0.15)"}`,
    color: active ? "#eab308" : "rgba(255,255,255,0.5)",
    fontSize: 14,
    imageRendering: "pixelated" as const,
  });

  return (
    <div className="fixed z-[18] select-none" style={{ left: 20, bottom: 20 }}>
      {/* D-Pad grid */}
      <div className="grid grid-cols-3 gap-0.5" style={{ width: 112, height: 112 }}>
        {/* Row 1: empty, up, empty */}
        <div />
        <div
          className={btnClass("up")}
          style={btnStyle(activeKeys.has("up"))}
          onMouseDown={() => startHold("up")}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold("up")}
          onTouchEnd={stopHold}
        >
          ▲
        </div>
        <div />

        {/* Row 2: left, center, right */}
        <div
          className={btnClass("left")}
          style={btnStyle(activeKeys.has("left"))}
          onMouseDown={() => startHold("left")}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold("left")}
          onTouchEnd={stopHold}
        >
          ◀
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-[8px] text-gray-600 pixel-text">이동</span>
        </div>
        <div
          className={btnClass("right")}
          style={btnStyle(activeKeys.has("right"))}
          onMouseDown={() => startHold("right")}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold("right")}
          onTouchEnd={stopHold}
        >
          ▶
        </div>

        {/* Row 3: empty, down, empty */}
        <div />
        <div
          className={btnClass("down")}
          style={btnStyle(activeKeys.has("down"))}
          onMouseDown={() => startHold("down")}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold("down")}
          onTouchEnd={stopHold}
        >
          ▼
        </div>
        <div />
      </div>

      {/* Hint text */}
      <div className="text-center mt-1.5">
        <span className="text-[8px] text-gray-600 pixel-text">← → ↑ ↓ 키보드</span>
      </div>
    </div>
  );
}
