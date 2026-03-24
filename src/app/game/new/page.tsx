"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SchoolType = "elementary" | "middle" | "high";
type Region = "urban" | "rural" | "newtown";

const SCHOOL_OPTIONS = [
  { value: "elementary" as SchoolType, label: "초등학교", emoji: "🏫", grades: [1, 2, 3, 4, 5, 6] },
  { value: "middle" as SchoolType, label: "중학교", emoji: "🏢", grades: [1, 2, 3] },
  { value: "high" as SchoolType, label: "고등학교", emoji: "🏛️", grades: [1, 2, 3] },
];

const REGION_OPTIONS = [
  { value: "urban" as Region, label: "도시", emoji: "🌆" },
  { value: "rural" as Region, label: "농촌/읍면", emoji: "🌾" },
  { value: "newtown" as Region, label: "신도시", emoji: "🏗️" },
];

export default function NewGamePage() {
  const router = useRouter();
  const [schoolType, setSchoolType] = useState<SchoolType | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [region, setRegion] = useState<Region>("urban");
  const [isCreating, setIsCreating] = useState(false);

  const selectedSchool = SCHOOL_OPTIONS.find((s) => s.value === schoolType);

  const handleCreate = () => {
    if (!schoolType || !grade) return;
    setIsCreating(true);

    // 더미 데이터 모드: API 호출 없이 바로 게임 시작
    const sessionId = crypto.randomUUID();
    setTimeout(() => {
      router.push(`/game/${sessionId}`);
    }, 1500); // 로딩 느낌 연출
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">새 게임 시작</h1>
      <p className="text-muted-foreground mb-8">학급 설정을 선택하세요</p>

      {/* 학교 유형 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">학교 유형</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {SCHOOL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSchoolType(opt.value); setGrade(null); }}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  schoolType === opt.value
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="text-3xl mb-1">{opt.emoji}</div>
                <div className="font-medium">{opt.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 학년 */}
      {selectedSchool && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">학년</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {selectedSchool.grades.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`w-16 h-16 rounded-lg border-2 text-center font-semibold text-lg transition-colors ${
                    grade === g
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지역 */}
      {grade && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">지역 특성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {REGION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRegion(opt.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    region === opt.value
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <div className="text-sm font-medium">{opt.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 시작 버튼 */}
      {schoolType && grade && (
        <Button
          onClick={handleCreate}
          disabled={isCreating}
          size="lg"
          className="w-full text-lg py-6"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🎲</span>
              AI가 30명의 학생을 만들고 있어요...
            </span>
          ) : (
            `${selectedSchool?.label} ${grade}학년 학급 시작!`
          )}
        </Button>
      )}
    </main>
  );
}
