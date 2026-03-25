"use client";

import { useGameStore } from "@/stores/gameStore";
import { MOCK_EVENTS } from "@/lib/mock/events";
import { CHARACTER_DATA } from "@/lib/pixel-art/characters";

export function Notifications() {
  const { activeEventStudentIds, currentWeek, resolvedEventIds, setPhoneApp, triggerEventFromPhone } = useGameStore();

  // Find actual events for active students
  const activeEvents = activeEventStudentIds.map((studentId) => {
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
              const EVENT_TYPE_LABELS: Record<string, string> = {
                bullying: "학교폭력", academic: "학업", behavior: "생활지도",
                parent: "학부모", mental: "심리/복지", social: "교우관계",
                class_mgmt: "학급운영", special: "특수상황", admin: "행정",
              };
              return (
                <div
                  key={event.id}
                  className="p-2"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-red-400 text-[10px]">{"★".repeat(event.severity)}</span>
                    <div className="flex-1">
                      <div className="text-xs text-white">{event.title}</div>
                      <div className="text-[9px] text-gray-500">
                        {charData?.name} | {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerEventFromPhone(studentId)}
                    className="pixel-button pixel-button-primary w-full text-[11px] py-1"
                  >
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
