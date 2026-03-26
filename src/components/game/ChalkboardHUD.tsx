"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { CLASS_LEVELS } from "@/types";
import type { Resources } from "@/types";

function getTrend(current: number, previous: number | undefined): { arrow: string; cls: string } {
  if (previous === undefined) return { arrow: "", cls: "" };
  const diff = current - previous;
  if (diff > 0) return { arrow: "↑", cls: "chalk-text-green" };
  if (diff < 0) return { arrow: "↓", cls: "chalk-text-red" };
  return { arrow: "→", cls: "" };
}

function ChalkChanges({ changes }: { changes: Partial<Resources> | null }) {
  const [visible, setVisible] = useState(false);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (changes) {
      setVisible(true);
      setErasing(false);
      const eraseTimer = setTimeout(() => setErasing(true), 2500);
      const hideTimer = setTimeout(() => setVisible(false), 3500);
      return () => { clearTimeout(eraseTimer); clearTimeout(hideTimer); };
    }
  }, [changes]);

  if (!visible || !changes) return null;

  const labels: Record<string, string> = {
    studentTrust: "신뢰", parentSatisfaction: "학부모", schoolReputation: "평판", teacherEnergy: "에너지",
  };

  return (
    <div className={`mt-1 flex gap-3 flex-wrap ${erasing ? "animate-chalk-erase" : "animate-chalk-write"}`}>
      {Object.entries(changes).map(([key, val]) => {
        if (!val || val === 0) return null;
        return (
          <span key={key} className={`text-xs ${val > 0 ? "chalk-text-green" : "chalk-text-red"}`}>
            {labels[key]} {val > 0 ? `+${val}` : val}
          </span>
        );
      })}
    </div>
  );
}

export function ChalkboardHUD() {
  const {
    resources, previousResources, currentWeek, classLevel, tycoonPoints,
    activeEventStudentIds, lastResourceChanges,
  } = useGameStore();

  const levelInfo = CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS];
  const eventCount = activeEventStudentIds.length;

  const bars: { key: keyof Resources; label: string; color: string; cls: string }[] = [
    { key: "studentTrust", label: "신뢰도", color: "rgba(150,255,150,0.7)", cls: "chalk-text-green" },
    { key: "parentSatisfaction", label: "학부모", color: "rgba(150,180,255,0.7)", cls: "chalk-text-blue" },
    { key: "schoolReputation", label: "평판", color: "rgba(200,160,255,0.7)", cls: "chalk-text-purple" },
    { key: "teacherEnergy", label: "에너지", color: "rgba(255,240,150,0.7)", cls: "chalk-text-yellow" },
  ];

  return (
    <div
      className="absolute z-[3] pointer-events-none"
      style={{
        top: "11%",
        left: "36%",
        width: "43%",
        height: "55%",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/* Line 1: Week + Level */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="chalk-text text-sm">
          {currentWeek}주차 <span className="text-xs opacity-60">/ 40</span>
        </span>
        <span className="chalk-text-yellow text-xs">
          {[1, 2, 3, 4, 5].map((lv) => (
            <span key={lv} style={{ opacity: lv <= classLevel ? 1 : 0.25 }}>★</span>
          ))}
          <span className="ml-1 opacity-80">{levelInfo?.name}</span>
        </span>
      </div>

      {/* Resource bars - 4 rows */}
      <div className="flex flex-col gap-1 mb-1.5">
        {bars.map((bar) => {
          const val = resources[bar.key];
          const prev = previousResources?.[bar.key];
          const trend = getTrend(val, prev);
          const isDanger = val <= 25;
          return (
            <div key={bar.key} className="flex items-center gap-1.5">
              {/* Label */}
              <span
                className={`text-[10px] w-8 ${isDanger ? "chalk-text-red animate-resource-flash" : bar.cls}`}
                style={{ minWidth: 32 }}
              >
                {bar.label}
              </span>
              {/* Bar */}
              <div
                className="flex-1 h-[6px] relative"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div
                  className={isDanger ? "animate-resource-flash" : ""}
                  style={{
                    width: `${val}%`,
                    height: "100%",
                    background: isDanger ? "rgba(255,100,100,0.8)" : bar.color,
                    transition: "width 0.5s",
                  }}
                />
              </div>
              {/* Value + trend */}
              <span
                className={`text-[10px] w-7 text-right ${isDanger ? "chalk-text-red animate-resource-flash" : bar.cls}`}
              >
                {val}<span className={trend.cls}>{trend.arrow}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom: Gold + Events */}
      <div className="flex justify-between items-center">
        <span className="chalk-text-yellow text-xs">{tycoonPoints}G</span>
        {eventCount > 0 ? (
          <span className="chalk-text-red text-xs animate-resource-flash">{eventCount}건 발생!</span>
        ) : (
          <span className="chalk-text-green text-[10px] opacity-70">평화로운 교실</span>
        )}
      </div>

      {/* Chalk effect for resource changes */}
      <ChalkChanges changes={lastResourceChanges} />
    </div>
  );
}
