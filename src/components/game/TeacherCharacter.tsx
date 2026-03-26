"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { generateTeacherShadow } from "@/lib/pixel-art/characters";

const SPEED = 150; // pixels per second
const PATROL_INTERVAL_MIN = 3000;
const PATROL_INTERVAL_MAX = 6000;
const teacherShadow = generateTeacherShadow();

/** Generate a random patrol target within floor bounds */
function getRandomPatrolTarget() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  return {
    x: Math.max(w * 0.08, Math.min(w * 0.88, w * (0.15 + Math.random() * 0.70))),
    y: Math.max(h * 0.42, Math.min(h * 0.92, h * (0.45 + Math.random() * 0.43))),
  };
}

export function TeacherCharacter() {
  const {
    teacherPos, teacherTarget, teacherMoving,
    updateTeacherPos, setTeacherArrived, moveTeacher,
  } = useGameStore();

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const patrolTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Click/auto movement animation ──
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

  // ── Auto-patrol ──
  useEffect(() => {
    function schedulePatrol() {
      const delay = PATROL_INTERVAL_MIN + Math.random() * (PATROL_INTERVAL_MAX - PATROL_INTERVAL_MIN);
      patrolTimerRef.current = setTimeout(() => {
        const state = useGameStore.getState();
        if (
          state.teacherAutoMove &&
          !state.teacherMoving &&
          !state.showDialog &&
          state.zoomPhase === "idle" &&
          state.status === "active" &&
          !state.isTransitioning &&
          !state.phonePopupApp
        ) {
          const target = getRandomPatrolTarget();
          moveTeacher(target.x, target.y);
        }
        schedulePatrol();
      }, delay);
    }

    schedulePatrol();
    return () => {
      if (patrolTimerRef.current) clearTimeout(patrolTimerRef.current);
    };
  }, [moveTeacher]);

  // ── Fix initial position ──
  useEffect(() => {
    if (teacherPos.x === -1 && teacherPos.y === -1) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      updateTeacherPos(w * 0.5, h * 0.48);
    }
  }, [teacherPos.x, teacherPos.y, updateTeacherPos]);

  // Direction for sprite flip
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
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] px-1 chalk-text-yellow"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        선생님
      </div>
    </div>
  );
}
