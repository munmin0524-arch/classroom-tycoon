"use client";

import { useGameStore } from "@/stores/gameStore";
import { CLASS_LEVELS } from "@/types";

const SCHOOL_LABELS: Record<string, string> = {
  elementary: "초등학교", middle: "중학교", high: "고등학교",
};
const REGION_LABELS: Record<string, string> = {
  urban: "도시", rural: "농촌/읍면", newtown: "신도시",
};

/** Small phone version */
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
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">학교</div>
          <div className="text-sm text-white">{SCHOOL_LABELS[schoolType]} {grade}학년</div>
          <div className="text-[10px] text-gray-500 mt-0.5">지역: {REGION_LABELS[region]}</div>
        </div>
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
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">학급 레벨</div>
          <div className="text-sm text-purple-300 pixel-text">{levelInfo?.name}</div>
          <div className="text-[9px] text-gray-500">{levelInfo?.description}</div>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((lv) => (
              <div key={lv} className="w-4 h-4 text-center text-[10px]" style={{ color: lv <= classLevel ? "#eab308" : "#333" }}>★</div>
            ))}
          </div>
        </div>
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">타이쿤 포인트</div>
          <div className="text-lg text-yellow-300 pixel-text">{tycoonPoints} TP</div>
        </div>
        <div className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-[10px] text-gray-500 mb-1">학생 현황</div>
          <div className="text-[10px] text-gray-300">총 {students.length}명</div>
        </div>
      </div>
    </div>
  );
}

/** Large popup version - dashboard style */
export function ClassInfoPopup() {
  const { currentWeek, classLevel, tycoonPoints, schoolType, grade, region, students, eventHistory, purchasedInvestments } = useGameStore();
  const levelInfo = CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-4">
        {/* School info card */}
        <div className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-xs text-gray-500 mb-2">학교 정보</div>
          <div className="text-lg text-white pixel-text">{SCHOOL_LABELS[schoolType]} {grade}학년</div>
          <div className="text-sm text-gray-400 mt-1">지역: {REGION_LABELS[region]}</div>
          <div className="text-sm text-gray-400">학생 수: {students.length}명</div>
        </div>

        {/* Class level card */}
        <div className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-xs text-gray-500 mb-2">학급 레벨</div>
          <div className="text-xl text-purple-300 pixel-text mb-1">{levelInfo?.name}</div>
          <div className="text-sm text-gray-500 mb-3">{levelInfo?.description}</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((lv) => (
              <div
                key={lv}
                className="w-8 h-8 flex items-center justify-center text-lg"
                style={{
                  color: lv <= classLevel ? "#eab308" : "#333",
                  textShadow: lv <= classLevel ? "0 0 8px rgba(234,179,8,0.5)" : "none",
                }}
              >★</div>
            ))}
          </div>
        </div>

        {/* Purchased investments */}
        {purchasedInvestments.length > 0 && (
          <div className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
            <div className="text-xs text-gray-500 mb-2">교실 투자 현황</div>
            <div className="space-y-1">
              {purchasedInvestments.map((inv) => (
                <div key={inv} className="text-sm text-green-400">✓ {inv}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {/* Progress card */}
        <div className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-xs text-gray-500 mb-2">진행 상황</div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">주차</span>
            <span className="text-white pixel-text">{currentWeek} / 40</span>
          </div>
          <div className="h-4 bg-gray-800 mb-3">
            <div
              style={{
                width: `${(currentWeek / 40) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #4a90d9, #6bb5f0)",
                transition: "width 0.5s",
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">처리한 이벤트</span>
            <span className="text-white">{eventHistory.length}건</span>
          </div>
        </div>

        {/* TP card */}
        <div className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-xs text-gray-500 mb-2">타이쿤 포인트</div>
          <div className="text-3xl text-yellow-300 pixel-text">{tycoonPoints} TP</div>
          <div className="text-xs text-gray-500 mt-1">교실 투자에 사용할 수 있습니다</div>
        </div>

        {/* Stats summary */}
        <div className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
          <div className="text-xs text-gray-500 mb-2">통계</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">남은 주</span>
              <span className="text-white">{Math.max(0, 40 - currentWeek)}주</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">이벤트 당 평균 TP</span>
              <span className="text-white">{eventHistory.length > 0 ? Math.round(tycoonPoints / eventHistory.length) : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
