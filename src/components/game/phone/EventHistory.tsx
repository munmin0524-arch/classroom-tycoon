"use client";

import { useGameStore } from "@/stores/gameStore";

const RESOURCE_SHORT: Record<string, string> = {
  studentTrust: "신", parentSatisfaction: "부", schoolReputation: "평", teacherEnergy: "에",
};

const RESOURCE_FULL: Record<string, string> = {
  studentTrust: "신뢰", parentSatisfaction: "학부모", schoolReputation: "평판", teacherEnergy: "에너지",
};

/** Small phone version */
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
              <div key={i} className="p-2" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid #1a1a2e" }}>
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
                    return (
                      <span key={key} className={`text-[8px] ${val > 0 ? "text-green-500" : "text-red-500"}`}>
                        {RESOURCE_SHORT[key]}{val > 0 ? `+${val}` : val}
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

/** Large popup version - timeline style */
export function EventHistoryPopup() {
  const { eventHistory } = useGameStore();

  if (eventHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-gray-600 text-4xl mb-4">📋</div>
        <div className="text-lg text-gray-400">아직 처리한 이벤트가 없습니다</div>
      </div>
    );
  }

  // Group by week
  const grouped: Record<number, typeof eventHistory> = {};
  eventHistory.forEach((entry) => {
    if (!grouped[entry.week]) grouped[entry.week] = [];
    grouped[entry.week].push(entry);
  });

  const weeks = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {weeks.map((week) => (
        <div key={week}>
          {/* Week header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="pixel-text text-sm text-yellow-300">{week}주차</div>
            <div className="flex-1 h-px bg-gray-700" />
          </div>
          {/* Events in this week */}
          <div className="space-y-3 ml-4">
            {grouped[week].map((entry, i) => (
              <div key={i} className="p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #222" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 text-sm">{"★".repeat(entry.event.severity)}</span>
                  <span className="text-base text-white">{entry.event.title}</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  선택: {entry.choiceText}
                </div>
                {/* Outcome narrative */}
                <div className="text-sm text-gray-500 mb-3 leading-relaxed" style={{ borderLeft: "2px solid #333", paddingLeft: 12 }}>
                  {entry.outcome.narrative.slice(0, 200)}...
                </div>
                {/* Resource changes */}
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(entry.outcome.resourceChanges).map(([key, val]) => {
                    if (val === 0) return null;
                    return (
                      <span
                        key={key}
                        className={`text-xs px-2 py-1 ${val > 0 ? "text-green-400 bg-green-900/30" : "text-red-400 bg-red-900/30"}`}
                        style={{ border: `1px solid ${val > 0 ? "#22c55e33" : "#ef444433"}` }}
                      >
                        {RESOURCE_FULL[key]} {val > 0 ? `+${val}` : val}
                      </span>
                    );
                  })}
                </div>
                {/* Mentor feedback */}
                {entry.outcome.mentorFeedback && (
                  <div className="text-xs text-blue-300 bg-blue-900/20 p-2 mt-3" style={{ border: "1px solid #3b82f633" }}>
                    <span className="text-blue-400">멘토:</span> {entry.outcome.mentorFeedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
