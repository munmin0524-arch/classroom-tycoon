"use client";

interface ExclamationMarkProps {
  onClick: () => void;
}

export function ExclamationMark({ onClick }: ExclamationMarkProps) {
  // Pixel art '!' rendered with box-shadow (3x7 grid)
  const shadow = [
    "1px 0px 0 #ff4444",
    "1px 1px 0 #ff4444",
    "1px 2px 0 #ff4444",
    "1px 3px 0 #ff4444",
    "1px 4px 0 #ff4444",
    "1px 6px 0 #ff4444",
  ].join(",");

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute -top-8 left-1/2 -translate-x-1/2 cursor-pointer animate-exclamation z-10 group"
      style={{ background: "none", border: "none", padding: "8px" }}
    >
      {/* Glow background */}
      <div className="absolute inset-0 rounded-full bg-yellow-400/30 group-hover:bg-yellow-400/50 blur-sm transition-colors" />
      {/* Pixel ! */}
      <div
        className="relative pixel-art"
        style={{
          width: 3 * 4,
          height: 7 * 4,
        }}
      >
        <div
          style={{
            width: 1,
            height: 1,
            boxShadow: shadow,
            transform: "scale(4)",
            transformOrigin: "top left",
          }}
        />
      </div>
    </button>
  );
}
