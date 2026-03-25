"use client";

import { useGameStore } from "@/stores/gameStore";
import { CLASS_LEVELS } from "@/types";

const SCHOOL_LABELS: Record<string, string> = {
  elementary: "초등학교", middle: "중학교", high: "고등학교",
};
const REGION_LABELS: Record<string, string> = {
  urban: "도시", rural: "농촌/읍면", newtown: "신도시",
};

export function ClassInfo() {
  const { currentWeek, classLevel, tycoonPoints, schoolType, grade, region, students, eventHistory, setPhoneApp } = useGameStore();
  const levelInfo = CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS];

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">학급 정보</span>
      </div>
      <div className="p-3 space-y-3">
        {/* School info */}
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">학교</div>
          <div className="text-sm text-white">
            {SCHOOL_LABELS[schoolType]} {grade}학년
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            지역: {REGION_LABELS[region]}
          </div>
        </div>

        {/* Progress */}
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">진행 상황</div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">주차</span>
            <span className="text-white">{currentWeek} / 40</span>
          </div>
          <div className="h-2 bg-gray-800 mb-2">
            <div style={{ width: `${(currentWeek / 40) * 100}%`, height: "100%", background: "#4a90d9" }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">처리한 이벤트</span>
            <span className="text-white">{eventHistory.length}건</span>
          </div>
        </div>

        {/* Level */}
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">학급 레벨</div>
          <div className="text-sm text-purple-300 pixel-text">{levelInfo?.name}</div>
          <div className="text-[9px] text-gray-500">{levelInfo?.description}</div>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((lv) => (
              <div
                key={lv}
                className="w-4 h-4 text-center text-[10px]"
                style={{ color: lv <= classLevel ? "#eab308" : "#333" }}
              >
                ★
              </div>
            ))}
          </div>
        </div>

        {/* TP */}
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">타이쿤 포인트</div>
          <div className="text-lg text-yellow-300 pixel-text">{tycoonPoints} TP</div>
        </div>

        {/* Stats */}
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">학생 현황</div>
          <div className="text-[10px] text-gray-300">총 {students.length}명</div>
        </div>
      </div>
    </div>
  );
}
