"use client";

import { useGameStore } from "@/stores/gameStore";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { CHARACTER_DATA } from "@/lib/pixel-art/characters";
import { PixelPortrait } from "@/components/pixel/PixelPortrait";

const EVENT_TYPE_LABELS: Record<string, string> = {
  bullying: "학교폭력", academic: "학업", behavior: "생활지도",
  parent: "학부모", mental: "심리/복지", social: "교우관계",
  class_mgmt: "학급운영", special: "특수상황", admin: "행정",
};

const SEVERITY_COLORS: Record<number, string> = {
  1: "#4ade80", 2: "#facc15", 3: "#fb923c", 4: "#ef4444", 5: "#dc2626",
};

function useActiveEvents() {
  const { activeEventStudentIds, currentWeek, resolvedEventIds } = useGameStore();
  return activeEventStudentIds.map((studentId) => {
    const event = MOCK_EVENTS.find(
      (e) =>
        e.triggerStudentId === studentId &&
        !resolvedEventIds.includes(e.id) &&
        currentWeek >= e.weekRange[0] &&
        currentWeek <= e.weekRange[1] &&
        (!e.prerequisiteEventId || resolvedEventIds.includes(e.prerequisiteEventId))
    );
    return event ? { event, studentId } : null;
  }).filter(Boolean) as { event: (typeof MOCK_EVENTS)[0]; studentId: string }[];
}

/** Small phone version */
export function Notifications() {
  const { setPhoneApp, triggerEventFromPhone } = useGameStore();
  const activeEvents = useActiveEvents();

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">알림함</span>
        {activeEvents.length > 0 && (
          <span className="ml-auto text-[10px] text-red-400">{activeEvents.length}건</span>
        )}
      </div>
      <div className="p-2">
        {activeEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600 text-sm mb-1">--</div>
            <div className="text-[10px] text-gray-500">이번 주에는 특별한 알림이 없습니다</div>
          </div>
        ) : (
          <div className="space-y-2">
            {activeEvents.map(({ event, studentId }) => {
              const charData = CHARACTER_DATA[studentId];
              return (
                <div key={event.id} className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-red-400 text-[10px]">{"★".repeat(event.severity)}</span>
                    <div className="flex-1">
                      <div className="text-xs text-white">{event.title}</div>
                      <div className="text-[9px] text-gray-500">
                        {charData?.name} | {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => triggerEventFromPhone(studentId)} className="pixel-button pixel-button-primary w-full text-[11px] py-1">
                    대응하기
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/** Large popup version */
export function NotificationsPopup() {
  const { triggerEventFromPhone, students } = useGameStore();
  const activeEvents = useActiveEvents();

  if (activeEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-gray-600 text-4xl mb-4">✓</div>
        <div className="text-lg text-gray-400">이번 주에는 특별한 알림이 없습니다</div>
        <div className="text-sm text-gray-600 mt-2">모든 이벤트가 처리되었습니다</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeEvents.map(({ event, studentId }) => {
        const charData = CHARACTER_DATA[studentId];
        const student = students.find((s) => s.id === studentId);
        const severityColor = SEVERITY_COLORS[event.severity] || "#ef4444";

        return (
          <div
            key={event.id}
            className="flex gap-4 p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: `2px solid ${severityColor}33` }}
          >
            {/* Student portrait */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {student && (
                <PixelPortrait studentId={studentId} happiness={student.emotional.happiness} stress={student.emotional.stress} scale={2.5} />
              )}
              <span className="text-xs text-gray-300 pixel-text">{charData?.name}</span>
            </div>

            {/* Event info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: severityColor }} className="text-sm">{"★".repeat(event.severity)}</span>
                <span
                  className="text-[10px] px-2 py-0.5"
                  style={{ background: `${severityColor}22`, color: severityColor, border: `1px solid ${severityColor}44` }}
                >
                  {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
                </span>
              </div>
              <div className="text-base text-white mb-2">{event.title}</div>
              <div className="text-sm text-gray-400 mb-4 leading-relaxed">{event.description.slice(0, 120)}...</div>
              <button
                onClick={() => triggerEventFromPhone(studentId)}
                className="pixel-button pixel-button-primary text-sm px-6 py-2"
              >
                대응하기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
