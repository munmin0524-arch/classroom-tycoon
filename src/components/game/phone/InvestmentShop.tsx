"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "@/stores/gameStore";
import { INVESTMENTS, type InvestmentType } from "@/types";

const INVESTMENT_ICONS: Record<InvestmentType, string> = {
  library: "📚",
  art_corner: "🎨",
  rules_board: "📋",
  seat_change: "🪑",
  class_event: "🎉",
};

const INVESTMENT_DESCRIPTIONS: Record<InvestmentType, string> = {
  library: "교실에 학급 문고를 설치하여 학생들의 독서 습관을 장려합니다.",
  art_corner: "미술 코너를 만들어 학생들이 자유롭게 창작 활동을 할 수 있게 합니다.",
  rules_board: "학급 규칙을 게시하여 행동 문제를 예방합니다.",
  seat_change: "자리 배치를 변경하여 교우 관계를 개선합니다.",
  class_event: "학급 행사를 개최하여 전체적인 분위기를 향상시킵니다.",
};

interface InvestmentShopProps {
  popup?: boolean;
}

export function InvestmentShop({ popup = false }: InvestmentShopProps) {
  const { tycoonPoints, purchasedInvestments, purchaseInvestment, setPhoneApp } = useGameStore();
  const [justPurchased, setJustPurchased] = useState<string | null>(null);

  const handlePurchase = (type: InvestmentType) => {
    purchaseInvestment(type);
    setJustPurchased(type);
    setTimeout(() => setJustPurchased(null), 2000);
  };

  const items = Object.entries(INVESTMENTS) as [InvestmentType, (typeof INVESTMENTS)[InvestmentType]][];

  if (!popup) {
    // Small phone version
    return (
      <div>
        <div className="phone-app-header">
          <button onClick={() => setPhoneApp("home")}>&#8592;</button>
          <span className="pixel-text">교실 투자</span>
          <span className="text-[10px] text-yellow-300 ml-auto">{tycoonPoints} G</span>
        </div>
        <div className="p-2 space-y-2">
          {items.map(([type, item]) => {
            const purchased = purchasedInvestments.includes(type);
            const canAfford = tycoonPoints >= item.cost;
            return (
              <div key={type} className="p-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${purchased ? "#22c55e33" : "#222"}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{INVESTMENT_ICONS[type]}</span>
                  <span className="text-xs text-white flex-1">{item.name}</span>
                  <span className="text-[10px] text-yellow-300">{item.cost} G</span>
                </div>
                <div className="text-[9px] text-gray-500 mb-2">{item.effect}</div>
                {purchased ? (
                  <div className="text-[10px] text-green-400 text-center">구매 완료 ✓</div>
                ) : (
                  <button
                    onClick={() => handlePurchase(type)}
                    disabled={!canAfford}
                    className={`pixel-button w-full text-[11px] py-1 ${canAfford ? "pixel-button-primary" : "opacity-40"}`}
                  >
                    투자하기
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Large popup version
  return (
    <div>
      {/* TP display */}
      <div className="flex items-center justify-between mb-6 p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #333" }}>
        <div>
          <div className="text-sm text-gray-400">사용 가능한 포인트</div>
          <div className="text-2xl text-yellow-300 pixel-text">{tycoonPoints} G</div>
        </div>
        <div className="text-sm text-gray-500">
          구매한 투자: {purchasedInvestments.length} / {items.length}
        </div>
      </div>

      {/* Investment grid */}
      <div className="grid grid-cols-2 gap-4">
        {items.map(([type, item]) => {
          const purchased = purchasedInvestments.includes(type);
          const canAfford = tycoonPoints >= item.cost;
          const isJustPurchased = justPurchased === type;

          return (
            <motion.div
              key={type}
              className="p-5 relative overflow-hidden"
              style={{
                background: purchased ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${purchased ? "#22c55e44" : isJustPurchased ? "#eab30888" : "#222"}`,
              }}
              whileHover={!purchased ? { scale: 1.02 } : {}}
              transition={{ duration: 0.15 }}
            >
              <AnimatePresence>
                {isJustPurchased && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{ background: "rgba(0,0,0,0.8)" }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{INVESTMENT_ICONS[type]}</div>
                      <div className="text-lg text-yellow-300 pixel-text">투자 완료!</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{INVESTMENT_ICONS[type]}</span>
                <div>
                  <div className="text-base text-white pixel-text">{item.name}</div>
                  <div className="text-sm text-yellow-300">{item.cost} G</div>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-2">{INVESTMENT_DESCRIPTIONS[type]}</div>
              <div className="text-xs text-purple-300 mb-4" style={{ borderLeft: "2px solid #a855f7", paddingLeft: 8 }}>
                {item.effect}
              </div>

              {purchased ? (
                <div className="text-center text-green-400 pixel-text py-2">
                  ✓ 구매 완료
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(type)}
                  disabled={!canAfford}
                  className={`pixel-button w-full text-sm py-2 ${canAfford ? "pixel-button-primary" : "opacity-40"}`}
                >
                  {canAfford ? "투자하기" : `골드 부족 (${item.cost - tycoonPoints}G 더 필요)`}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
