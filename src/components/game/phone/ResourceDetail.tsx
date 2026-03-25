"use client";

import { useGameStore } from "@/stores/gameStore";

export function ResourceDetail() {
  const { resources, setPhoneApp } = useGameStore();

  const bars = [
    { key: "studentTrust", label: "학생 신뢰도", value: resources.studentTrust, color: "#22c55e", desc: "학생들이 교사를 신뢰하는 정도" },
    { key: "parentSatisfaction", label: "학부모 만족도", value: resources.parentSatisfaction, color: "#3b82f6", desc: "학부모의 학교/교사 만족도" },
    { key: "schoolReputation", label: "학교 평판", value: resources.schoolReputation, color: "#a855f7", desc: "학교 관리자가 보는 교사 평가" },
    { key: "teacherEnergy", label: "교사 에너지", value: resources.teacherEnergy, color: "#eab308", desc: "교사의 체력과 정신력" },
  ];

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">자원 현황</span>
      </div>
      <div className="p-3 space-y-4">
        {bars.map((bar) => {
          const isDanger = bar.value <= 25;
          const isWarning = bar.value <= 40 && bar.value > 25;
          return (
            <div key={bar.key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-300">{bar.label}</span>
                <span className={`text-sm font-bold ${isDanger ? "text-red-400 animate-resource-flash" : isWarning ? "text-orange-400" : "text-white"}`}>
                  {bar.value}
                </span>
              </div>
              <div className="h-4 bg-gray-800" style={{ border: "1px solid #333" }}>
                <div
                  className={isDanger ? "animate-resource-flash" : ""}
                  style={{
                    width: `${bar.value}%`,
                    height: "100%",
                    background: isDanger ? "#ef4444" : bar.color,
                    transition: "width 0.5s",
                  }}
                />
              </div>
              <div className="text-[9px] text-gray-600 mt-0.5">{bar.desc}</div>
              {isDanger && (
                <div className="text-[9px] text-red-400 mt-0.5">위험! 0 이하 시 게임 오버</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
