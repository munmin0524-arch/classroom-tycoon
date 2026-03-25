"use client";

import type { StudentProfile } from "@/types";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { ExclamationMark } from "@/components/game/ExclamationMark";
import { CHARACTER_DATA } from "@/lib/pixel-art/characters";

interface SeatMapProps {
  students: (StudentProfile & { id: string; seatNumber: number })[];
  activeEventStudentIds: string[];
  onStudentEvent: (studentId: string) => void;
}

export function SeatMap({ students, activeEventStudentIds, onStudentEvent }: SeatMapProps) {
  const cols = 5;
  const rows = 3;

  return (
    <div
      className="absolute"
      style={{
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -30%)",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "24px 32px",
      }}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const seatNumber = i + 1;
        const student = students.find((s) => s.seatNumber === seatNumber);
        const hasEvent = student && activeEventStudentIds.includes(student.id);
        const charData = student ? CHARACTER_DATA[student.id] : null;

        return (
          <div
            key={seatNumber}
            data-seat={seatNumber}
            className="relative flex flex-col items-center"
            style={{ width: 80, minHeight: 100 }}
          >
            {/* Desk */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: 24,
                background: "var(--classroom-desk)",
                border: "2px solid rgba(0,0,0,0.3)",
                borderTop: "3px solid rgba(255,255,255,0.1)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            />

            {/* Student character */}
            {student && charData && (
              <div className="relative mb-6">
                {/* Exclamation mark */}
                {hasEvent && (
                  <ExclamationMark onClick={() => onStudentEvent(student.id)} />
                )}

                <PixelCharacter
                  studentId={student.id}
                  happiness={student.emotional.happiness}
                  stress={student.emotional.stress}
                  scale={3}
                />

                {/* Name tag */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] px-1 pixel-text"
                  style={{
                    color: "#ddd",
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {student.name}
                </div>
              </div>
            )}

            {/* Empty desk */}
            {!student && (
              <div style={{ width: 36, height: 48 }} />
            )}
          </div>
        );
      })}

      {/* Teacher's desk (teacher is now a separate movable component) */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2"
        style={{
          width: 120,
          height: 30,
          background: "color-mix(in srgb, var(--classroom-desk) 80%, white)",
          border: "3px solid rgba(0,0,0,0.3)",
          borderTop: "3px solid rgba(255,255,255,0.15)",
          boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}
