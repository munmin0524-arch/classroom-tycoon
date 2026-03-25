"use client";

import { useGameStore } from "@/stores/gameStore";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelPortrait } from "@/components/pixel/PixelPortrait";
import { getEmotion } from "@/lib/pixel-art/characters";

const PERSONALITY_LABELS: Record<string, string> = {
  active: "활발형", diligent: "성실형", social: "사교형", introvert: "내향형", rebellious: "반항형",
};

const FAMILY_LABELS: Record<string, string> = {
  stable: "안정", dual_income: "맞벌이", overprotective: "과잉보호",
  single_parent: "한부모", low_income: "경제적 어려움", multicultural: "다문화",
};

const GROUP_LABELS: Record<string, string> = {
  popular: "인기", quiet: "조용", independent: "독립", isolated: "고립",
};

const ROLE_LABELS: Record<string, string> = {
  leader: "리더", follower: "따르미", boundary: "중재자", independent: "독립적",
};

function StudentDetail() {
  const { phoneSelectedStudentId, students, setPhoneSelectedStudent } = useGameStore();
  const student = students.find((s) => s.id === phoneSelectedStudentId);
  if (!student) return null;

  const emotion = getEmotion(student.emotional.happiness, student.emotional.stress);
  const friends = student.social.friendIds
    .map((fid) => students.find((s) => s.seatNumber === fid))
    .filter(Boolean);

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneSelectedStudent(null)}>&#8592;</button>
        <span className="pixel-text">{student.name}</span>
      </div>
      <div className="p-3 space-y-3">
        {/* Portrait + basic info */}
        <div className="flex items-center gap-3">
          <PixelPortrait studentId={student.id} happiness={student.emotional.happiness} stress={student.emotional.stress} scale={2} />
          <div>
            <div className="text-sm text-white">{student.name}</div>
            <div className="text-[10px] text-gray-400">
              {PERSONALITY_LABELS[student.personalityMain]} / {PERSONALITY_LABELS[student.personalitySub]}
            </div>
            <div className="text-[10px] text-gray-500">{student.seatNumber}번 자리</div>
          </div>
        </div>

        {/* Emotional */}
        <div className="space-y-1">
          <div className="text-[10px] text-yellow-300 pixel-text">감정 상태</div>
          {[
            { label: "행복", value: student.emotional.happiness, color: "#22c55e" },
            { label: "스트레스", value: student.emotional.stress, color: "#ef4444" },
            { label: "교사 신뢰", value: student.emotional.trustInTeacher, color: "#3b82f6" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[9px] text-gray-400 w-12">{item.label}</span>
              <div className="flex-1 h-2 bg-gray-800">
                <div style={{ width: `${item.value}%`, height: "100%", background: item.color }} />
              </div>
              <span className="text-[9px] text-gray-300 w-6 text-right">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Academic */}
        <div className="space-y-1">
          <div className="text-[10px] text-yellow-300 pixel-text">성적</div>
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { label: "국", value: student.academic.korean },
              { label: "수", value: student.academic.math },
              { label: "영", value: student.academic.english },
              { label: "과", value: student.academic.science },
              { label: "사", value: student.academic.social },
            ].map((s) => (
              <div key={s.label} className="bg-gray-800/50 p-1">
                <div className="text-[8px] text-gray-500">{s.label}</div>
                <div className={`text-[11px] ${s.value >= 80 ? "text-green-400" : s.value >= 60 ? "text-gray-300" : "text-red-400"}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[9px] text-gray-500 text-right">
            종합: {student.academic.overall === "top" ? "상위" : student.academic.overall === "middle" ? "중위" : student.academic.overall === "bottom" ? "하위" : "불균형"}
          </div>
        </div>

        {/* Family */}
        <div>
          <div className="text-[10px] text-yellow-300 pixel-text mb-1">가정환경</div>
          <div className="text-[10px] text-gray-300">
            <span className="text-purple-300">[{FAMILY_LABELS[student.family.type]}]</span> {student.family.description}
          </div>
        </div>

        {/* Social */}
        <div>
          <div className="text-[10px] text-yellow-300 pixel-text mb-1">교우관계</div>
          <div className="text-[10px] text-gray-300">
            {GROUP_LABELS[student.social.groupType]} / {ROLE_LABELS[student.social.role]}
          </div>
          {friends.length > 0 && (
            <div className="text-[9px] text-gray-500 mt-0.5">
              친한 친구: {friends.map((f) => f!.name).join(", ")}
            </div>
          )}
        </div>

        {/* Backstory */}
        <div>
          <div className="text-[10px] text-yellow-300 pixel-text mb-1">특이사항</div>
          <div className="text-[10px] text-gray-400 leading-relaxed">{student.backstory}</div>
        </div>
      </div>
    </div>
  );
}

export function StudentRoster() {
  const { students, phoneSelectedStudentId, setPhoneSelectedStudent, setPhoneApp } = useGameStore();

  if (phoneSelectedStudentId) return <StudentDetail />;

  return (
    <div>
      <div className="phone-app-header">
        <button onClick={() => setPhoneApp("home")}>&#8592;</button>
        <span className="pixel-text">학생 명부</span>
        <span className="text-[10px] text-gray-500 ml-auto">{students.length}명</span>
      </div>
      <div>
        {students.map((student) => {
          const emotion = getEmotion(student.emotional.happiness, student.emotional.stress);
          const emotionIcon = emotion === "happy" ? ":-)" : emotion === "neutral" ? ":-|" : emotion === "worried" ? ":-/" : ":-(";
          return (
            <button
              key={student.id}
              onClick={() => setPhoneSelectedStudent(student.id)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
              style={{ borderBottom: "1px solid #1a1a2e" }}
            >
              <PixelCharacter studentId={student.id} happiness={student.emotional.happiness} stress={student.emotional.stress} scale={1.5} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white">{student.name}</div>
                <div className="text-[9px] text-gray-500">{PERSONALITY_LABELS[student.personalityMain]}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400">{emotionIcon}</div>
                <div className={`text-[9px] ${student.emotional.happiness >= 60 ? "text-green-400" : student.emotional.happiness >= 40 ? "text-gray-400" : "text-red-400"}`}>
                  {student.emotional.happiness}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
