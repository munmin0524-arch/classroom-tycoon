"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MockOutcome } from "@/lib/mock/events";

interface OutcomeDisplayProps {
  outcome: MockOutcome;
  onDismiss: () => void;
}

function ChangeIndicator({ value, label }: { value: number; label: string }) {
  if (value === 0) return null;
  return (
    <span className={`text-xs font-medium ${value > 0 ? "text-green-600" : "text-red-500"}`}>
      {label} {value > 0 ? `+${value}` : value}
    </span>
  );
}

export default function OutcomeDisplay({ outcome, onDismiss }: OutcomeDisplayProps) {
  const { resourceChanges } = outcome;

  return (
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📋 이번 주 결과
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 내러티브 */}
        <p className="text-sm leading-relaxed">{outcome.narrative}</p>

        {/* 자원 변화 */}
        <div className="flex flex-wrap gap-2">
          <ChangeIndicator value={resourceChanges.studentTrust} label="💛 신뢰" />
          <ChangeIndicator value={resourceChanges.parentSatisfaction} label="👨‍👩‍👧 만족" />
          <ChangeIndicator value={resourceChanges.schoolReputation} label="🏫 평판" />
          <ChangeIndicator value={resourceChanges.teacherEnergy} label="🔋 에너지" />
        </div>

        {/* 멘토 피드백 */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📗</span>
            <span className="font-semibold text-sm">김수석 선생님의 피드백</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {outcome.mentorFeedback}
          </p>
        </div>

        <Button onClick={onDismiss} variant="outline" className="w-full">
          확인
        </Button>
      </CardContent>
    </Card>
  );
}
