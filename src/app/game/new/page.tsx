"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SchoolType = "elementary" | "middle" | "high";
type Region = "urban" | "rural" | "newtown";

const SCHOOL_OPTIONS = [
  { value: "elementary" as SchoolType, label: "초등학교", icon: "🏫", grades: [1, 2, 3, 4, 5, 6] },
  { value: "middle" as SchoolType, label: "중학교", icon: "🏢", grades: [1, 2, 3] },
  { value: "high" as SchoolType, label: "고등학교", icon: "🎓", grades: [1, 2, 3] },
];

const ALL_GRADES = [1, 2, 3, 4, 5, 6];

const REGION_OPTIONS = [
  { value: "urban" as Region, label: "도시", desc: "균형 잡힌 기본 난이도", color: "#4a90d9", icon: "🏙️" },
  { value: "rural" as Region, label: "농촌/읍면", desc: "자원 부족, 높은 난이도", color: "#7cb342", icon: "🌾" },
  { value: "newtown" as Region, label: "신도시", desc: "학부모 민원 가중", color: "#e91e63", icon: "🏘️" },
];

export default function NewGamePage() {
  const router = useRouter();
  const [schoolType, setSchoolType] = useState<SchoolType | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [region, setRegion] = useState<Region>("urban");
  const [isCreating, setIsCreating] = useState(false);

  const selectedSchool = SCHOOL_OPTIONS.find((s) => s.value === schoolType);
  const availableGrades = selectedSchool?.grades ?? [];
  const canStart = schoolType && grade;

  const handleCreate = () => {
    if (!canStart) return;
    setIsCreating(true);
    const sessionId = crypto.randomUUID();
    setTimeout(() => {
      router.push(`/game/${sessionId}?region=${region}&schoolType=${schoolType}&grade=${grade}`);
    }, 1200);
  };

  return (
    <main className="h-screen flex items-center justify-center p-4" style={{ background: "#1a1a2e" }}>
      <div className="pixel-border p-8 w-full max-w-lg" style={{ background: "rgba(10, 10, 30, 0.95)" }}>
        <h1 className="text-2xl text-center pixel-text text-yellow-300 mb-2">교실 타이쿤</h1>
        <p className="text-center text-gray-400 text-sm mb-6">학급 설정을 선택하세요</p>

        {/* School Type - 항상 표시 */}
        <div className="mb-5">
          <div className="text-sm text-gray-300 pixel-text mb-2">학교 유형</div>
          <div className="grid grid-cols-3 gap-2">
            {SCHOOL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSchoolType(opt.value); setGrade(null); }}
                className={`pixel-button text-center py-3 ${
                  schoolType === opt.value ? "pixel-button-primary" : ""
                }`}
              >
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className="text-sm">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Grade - 항상 표시, 선택 불가능한 학년은 비활성화 */}
        <div className="mb-5">
          <div className="text-sm text-gray-300 pixel-text mb-2">학년</div>
          <div className="flex gap-2 flex-wrap">
            {ALL_GRADES.map((g) => {
              const isAvailable = availableGrades.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => isAvailable && setGrade(g)}
                  disabled={!isAvailable}
                  className={`pixel-button w-14 h-14 text-center ${
                    grade === g ? "pixel-button-primary" : ""
                  } ${!isAvailable ? "opacity-20 cursor-not-allowed" : ""}`}
                >
                  <div className="text-lg">{g}</div>
                  <div className="text-[8px] text-gray-500">학년</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Region - 항상 표시 */}
        <div className="mb-6">
          <div className="text-sm text-gray-300 pixel-text mb-2">지역 특성</div>
          <div className="grid grid-cols-3 gap-2">
            {REGION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRegion(opt.value)}
                className={`pixel-button text-center py-3 ${
                  region === opt.value ? "pixel-button-primary" : ""
                }`}
              >
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className="text-sm">{opt.label}</div>
                <div className="text-[8px] text-gray-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Create Button - 항상 표시, 미선택 시 비활성화 */}
        <button
          onClick={handleCreate}
          disabled={!canStart || isCreating}
          className={`pixel-button w-full py-4 text-center text-lg ${
            canStart ? "pixel-button-primary" : "opacity-30 cursor-not-allowed"
          } ${isCreating ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isCreating ? (
            <span className="animate-pixel-pulse inline-block">
              15명의 학생을 배치하는 중...
            </span>
          ) : canStart ? (
            `${selectedSchool?.label} ${grade}학년 시작`
          ) : (
            "학교와 학년을 선택하세요"
          )}
        </button>
      </div>
    </main>
  );
}
