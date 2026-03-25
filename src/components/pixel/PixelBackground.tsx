"use client";

import type { Region } from "@/types";

interface PixelBackgroundProps {
  region: Region;
}

export function PixelBackground({ region }: PixelBackgroundProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      data-region={region}
      style={{ zIndex: 0 }}
    >
      {/* Wall */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "40%",
          background: "var(--classroom-wall)",
          borderBottom: "4px solid #333",
        }}
      >
        {/* Window */}
        <div
          className="absolute"
          style={{
            top: "15%",
            left: "5%",
            width: "20%",
            height: "55%",
            background: "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F7FA 100%)",
            border: "4px solid var(--classroom-blackboard-border)",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.3)",
          }}
        >
          {/* Window cross */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[3px] bg-[var(--classroom-blackboard-border)] -translate-x-1/2" />
          <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-[var(--classroom-blackboard-border)] -translate-y-1/2" />
        </div>

        {/* Blackboard */}
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "35%",
            width: "45%",
            height: "65%",
            background: "var(--classroom-blackboard)",
            border: "6px solid var(--classroom-blackboard-border)",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.3), 2px 2px 0 #000",
          }}
        >
          {/* Chalk text */}
          <div className="absolute top-4 left-4 text-[10px] text-green-200/60 font-[family-name:var(--font-pixel)]">
            교실 타이쿤
          </div>
          {/* Chalk tray */}
          <div
            className="absolute -bottom-[10px] left-[5%] right-[5%] h-[8px]"
            style={{
              background: "var(--classroom-blackboard-border)",
              borderRadius: "0 0 2px 2px",
            }}
          />
        </div>

        {/* Clock */}
        <div
          className="absolute z-[4]"
          style={{
            top: "5%",
            right: "8%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#fff",
            border: "3px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 2, height: 12, background: "#333", transformOrigin: "bottom", transform: "rotate(30deg)" }} />
          <div style={{ width: 2, height: 8, background: "#333", transformOrigin: "bottom", transform: "rotate(120deg)", position: "absolute" }} />
        </div>

        {/* World map poster */}
        <div
          className="absolute"
          style={{
            top: "12%",
            left: "82%",
            width: "12%",
            height: "40%",
            background: "linear-gradient(135deg, #4a90d9 30%, #66bb6a 60%, #4a90d9 100%)",
            border: "3px solid #8B6914",
          }}
        />
      </div>

      {/* Floor */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "60%",
          background: `repeating-linear-gradient(
            90deg,
            var(--classroom-floor) 0px,
            var(--classroom-floor) 48px,
            color-mix(in srgb, var(--classroom-floor) 85%, black) 48px,
            color-mix(in srgb, var(--classroom-floor) 85%, black) 50px
          )`,
          backgroundSize: "50px 100%",
        }}
      >
        {/* Floor perspective gradient (darker at bottom = closer) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Ambient lighting overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, var(--classroom-lighting) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
