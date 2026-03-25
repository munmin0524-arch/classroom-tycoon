"use client";

import { AnimatePresence, motion } from "motion/react";
import { useGameStore } from "@/stores/gameStore";
import { StudentRoster } from "./phone/StudentRoster";
import { Notifications } from "./phone/Notifications";
import { ResourceDetail } from "./phone/ResourceDetail";
import { EventHistory } from "./phone/EventHistory";
import { ClassInfo } from "./phone/ClassInfo";

function NextWeekApp() {
  const { activeEventStudentIds, status, advanceWeek, setPhoneApp } = useGameStore();
  const hasActiveEvents = activeEventStudentIds.length > 0;
  const canAdvance = !hasActiveEvents && status === "active";

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">다음 주</span>
      </div>
      <div className="p-4 flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
        {hasActiveEvents ? (
          <>
            <div className="text-red-400 text-3xl mb-3">!</div>
            <div className="text-xs text-gray-300 text-center mb-2">
              미처리 이벤트가 {activeEventStudentIds.length}건 있습니다
            </div>
            <div className="text-[10px] text-gray-500 text-center">
              알림함에서 이벤트를 먼저 처리해주세요
            </div>
          </>
        ) : (
          <>
            <div className="text-gray-400 text-3xl mb-3">&#8594;</div>
            <div className="text-xs text-gray-300 text-center mb-4">
              다음 주로 넘어갈 준비가 되었습니다
            </div>
            <button
              onClick={advanceWeek}
              disabled={!canAdvance}
              className="pixel-button pixel-button-primary text-sm px-8 py-3"
            >
              다음 주 진행
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PhoneHome() {
  const { activeEventStudentIds, setPhoneApp } = useGameStore();
  const notifCount = activeEventStudentIds.length;

  const apps = [
    { id: "roster" as const, label: "학생 명부", icon: "👤", bg: "#2a4a2a" },
    { id: "notifications" as const, label: "알림함", icon: "🔔", bg: "#4a2a2a", badge: notifCount },
    { id: "resources" as const, label: "자원 현황", icon: "📊", bg: "#2a2a4a" },
    { id: "history" as const, label: "이벤트 기록", icon: "📋", bg: "#3a3a2a" },
    { id: "classinfo" as const, label: "학급 정보", icon: "⭐", bg: "#2a3a4a" },
    { id: "nextweek" as const, label: "다음 주", icon: "➡️", bg: "#4a3a2a" },
  ];

  return (
    <div className="p-4">
      <div className="text-center text-yellow-300 pixel-text text-sm mb-4">교실 타이쿤</div>
      <div className="grid grid-cols-3 gap-2">
        {apps.map((app) => (
          <div
            key={app.id}
            className="phone-app-icon"
            onClick={() => setPhoneApp(app.id)}
          >
            <div className="phone-app-icon-box" style={{ background: app.bg }}>
              {app.icon}
            </div>
            {app.badge && app.badge > 0 && (
              <div
                className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
              >
                {app.badge}
              </div>
            )}
            <span className="text-[9px] text-gray-400">{app.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneScreen() {
  const { phoneApp } = useGameStore();

  switch (phoneApp) {
    case "roster": return <StudentRoster />;
    case "notifications": return <Notifications />;
    case "resources": return <ResourceDetail />;
    case "history": return <EventHistory />;
    case "classinfo": return <ClassInfo />;
    case "nextweek": return <NextWeekApp />;
    default: return <PhoneHome />;
  }
}

export function PhoneToggleButton() {
  const { togglePhone, phoneOpen, activeEventStudentIds } = useGameStore();
  const notifCount = activeEventStudentIds.length;

  return (
    <button
      onClick={togglePhone}
      className="fixed bottom-6 right-6 z-30 pixel-button px-3 py-2 flex items-center gap-2"
      style={{
        background: phoneOpen ? "#1a4a8a" : "#2a2a4a",
        borderColor: phoneOpen ? "#4488cc" : "#666688",
      }}
    >
      <span className="text-lg">📱</span>
      <span className="pixel-text text-xs">{phoneOpen ? "닫기" : "폰"}</span>
      {notifCount > 0 && !phoneOpen && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold animate-pixel-pulse">
          {notifCount}
        </span>
      )}
    </button>
  );
}

export function PhoneOverlay() {
  const { phoneOpen, setPhoneApp } = useGameStore();

  return (
    <AnimatePresence>
      {phoneOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed z-40"
          style={{
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <div className="phone-frame">
            {/* Status bar */}
            <div className="phone-statusbar">
              <span className="pixel-text">9:00</span>
              <span className="pixel-text">▂▅ LTE</span>
            </div>

            {/* Screen */}
            <div className="phone-screen">
              <PhoneScreen />
            </div>

            {/* Home button */}
            <div className="phone-home-btn">
              <button onClick={() => setPhoneApp("home")} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
