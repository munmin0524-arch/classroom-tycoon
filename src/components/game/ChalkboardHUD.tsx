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

interface ChalkChangeProps {
  changes: Partial<Resources> | null;
}

function ChalkChanges({ changes }: ChalkChangeProps) {
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
          <span key={key} className={`text-[10px] ${val > 0 ? "chalk-text-green" : "chalk-text-red"}`}>
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

  const bars: { key: keyof Resources; label: string; cls: string }[] = [
    { key: "studentTrust", label: "신뢰", cls: "chalk-text-green" },
    { key: "parentSatisfaction", label: "학부모", cls: "chalk-text-blue" },
    { key: "schoolReputation", label: "평판", cls: "chalk-text-purple" },
    { key: "teacherEnergy", label: "에너지", cls: "chalk-text-yellow" },
  ];

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        top: "12%",
        left: "37%",
        width: "42%",
        height: "58%",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/* Line 1: Week + Level */}
      <div className="flex justify-between items-center mb-1">
        <span className="chalk-text text-[11px]">
          {currentWeek}주차 <span className="text-[9px] opacity-60">/ 40</span>
        </span>
        <span className="chalk-text-yellow text-[10px]">
          {[1, 2, 3, 4, 5].map((lv) => (
            <span key={lv} style={{ opacity: lv <= classLevel ? 1 : 0.25 }}>★</span>
          ))}
          <span className="ml-1 text-[9px] opacity-80">{levelInfo?.name}</span>
        </span>
      </div>

      {/* Line 2: Resources with trends */}
      <div className="flex gap-3 flex-wrap mb-1">
        {bars.map((bar) => {
          const val = resources[bar.key];
          const prev = previousResources?.[bar.key];
          const trend = getTrend(val, prev);
          const isDanger = val <= 25;
          return (
            <span
              key={bar.key}
              className={`text-[10px] ${isDanger ? "chalk-text-red animate-resource-flash" : bar.cls}`}
            >
              {bar.label}
              <span className={trend.cls}>{trend.arrow}</span>
              {val}
            </span>
          );
        })}
      </div>

      {/* Line 3: TP + Events */}
      <div className="flex justify-between items-center">
        <span className="chalk-text-yellow text-[10px]">{tycoonPoints}TP</span>
        {eventCount > 0 ? (
          <span className="chalk-text-red text-[10px] animate-resource-flash">
            {eventCount}건 발생!
          </span>
        ) : (
          <span className="chalk-text-green text-[9px] opacity-70">평화로운 교실</span>
        )}
      </div>

      {/* Chalk effect for resource changes */}
      <ChalkChanges changes={lastResourceChanges} />
    </div>
  );
}
