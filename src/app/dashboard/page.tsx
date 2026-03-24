import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  // TODO: 실제 DB에서 세션 목록 로드
  const activeSessions: {
    id: string;
    schoolType: string;
    grade: number;
    currentWeek: number;
    classLevel: number;
  }[] = [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">학급 경영 시뮬레이션을 시작하세요</p>
        </div>
        <Link href="/game/new">
          <Button size="lg">+ 새 게임 시작</Button>
        </Link>
      </div>

      {activeSessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🏫</div>
            <h2 className="text-xl font-semibold mb-2">아직 진행 중인 게임이 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              새 게임을 시작해서 가상 학급을 경영해보세요!
            </p>
            <Link href="/game/new">
              <Button>새 게임 시작하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeSessions.map((session) => (
            <Link key={session.id} href={`/game/${session.id}`}>
              <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {session.schoolType === "elementary" ? "초등학교" : session.schoolType === "middle" ? "중학교" : "고등학교"}{" "}
                      {session.grade}학년
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {session.currentWeek}주차 · Lv.{session.classLevel}
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
