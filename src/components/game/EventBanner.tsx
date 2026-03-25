"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameStore } from "@/stores/gameStore";

export function EventBanner() {
  const { showEventBanner, eventBannerCount, dismissEventBanner } = useGameStore();

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (showEventBanner) {
      const timer = setTimeout(dismissEventBanner, 4000);
      return () => clearTimeout(timer);
    }
  }, [showEventBanner, dismissEventBanner]);

  return (
    <AnimatePresence>
      {showEventBanner && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-25 cursor-pointer"
          onClick={dismissEventBanner}
        >
          <div
            className="px-6 py-3 pixel-text text-center"
            style={{
              background: eventBannerCount > 0
                ? "linear-gradient(135deg, rgba(180, 40, 40, 0.95), rgba(140, 20, 20, 0.95))"
                : "linear-gradient(135deg, rgba(30, 80, 50, 0.95), rgba(20, 60, 40, 0.95))",
              border: `2px solid ${eventBannerCount > 0 ? "#ff6666" : "#66cc66"}`,
              boxShadow: eventBannerCount > 0
                ? "0 0 20px rgba(255, 60, 60, 0.3), 0 4px 12px rgba(0,0,0,0.4)"
                : "0 0 20px rgba(60, 200, 60, 0.3), 0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            {eventBannerCount > 0 ? (
              <div>
                <div className="text-white text-sm">
                  {eventBannerCount}건의 새로운 이벤트가 발생했습니다!
                </div>
                <div className="text-red-200 text-[10px] mt-1">
                  학생 위의 ! 를 클릭하여 대응하세요
                </div>
              </div>
            ) : (
              <div className="text-green-200 text-sm">
                이번 주는 평화로운 한 주입니다
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
