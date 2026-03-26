"use client";

import { useGameStore } from "@/stores/gameStore";

const RESOURCE_BARS = [
  { key: "studentTrust", label: "학생 신뢰도", color: "#22c55e", desc: "학생들이 교사를 신뢰하는 정도" },
  { key: "parentSatisfaction", label: "학부모 만족도", color: "#3b82f6", desc: "학부모의 학교/교사 만족도" },
  { key: "schoolReputation", label: "학교 평판", color: "#a855f7", desc: "학교 관리자가 보는 교사 평가" },
  { key: "teacherEnergy", label: "교사 에너지", color: "#eab308", desc: "교사의 체력과 정신력" },
] as const;

function ResourceBar({ label, value, color, desc, large = false }: { label: string; value: number; color: string; desc: string; large?: boolean }) {
  const isDanger = value <= 25;
  const isWarning = value <= 40 && value > 25;
  const barH = large ? "h-6" : "h-4";
  const labelSize = large ? "text-sm" : "text-xs";
  const valueSize = large ? "text-lg font-bold" : "text-sm font-bold";
  const descSize = large ? "text-xs" : "text-[9px]";

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className={`${labelSize} text-gray-300`}>{label}</span>
        <span className={`${valueSize} ${isDanger ? "text-red-400 animate-resource-flash" : isWarning ? "text-orange-400" : "text-white"}`}>
          {value}
        </span>
      </div>
      <div className={`${barH} bg-gray-800`} style={{ border: "1px solid #333" }}>
        <div
          className={isDanger ? "animate-resource-flash" : ""}
          style={{
            width: `${value}%`,
            height: "100%",
            background: isDanger ? "#ef4444" : color,
            transition: "width 0.5s",
          }}
        />
      </div>
      <div className={`${descSize} text-gray-600 mt-0.5`}>{desc}</div>
      {isDanger && (
        <div className={`${descSize} text-red-400 mt-0.5`}>위험! 0 이하 시 게임 오버</div>
      )}
    </div>
  );
}

/** Small phone version */
export function ResourceDetail() {
  const { resources, setPhoneApp } = useGameStore();

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">자원 현황</span>
      </div>
      <div className="p-3 space-y-4">
        {RESOURCE_BARS.map((bar) => (
          <ResourceBar key={bar.key} label={bar.label} value={resources[bar.key]} color={bar.color} desc={bar.desc} />
        ))}
      </div>
    </div>
  );
}

/** Large popup version with history chart */
export function ResourceDetailPopup() {
  const { resources, resourceHistory } = useGameStore();

  return (
    <div className="space-y-6">
      {/* Large resource bars */}
      <div className="grid grid-cols-2 gap-6">
        {RESOURCE_BARS.map((bar) => (
          <ResourceBar key={bar.key} label={bar.label} value={resources[bar.key]} color={bar.color} desc={bar.desc} large />
        ))}
      </div>

      {/* Mini chart - resource trend */}
      {resourceHistory.length > 1 && (
        <div>
          <div className="text-sm text-yellow-300 pixel-text mb-3">주차별 자원 추이</div>
          <div className="relative h-40 flex items-end gap-0.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #222" }}>
            {/* Y-axis labels */}
            <div className="absolute left-1 top-1 text-[8px] text-gray-600">100</div>
            <div className="absolute left-1 bottom-1 text-[8px] text-gray-600">0</div>
            {/* Bars for each week */}
            <div className="flex-1 flex items-end gap-0.5 px-6 pb-1 pt-4 h-full">
              {resourceHistory.slice(-20).map((entry, i) => {
                const avg = (entry.resources.studentTrust + entry.resources.parentSatisfaction + entry.resources.schoolReputation + entry.resources.teacherEnergy) / 4;
                const color = avg >= 60 ? "#22c55e" : avg >= 40 ? "#eab308" : "#ef4444";
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      style={{ height: `${avg}%`, background: color, minWidth: 4, width: "100%", maxWidth: 20, transition: "height 0.3s" }}
                    />
                    {i % 3 === 0 && (
                      <div className="text-[7px] text-gray-600 mt-0.5">{entry.week}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {RESOURCE_BARS.map((bar) => (
              <div key={bar.key} className="flex items-center gap-1">
                <div className="w-2 h-2" style={{ background: bar.color }} />
                <span className="text-[9px] text-gray-500">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
