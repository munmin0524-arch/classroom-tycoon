"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGameStore } from "@/stores/gameStore";

const PERSONALITY_LABELS: Record<string, string> = {
  active: "🔥 활발형",
  diligent: "📖 성실형",
  social: "🎭 사교형",
  introvert: "🛡️ 내향형",
  rebellious: "⚡ 반항형",
};

const FAMILY_LABELS: Record<string, string> = {
  stable: "안정적 가정",
  dual_income: "맞벌이 가정",
  overprotective: "과잉보호 가정",
  single_parent: "한부모 가정",
  low_income: "경제적 어려움",
  multicultural: "다문화 가정",
};

const GROUP_LABELS: Record<string, string> = {
  popular: "인싸 그룹",
  quiet: "조용한 그룹",
  independent: "독립적",
  isolated: "소외",
};

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const sessionId = params.sessionId as string;
  const students = useGameStore((s) => s.students);

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">학생을 찾을 수 없습니다.</p>
      </main>
    );
  }

  const subjects = [
    { key: "korean", label: "국어" },
    { key: "math", label: "수학" },
    { key: "english", label: "영어" },
    { key: "science", label: "과학" },
    { key: "social", label: "사회" },
  ];

  const bigFive = [
    { key: "openness", label: "개방성" },
    { key: "conscientiousness", label: "성실성" },
    { key: "extraversion", label: "외향성" },
    { key: "agreeableness", label: "우호성" },
    { key: "neuroticism", label: "신경성" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push(`/game/${sessionId}`)} className="mb-4">
        ← 교실로 돌아가기
      </Button>

      {/* 기본 정보 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <Badge variant="secondary">{student.seatNumber}번</Badge>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge>{PERSONALITY_LABELS[student.personalityMain]}</Badge>
            <Badge variant="outline">{PERSONALITY_LABELS[student.personalitySub]} (서브)</Badge>
            <Badge variant="outline">{student.gender === "male" ? "남" : "여"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{student.backstory}</p>
        </CardContent>
      </Card>

      {/* 감정 상태 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">감정 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>😊 행복도</span>
              <span>{student.emotional.happiness}</span>
            </div>
            <Progress value={student.emotional.happiness} className="h-2 [&>div]:bg-green-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>😰 스트레스</span>
              <span>{student.emotional.stress}</span>
            </div>
            <Progress value={student.emotional.stress} className="h-2 [&>div]:bg-red-400" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>🤝 교사 신뢰</span>
              <span>{student.emotional.trustInTeacher}</span>
            </div>
            <Progress value={student.emotional.trustInTeacher} className="h-2 [&>div]:bg-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* 성적 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">학업 성적</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjects.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{student.academic[key as keyof typeof student.academic] as number}점</span>
              </div>
              <Progress
                value={student.academic[key as keyof typeof student.academic] as number}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 성격 Big Five */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">성격 특성 (Big Five)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bigFive.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{student.personality[key as keyof typeof student.personality]}</span>
              </div>
              <Progress
                value={student.personality[key as keyof typeof student.personality]}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 사회/가정 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">환경 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">가정환경</span>
            <span>{FAMILY_LABELS[student.family.type]}</span>
          </div>
          <p className="text-muted-foreground text-xs">{student.family.description}</p>
          <div className="flex justify-between">
            <span className="text-muted-foreground">사회적 위치</span>
            <span>{GROUP_LABELS[student.social.groupType]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">역할</span>
            <span>{student.social.role === "leader" ? "리더" : student.social.role === "follower" ? "추종자" : student.social.role === "boundary" ? "경계인" : "독립적"}</span>
          </div>
          {student.social.friendIds.length > 0 && (
            <div>
              <span className="text-muted-foreground">친한 친구: </span>
              <span>
                {student.social.friendIds
                  .map((seatNum) => {
                    const friend = students.find((s) => s.seatNumber === seatNum);
                    return friend?.name || `${seatNum}번`;
                  })
                  .join(", ")}
              </span>
            </div>
          )}
          {student.flags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {student.flags.map((flag) => (
                <Badge key={flag} variant="destructive" className="text-xs">
                  {flag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
