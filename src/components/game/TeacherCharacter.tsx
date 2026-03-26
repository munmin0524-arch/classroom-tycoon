"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { generateTeacherShadow } from "@/lib/pixel-art/characters";

const SPEED = 150; // pixels per second
const KEYBOARD_STEP = 8; // pixels per frame for smooth keyboard movement
const PATROL_INTERVAL_MIN = 3000;
const PATROL_INTERVAL_MAX = 6000;
const teacherShadow = generateTeacherShadow();

/** Get floor bounds in pixels */
function getFloorBounds() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  return {
    minX: w * 0.08,
    maxX: w * 0.88,
    minY: h * 0.42,
    maxY: h * 0.92,
  };
}

/** Clamp position to floor bounds */
function clampToFloor(x: number, y: number) {
  const b = getFloorBounds();
  return {
    x: Math.max(b.minX, Math.min(b.maxX, x)),
    y: Math.max(b.minY, Math.min(b.maxY, y)),
  };
}

/** Generate a random patrol target */
function getRandomPatrolTarget() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  return clampToFloor(
    w * (0.15 + Math.random() * 0.70),
    h * (0.45 + Math.random() * 0.43),
  );
}

export function TeacherCharacter() {
  const {
    teacherPos, teacherTarget, teacherMoving,
    showDialog, zoomPhase, status,
    updateTeacherPos, setTeacherArrived, moveTeacher,
  } = useGameStore();

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const patrolTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const keyAnimRef = useRef<number | null>(null);

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
          !state.phonePopupApp &&
          keysRef.current.size === 0
        ) {
          const target = getRandomPatrolTarget();
          // Use moveTeacher which handles everything properly
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

  // ── Keyboard movement (arrow keys) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

      const state = useGameStore.getState();
      if (state.showDialog || state.zoomPhase !== "idle" || state.status !== "active" || state.isTransitioning) return;

      e.preventDefault();
      keysRef.current.add(e.key);

      // Stop any ongoing click-based movement
      if (state.teacherMoving) {
        useGameStore.setState({ teacherMoving: false, teacherTarget: null, teacherAutoMove: false });
        if (animRef.current) {
          cancelAnimationFrame(animRef.current);
          animRef.current = null;
        }
      }

      // Start keyboard animation loop if not running
      if (!keyAnimRef.current) {
        const keyAnimate = () => {
          const keys = keysRef.current;
          if (keys.size === 0) {
            keyAnimRef.current = null;
            // Re-enable auto-move after keyboard stops
            setTimeout(() => {
              useGameStore.setState({ teacherAutoMove: true });
            }, 2000);
            return;
          }

          const st = useGameStore.getState();
          let nx = st.teacherPos.x;
          let ny = st.teacherPos.y;

          if (keys.has("ArrowLeft")) nx -= KEYBOARD_STEP;
          if (keys.has("ArrowRight")) nx += KEYBOARD_STEP;
          if (keys.has("ArrowUp")) ny -= KEYBOARD_STEP;
          if (keys.has("ArrowDown")) ny += KEYBOARD_STEP;

          const clamped = clampToFloor(nx, ny);
          useGameStore.getState().updateTeacherPos(clamped.x, clamped.y);

          keyAnimRef.current = requestAnimationFrame(keyAnimate);
        };
        keyAnimRef.current = requestAnimationFrame(keyAnimate);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (keyAnimRef.current) cancelAnimationFrame(keyAnimRef.current);
    };
  }, []);

  // ── Fix initial position ──
  useEffect(() => {
    if (teacherPos.x === -1 && teacherPos.y === -1) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      updateTeacherPos(w * 0.5, h * 0.48);
    }
  }, [teacherPos.x, teacherPos.y, updateTeacherPos]);

  // Direction for sprite flip
  const facingLeft = teacherTarget ? teacherTarget.x < teacherPos.x :
    keysRef.current.has("ArrowLeft");
  const isMoving = teacherMoving || keysRef.current.size > 0;

  return (
    <div
      className={`absolute z-[5] pointer-events-none ${isMoving ? "animate-teacher-walk" : ""}`}
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

/** Invisible click area for the floor to move teacher */
export function FloorClickArea() {
  const { moveTeacher, showDialog, zoomPhase, phoneOpen } = useGameStore();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showDialog || zoomPhase !== "idle" || phoneOpen) return;
    moveTeacher(e.clientX, e.clientY);
  };

  return (
    <div
      className="absolute z-[15] cursor-crosshair"
      onClick={handleClick}
      style={{ left: 0, right: 0, top: "40%", bottom: 0 }}
    />
  );
}
