"use client";

interface ExclamationMarkProps {
  onClick: () => void;
}

export function ExclamationMark({ onClick }: ExclamationMarkProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute -top-14 left-1/2 -translate-x-1/2 cursor-pointer animate-exclamation z-10 group"
      style={{ background: "none", border: "none", padding: 0 }}
    >
      {/* Speech bubble background */}
      <div
        className="relative flex items-center justify-center"
        style={{
          background: "#ffe066",
          border: "3px solid #cc9900",
          borderRadius: "6px",
          padding: "4px 10px",
          boxShadow: "0 0 12px rgba(255, 224, 102, 0.5), 0 0 24px rgba(255, 224, 102, 0.2)",
          minWidth: 44,
        }}
      >
        {/* Exclamation text */}
        <span className="pixel-text text-base font-bold" style={{ color: "#cc2200", textShadow: "0 1px 0 rgba(0,0,0,0.2)" }}>
          !
        </span>

        {/* Bubble tail */}
        <div
          className="absolute -bottom-[8px] left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "8px solid #cc9900",
          }}
        />
        <div
          className="absolute -bottom-[5px] left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "6px solid #ffe066",
          }}
        />
      </div>

      {/* Hover hint */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] text-yellow-300 pixel-text bg-black/80 px-1 py-0.5 rounded">
          클릭하세요
        </span>
      </div>
    </button>
  );
}
