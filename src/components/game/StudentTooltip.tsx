"use client";

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { getEmotion } from "@/lib/pixel-art/characters";

const PROXIMITY = 80; // pixels

/** Checks teacher proximity to students and shows tooltip */
export function StudentProximityChecker() {
  const { teacherPos, teacherMoving, students, activeEventStudentIds, setNearbyStudent } = useGameStore();

  useEffect(() => {
    if (teacherMoving) return;

    // Check proximity to each student seat
    // Seats are positioned in a 5x3 grid, we need approximate positions
    // The SeatMap is centered at ~50%, 45% with gaps
    const seatMapLeft = window.innerWidth * 0.5 - (5 * 112) / 2;
    const seatMapTop = window.innerHeight * 0.45 - (3 * 124) * 0.3;

    let closestId: string | null = null;
    let closestDist = PROXIMITY;

    for (const student of students) {
      const col = (student.seatNumber - 1) % 5;
      const row = Math.floor((student.seatNumber - 1) / 5);
      const sx = seatMapLeft + col * 112 + 40;
      const sy = seatMapTop + row * 124 + 50;

      const dx = teacherPos.x - sx;
      const dy = teacherPos.y - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestDist = dist;
        closestId = student.id;
      }
    }

    setNearbyStudent(closestId);
  }, [teacherPos, teacherMoving, students, setNearbyStudent]);

  return null;
}

export function StudentTooltip() {
  const { nearbyStudentId, students, activeEventStudentIds } = useGameStore();

  if (!nearbyStudentId) return null;

  const student = students.find((s) => s.id === nearbyStudentId);
  if (!student) return null;

  const emotion = getEmotion(student.emotional.happiness, student.emotional.stress);
  const emotionLabel = emotion === "happy" ? "좋음" : emotion === "neutral" ? "보통" : emotion === "worried" ? "불안" : "나쁨";
  const hasEvent = activeEventStudentIds.includes(student.id);

  // Calculate tooltip position based on seat
  const col = (student.seatNumber - 1) % 5;
  const row = Math.floor((student.seatNumber - 1) / 5);

  return (
    <div
      className="fixed z-[8] animate-fade-in pointer-events-none"
      style={{
        left: `calc(50% - ${(5 * 112) / 2 - col * 112 - 40}px)`,
        top: `calc(45% - ${(3 * 124) * 0.3 - row * 124 - 10}px)`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div
        className="px-3 py-2 text-center"
        style={{
          background: hasEvent ? "rgba(180, 40, 40, 0.92)" : "rgba(10, 10, 30, 0.92)",
          border: `2px solid ${hasEvent ? "#ff6666" : "#555"}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <div className="text-xs text-white pixel-text">{student.name}</div>
        <div className="text-[9px] text-gray-300 mt-0.5">
          행복 {student.emotional.happiness} | {emotionLabel}
        </div>
        {hasEvent && (
          <div className="text-[9px] text-yellow-300 mt-1 animate-resource-flash">
            이벤트 발생 중!
          </div>
        )}
      </div>
      {/* Tail */}
      <div className="flex justify-center">
        <div style={{
          width: 0, height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `6px solid ${hasEvent ? "#ff6666" : "#555"}`,
        }} />
      </div>
    </div>
  );
}
