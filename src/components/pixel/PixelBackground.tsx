"use client";

import type { Region } from "@/types";

interface PixelBackgroundProps {
  region: Region;
  classLevel?: number;
  purchasedInvestments?: string[];
}

export function PixelBackground({ region, classLevel = 1, purchasedInvestments = [] }: PixelBackgroundProps) {
  const hasLibrary = purchasedInvestments.includes("library");
  const hasArtCorner = purchasedInvestments.includes("art_corner");
  const hasRulesBoard = purchasedInvestments.includes("rules_board");

  // Lighting brightness based on level
  const lightingOpacity = 0.03 + classLevel * 0.015;
  const ambientColor = classLevel >= 4
    ? "rgba(255, 240, 200, 0.08)"
    : classLevel >= 3
    ? "rgba(220, 230, 255, 0.06)"
    : "rgba(180, 190, 220, 0.04)";

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
            background: classLevel >= 4
              ? "linear-gradient(180deg, #FFE082 0%, #FFECB3 30%, #87CEEB 50%, #B0E0E6 100%)"
              : classLevel >= 3
              ? "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F7FA 100%)"
              : "linear-gradient(180deg, #607D8B 0%, #78909C 50%, #90A4AE 100%)",
            border: "4px solid var(--classroom-blackboard-border)",
            boxShadow: classLevel >= 4
              ? "inset 0 0 30px rgba(255,240,200,0.4), 0 0 20px rgba(255,240,200,0.1)"
              : "inset 0 0 20px rgba(255,255,255,0.3)",
          }}
        >
          {/* Window cross */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[3px] bg-[var(--classroom-blackboard-border)] -translate-x-1/2" />
          <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-[var(--classroom-blackboard-border)] -translate-y-1/2" />

          {/* Curtains for level 4+ */}
          {classLevel >= 4 && (
            <>
              <div className="absolute top-0 left-0 w-[15%] h-full" style={{ background: "linear-gradient(180deg, #5C6BC0 0%, #3F51B5 100%)", opacity: 0.7 }} />
              <div className="absolute top-0 right-0 w-[15%] h-full" style={{ background: "linear-gradient(180deg, #5C6BC0 0%, #3F51B5 100%)", opacity: 0.7 }} />
            </>
          )}
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

          {/* Level-based chalk decorations */}
          {classLevel >= 2 && (
            <div className="absolute top-4 right-4 text-[8px] text-yellow-200/40 font-[family-name:var(--font-pixel)]">
              {classLevel}주차 목표
            </div>
          )}
          {classLevel >= 3 && (
            <div className="absolute bottom-6 left-4 right-4 text-[7px] text-white/20 font-[family-name:var(--font-pixel)]">
              오늘의 규칙: 서로 존중하기
            </div>
          )}

          {/* Chalk tray */}
          <div
            className="absolute -bottom-[10px] left-[5%] right-[5%] h-[8px]"
            style={{
              background: "var(--classroom-blackboard-border)",
              borderRadius: "0 0 2px 2px",
            }}
          />

          {/* Chalk pieces on tray */}
          {classLevel >= 3 && (
            <>
              <div className="absolute -bottom-[8px] left-[10%] w-4 h-[4px]" style={{ background: "#fff" }} />
              <div className="absolute -bottom-[8px] left-[20%] w-3 h-[4px]" style={{ background: "#eab308" }} />
              <div className="absolute -bottom-[8px] left-[28%] w-4 h-[4px]" style={{ background: "#ef4444" }} />
            </>
          )}
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

        {/* Bulletin board (moved left to avoid clock overlap) */}
        <div
          className="absolute"
          style={{
            top: "18%",
            right: "2%",
            width: "5%",
            height: "30%",
            background: "#D7CCC8",
            border: "3px solid #8B6914",
          }}
        >
          <div className="absolute top-2 left-1 w-3 h-2" style={{ background: "#42A5F5" }} />
          <div className="absolute top-5 left-1 w-2 h-2" style={{ background: "#ef4444" }} />
        </div>

        {/* ── Level-based wall decorations ── */}

        {/* Lv.1: Graffiti / scribbles on wall */}
        {classLevel === 1 && (
          <>
            <div className="absolute" style={{ top: "25%", left: "28%", fontSize: "8px", color: "rgba(255,100,100,0.15)", transform: "rotate(-5deg)" }}>
              ✗✗✗
            </div>
            <div className="absolute" style={{ top: "60%", left: "83%", fontSize: "6px", color: "rgba(255,255,255,0.08)", transform: "rotate(3deg)" }}>
              ㅋㅋ
            </div>
          </>
        )}

        {/* Lv.2: Basic notice board */}
        {classLevel >= 2 && (
          <div
            className="absolute"
            style={{
              top: "18%",
              left: "28%",
              width: "5%",
              height: "25%",
              background: "#D7CCC8",
              border: "2px solid #8D6E63",
            }}
          >
            <div className="absolute top-1 left-1 w-2 h-1" style={{ background: "#ef4444" }} />
            <div className="absolute top-3 left-1 w-3 h-1" style={{ background: "#42A5F5" }} />
            {classLevel >= 3 && (
              <div className="absolute top-5 left-1 w-2 h-1" style={{ background: "#66BB6A" }} />
            )}
          </div>
        )}

        {/* Lv.3: Potted plant on window sill */}
        {classLevel >= 3 && (
          <div className="absolute" style={{ top: "68%", left: "7%", zIndex: 2 }}>
            <div style={{ width: 12, height: 8, background: "#8D6E63", borderRadius: "0 0 3px 3px", margin: "0 auto" }} />
            <div style={{ width: 8, height: 12, background: "#4CAF50", borderRadius: "50% 50% 0 0", margin: "-4px auto 0" }} />
            {classLevel >= 4 && (
              <div style={{ width: 4, height: 4, background: "#FF5252", borderRadius: "50%", position: "absolute", top: -4, left: 8 }} />
            )}
          </div>
        )}

        {/* Lv.4: Student artwork display */}
        {classLevel >= 4 && (
          <div className="absolute flex gap-1" style={{ top: "15%", left: "28%", zIndex: 2 }}>
            {["#FF7043", "#42A5F5", "#66BB6A", "#FFA726"].map((color, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 20,
                  background: "#fff",
                  border: "1px solid #ccc",
                  padding: 2,
                }}
              >
                <div style={{ width: "100%", height: "100%", background: color, opacity: 0.6 }} />
              </div>
            ))}
          </div>
        )}

        {/* Lv.5: Trophy + banner */}
        {classLevel >= 5 && (
          <>
            <div className="absolute" style={{ top: "3%", left: "30%", zIndex: 3 }}>
              <div style={{ width: 16, height: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 12, height: 8, background: "#FFD700", borderRadius: "3px 3px 0 0", border: "1px solid #B8860B" }} />
                <div style={{ width: 4, height: 6, background: "#B8860B" }} />
                <div style={{ width: 10, height: 3, background: "#B8860B", borderRadius: "0 0 2px 2px" }} />
              </div>
            </div>
            {/* Celebration banner */}
            <div
              className="absolute text-center"
              style={{
                top: "2%",
                left: "40%",
                width: "30%",
                height: "6%",
                background: "linear-gradient(90deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 7,
                color: "#fff",
                fontWeight: "bold",
                opacity: 0.6,
              }}
            >
              꿈의 학급
            </div>
          </>
        )}

        {/* Rules board investment */}
        {hasRulesBoard && classLevel >= 2 && (
          <div
            className="absolute"
            style={{
              top: "20%",
              left: "28%",
              width: "5%",
              height: "30%",
              background: "#FFF9C4",
              border: "2px solid #F9A825",
              zIndex: 2,
            }}
          >
            <div className="absolute top-1 left-1 right-1 text-[4px] text-gray-700 leading-tight">
              학급규칙
            </div>
          </div>
        )}

        {/* Library investment - bookshelf on wall */}
        {hasLibrary && (
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "1%",
              width: "3%",
              height: "35%",
              background: "#5D4037",
              border: "2px solid #3E2723",
              zIndex: 2,
            }}
          >
            {/* Book spines */}
            {["#E53935", "#1E88E5", "#43A047", "#FB8C00", "#8E24AA"].map((color, i) => (
              <div
                key={i}
                style={{
                  width: "70%",
                  height: "15%",
                  background: color,
                  margin: "2px auto",
                }}
              />
            ))}
          </div>
        )}
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
        {/* Floor perspective gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(0,0,0,${classLevel >= 3 ? 0.15 : 0.3}) 0%, rgba(0,0,0,0) 100%)`,
          }}
        />

        {/* Lv.1: Trash on floor */}
        {classLevel === 1 && (
          <>
            <div className="absolute" style={{ bottom: "15%", left: "20%", width: 6, height: 4, background: "#78909C", transform: "rotate(15deg)", opacity: 0.3 }} />
            <div className="absolute" style={{ bottom: "25%", right: "30%", width: 4, height: 6, background: "#90A4AE", transform: "rotate(-10deg)", opacity: 0.25 }} />
            <div className="absolute" style={{ bottom: "40%", left: "60%", width: 5, height: 3, background: "#B0BEC5", transform: "rotate(25deg)", opacity: 0.2 }} />
          </>
        )}

        {/* Art corner investment */}
        {hasArtCorner && (
          <div
            className="absolute"
            style={{ bottom: "5%", right: "3%", zIndex: 2 }}
          >
            <div style={{ width: 30, height: 24, background: "#E8EAF6", border: "2px solid #9FA8DA", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 10 }}>🎨</span>
            </div>
          </div>
        )}
      </div>

      {/* Ambient lighting overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${ambientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Lv.5: Warm sunlight rays */}
      {classLevel >= 5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(255,240,200,0.08) 0%, transparent 40%)`,
          }}
        />
      )}

      {/* Lv.4+: Sparkle particles */}
      {classLevel >= 4 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200/30 rounded-full"
              style={{
                top: `${10 + i * 18}%`,
                left: `${5 + i * 20}%`,
                animation: `pixel-pulse ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
