"use client";

import type { StudentProfile } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SeatMapProps {
  students: (StudentProfile & { id: string })[];
  onStudentClick?: (studentId: string) => void;
}

function getEmotionColor(happiness: number, stress: number): string {
  const score = happiness - stress;
  if (score >= 40) return "bg-green-100 border-green-300 text-green-800";
  if (score >= 10) return "bg-emerald-50 border-emerald-200 text-emerald-700";
  if (score >= -10) return "bg-yellow-50 border-yellow-200 text-yellow-700";
  if (score >= -30) return "bg-orange-50 border-orange-200 text-orange-700";
  return "bg-red-100 border-red-300 text-red-800";
}

function getEmotionEmoji(happiness: number, stress: number): string {
  const score = happiness - stress;
  if (score >= 40) return "😊";
  if (score >= 10) return "🙂";
  if (score >= -10) return "😐";
  if (score >= -30) return "😟";
  return "😢";
}

const PERSONALITY_LABELS: Record<string, string> = {
  active: "활발",
  diligent: "성실",
  social: "사교",
  introvert: "내향",
  rebellious: "반항",
};

export default function SeatMap({ students, onStudentClick }: SeatMapProps) {
  // 5열 x 6행 배치
  const rows = 6;
  const cols = 5;

  return (
    <div className="w-full">
      {/* 칠판 */}
      <div className="bg-green-800 text-white text-center py-2 rounded-t-lg text-sm font-medium mb-4">
        칠 판
      </div>

      {/* 좌석 그리드 */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const seatNumber = i + 1;
          const student = students.find((_, idx) => idx === i);

          if (!student) {
            return (
              <div
                key={i}
                className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center text-xs text-muted-foreground"
              >
                {seatNumber}
              </div>
            );
          }

          const emotionColor = getEmotionColor(
            student.emotional.happiness,
            student.emotional.stress
          );
          const emoji = getEmotionEmoji(
            student.emotional.happiness,
            student.emotional.stress
          );

          return (
            <Tooltip key={i}>
              <TooltipTrigger
                onClick={() => onStudentClick?.(student.id)}
                className={`aspect-square rounded-lg border-2 p-1 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md cursor-pointer ${emotionColor}`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-[10px] font-medium truncate w-full text-center">
                  {student.name}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-muted-foreground">
                    {PERSONALITY_LABELS[student.personalityMain]} · {student.academic.overall === "top" ? "상위권" : student.academic.overall === "middle" ? "중위권" : student.academic.overall === "bottom" ? "하위권" : "들쭉날쭉"}
                  </p>
                  {student.flags.length > 0 && (
                    <p className="text-orange-500 text-xs mt-1">
                      {student.flags.join(", ")}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
