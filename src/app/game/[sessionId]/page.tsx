"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SeatMap from "@/components/classroom/SeatMap";
import ResourceBar from "@/components/charts/ResourceBar";
import EventPanel from "@/components/event/EventPanel";
import OutcomeDisplay from "@/components/event/OutcomeDisplay";
import { useGameStore } from "@/stores/gameStore";
import { CLASS_LEVELS } from "@/types";
import { GAMEOVER_MESSAGES } from "@/lib/game/engine";
import type { GameoverType } from "@/types";

export default function GameDashboard() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const {
    initGame, advanceWeek, submitDecision, dismissOutcome,
    students, currentWeek, resources, classLevel, tycoonPoints,
    currentEvent, lastOutcome, status, gameoverType, eventHistory, reset,
  } = useGameStore();

  useEffect(() => {
    if (!useGameStore.getState().sessionId) {
      initGame(sessionId);
    }
  }, [sessionId, initGame]);

  const levelInfo = CLASS_LEVELS[classLevel as keyof typeof CLASS_LEVELS] || CLASS_LEVELS[1];

  // 게임오버 화면
  if (status === "gameover" && gameoverType) {
    const msg = GAMEOVER_MESSAGES[gameoverType as GameoverType];
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">💔</div>
            <CardTitle className="text-2xl text-red-500">{msg?.title || "게임 오버"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{msg?.description}</p>
            <div className="text-sm text-muted-foreground">
              {currentWeek}주차까지 진행 · 이벤트 {eventHistory.length}개 처리
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => { reset(); router.push("/dashboard"); }}>
                대시보드로
              </Button>
              <Button onClick={() => { reset(); initGame(crypto.randomUUID()); }}>
                다시 시작
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // 클리어 화면
  if (status === "completed") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl text-green-600">학기 완료!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              40주의 학기를 성공적으로 마쳤습니다!
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-bold text-lg">{tycoonPoints}</div>
                <div className="text-muted-foreground">획득 TP</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-bold text-lg">Lv.{classLevel}</div>
                <div className="text-muted-foreground">{levelInfo.name}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-bold text-lg">{eventHistory.length}</div>
                <div className="text-muted-foreground">처리한 이벤트</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-bold text-lg">{resources.studentTrust}</div>
                <div className="text-muted-foreground">최종 신뢰도</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => { reset(); router.push("/dashboard"); }}>
                대시보드로
              </Button>
              <Button onClick={() => { reset(); initGame(crypto.randomUUID()); }}>
                새 학기 시작
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* 상단 정보 바 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🏫 내 교실
            <Badge variant="secondary" className="text-sm">
              Lv.{classLevel} {levelInfo.name}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm">{levelInfo.description}</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <div className="font-bold text-lg">{currentWeek}</div>
            <div className="text-muted-foreground">주차</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{tycoonPoints}</div>
            <div className="text-muted-foreground">TP</div>
          </div>
        </div>
      </div>

      {/* 결과 표시 모달 */}
      {lastOutcome && (
        <OutcomeDisplay outcome={lastOutcome} onDismiss={dismissOutcome} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌: 자리배치도 (2칸) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>교실 자리배치도</span>
                <span className="text-sm font-normal text-muted-foreground">
                  학생 {students.length}명
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SeatMap
                students={students}
                onStudentClick={(id) => {
                  router.push(`/game/${sessionId}/student/${id}`);
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* 우: 자원 + 이벤트 */}
        <div className="space-y-6">
          {/* 4대 자원 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">학급 자원</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceBar resources={resources} />
            </CardContent>
          </Card>

          {/* 이번 주 이벤트 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>이번 주 이벤트</span>
                {currentEvent && (
                  <Badge variant={currentEvent.severity >= 4 ? "destructive" : currentEvent.severity >= 3 ? "default" : "secondary"}>
                    {"★".repeat(currentEvent.severity)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentEvent ? (
                <EventPanel event={currentEvent} onDecide={submitDecision} />
              ) : (
                <div className="text-center py-6">
                  <Button size="lg" className="w-full" onClick={advanceWeek}>
                    ▶ 다음 주로 진행
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {currentWeek}주차 → {currentWeek + 1}주차
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 히스토리 */}
          {eventHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 이벤트</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {eventHistory.slice(-5).reverse().map((h, i) => (
                    <div key={i} className="text-sm border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{h.event.title}</span>
                        <span className="text-muted-foreground text-xs">{h.week}주차</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
