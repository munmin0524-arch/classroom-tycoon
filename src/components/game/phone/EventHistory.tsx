"use client";

import { useGameStore } from "@/stores/gameStore";

export function EventHistory() {
  const { eventHistory, setPhoneApp } = useGameStore();

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">이벤트 기록</span>
        <span className="text-[10px] text-gray-500 ml-auto">{eventHistory.length}건</span>
      </div>
      <div className="p-2">
        {eventHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[10px] text-gray-500">아직 처리한 이벤트가 없습니다</div>
          </div>
        ) : (
          <div className="space-y-1">
            {[...eventHistory].reverse().map((entry, i) => (
              <div
                key={i}
                className="p-2"
                style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid #1a1a2e" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] text-gray-600 pixel-text w-10">{entry.week}주차</span>
                  <span className="text-red-400/60 text-[9px]">{"★".repeat(entry.event.severity)}</span>
                  <span className="text-xs text-white flex-1 truncate">{entry.event.title}</span>
                </div>
                <div className="text-[9px] text-gray-500 ml-12 mb-1 truncate">
                  선택: {entry.choiceText.slice(0, 40)}...
                </div>
                <div className="flex gap-2 ml-12">
                  {Object.entries(entry.outcome.resourceChanges).map(([key, val]) => {
                    if (val === 0) return null;
                    const short: Record<string, string> = {
                      studentTrust: "신", parentSatisfaction: "부", schoolReputation: "평", teacherEnergy: "에",
                    };
                    return (
                      <span
                        key={key}
                        className={`text-[8px] ${val > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {short[key]}{val > 0 ? `+${val}` : val}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
