"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MockEvent } from "@/lib/mock/events";

interface EventPanelProps {
  event: MockEvent;
  onDecide: (choiceId: string) => void;
}

export default function EventPanel({ event, onDecide }: EventPanelProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selectedChoice) return;
    setConfirmed(true);
    setTimeout(() => {
      onDecide(selectedChoice);
      setSelectedChoice(null);
      setConfirmed(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{event.description}</p>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          어떻게 대응하시겠습니까?
        </p>
        {event.presetChoices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => setSelectedChoice(choice.id)}
            disabled={confirmed}
            className={`w-full text-left p-3 rounded-lg border-2 text-sm transition-all ${
              selectedChoice === choice.id
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/30"
            } ${confirmed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {choice.text}
          </button>
        ))}
      </div>

      {selectedChoice && !confirmed && (
        <Button onClick={handleConfirm} className="w-full">
          이 선택으로 결정
        </Button>
      )}

      {confirmed && (
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          결과를 확인하는 중...
        </div>
      )}
    </div>
  );
}
