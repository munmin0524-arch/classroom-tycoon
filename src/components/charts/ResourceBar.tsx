"use client";

import { Progress } from "@/components/ui/progress";
import type { Resources } from "@/types";

interface ResourceBarProps {
  resources: Resources;
}

const RESOURCE_CONFIG = [
  { key: "studentTrust" as const, label: "학생 신뢰도", emoji: "💛", dangerThreshold: 20 },
  { key: "parentSatisfaction" as const, label: "학부모 만족도", emoji: "👨‍👩‍👧", dangerThreshold: 10 },
  { key: "schoolReputation" as const, label: "학교 평판", emoji: "🏫", dangerThreshold: 0 },
  { key: "teacherEnergy" as const, label: "교사 에너지", emoji: "🔋", dangerThreshold: 0 },
];

function getBarColor(value: number, dangerThreshold: number): string {
  if (value <= dangerThreshold) return "[&>div]:bg-red-500";
  if (value <= dangerThreshold + 20) return "[&>div]:bg-orange-400";
  if (value >= 80) return "[&>div]:bg-green-500";
  return "[&>div]:bg-blue-500";
}

export default function ResourceBar({ resources }: ResourceBarProps) {
  return (
    <div className="space-y-3">
      {RESOURCE_CONFIG.map(({ key, label, emoji, dangerThreshold }) => {
        const value = resources[key];
        const colorClass = getBarColor(value, dangerThreshold);
        const isDanger = value <= dangerThreshold && dangerThreshold > 0;

        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium ${isDanger ? "text-red-500 animate-pulse" : ""}`}>
                {emoji} {label}
              </span>
              <span className={`text-sm tabular-nums ${isDanger ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                {value}
              </span>
            </div>
            <Progress value={value} className={`h-2 ${colorClass}`} />
          </div>
        );
      })}
    </div>
  );
}
