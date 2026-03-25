"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { generateTeacherShadow } from "@/lib/pixel-art/characters";

const SPEED = 150; // pixels per second
const teacherShadow = generateTeacherShadow();

export function TeacherCharacter() {
  const {
    teacherPos, teacherTarget, teacherMoving,
    updateTeacherPos, setTeacherArrived,
  } = useGameStore();

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((time: number) => {
    const state = useGameStore.getState();
    if (!state.teacherTarget || !state.teacherMoving) {
      animRef.current = null;
      return;
    }

    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    const dx = state.teacherTarget.x - state.teacherPos.x;
    const dy = state.teacherTarget.y - state.teacherPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1) {
      updateTeacherPos(state.teacherTarget.x, state.teacherTarget.y);
      setTeacherArrived();
      lastTimeRef.current = 0;
      animRef.current = null;
      return;
    }

    const move = Math.min(SPEED * dt, dist);
    const nx = state.teacherPos.x + (dx / dist) * move;
    const ny = state.teacherPos.y + (dy / dist) * move;
    updateTeacherPos(nx, ny);

    animRef.current = requestAnimationFrame(animate);
  }, [updateTeacherPos, setTeacherArrived]);

  useEffect(() => {
    if (teacherMoving && teacherTarget && !animRef.current) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [teacherMoving, teacherTarget, animate]);

  // Flip direction based on movement
  const facingLeft = teacherTarget ? teacherTarget.x < teacherPos.x : false;

  return (
    <div
      className={`absolute z-[5] pointer-events-none ${teacherMoving ? "animate-teacher-walk" : ""}`}
      style={{
        left: `${teacherPos.x}px`,
        top: `${teacherPos.y}px`,
        transform: `translate(-50%, -100%) ${facingLeft ? "scaleX(-1)" : ""}`,
        transition: teacherMoving ? "none" : "left 0.1s, top 0.1s",
      }}
    >
      {/* Teacher pixel sprite */}
      <div className="pixel-art" style={{ width: 14 * 3, height: 20 * 3 }}>
        <div
          style={{
            width: 1,
            height: 1,
            boxShadow: teacherShadow,
            transform: "scale(3)",
            transformOrigin: "top left",
          }}
        />
      </div>
      {/* Label */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] px-1 chalk-text-yellow"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        선생님
      </div>
    </div>
  );
}

/** Invisible click area for the floor to move teacher */
export function FloorClickArea() {
  const { moveTeacher, showDialog, zoomPhase, phoneOpen } = useGameStore();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showDialog || zoomPhase !== "idle" || phoneOpen) return;
    const x = e.clientX;
    const y = e.clientY;
    // Clamp to floor area (no walking through walls)
    const w = window.innerWidth;
    const h = window.innerHeight;
    const clampedX = Math.max(w * 0.08, Math.min(w * 0.88, x));
    const clampedY = Math.max(h * 0.42, Math.min(h * 0.92, y));
    moveTeacher(clampedX, clampedY);
  };

  return (
    <div
      className="absolute z-[15] cursor-crosshair"
      onClick={handleClick}
      style={{ left: 0, right: 0, top: "40%", bottom: 0 }}
    />
  );
}
