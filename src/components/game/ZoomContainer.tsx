"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";
import { useGameStore } from "@/stores/gameStore";

interface ZoomContainerProps {
  children: ReactNode;
}

export function ZoomContainer({ children }: ZoomContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { zoomTarget, zoomPhase, setZoomPhase } = useGameStore();

  const getTransform = useCallback(() => {
    if (!zoomTarget || !containerRef.current || !contentRef.current) {
      return "scale(1) translate(0px, 0px)";
    }

    const container = containerRef.current.getBoundingClientRect();
    // Find the target seat element
    const seatEl = contentRef.current.querySelector(`[data-seat="${zoomTarget.seatIndex}"]`);
    if (!seatEl) return "scale(1) translate(0px, 0px)";

    const seatRect = seatEl.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // Calculate offset relative to content
    const seatCenterX = seatRect.left - contentRect.left + seatRect.width / 2;
    const seatCenterY = seatRect.top - contentRect.top + seatRect.height / 2;

    const scale = 2.5;
    const translateX = container.width / 2 / scale - seatCenterX;
    const translateY = container.height / 2 / scale - seatCenterY;

    return `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }, [zoomTarget]);

  useEffect(() => {
    if (zoomPhase === "zooming-in" || zoomPhase === "zooming-out") {
      const timer = setTimeout(() => {
        if (zoomPhase === "zooming-in") {
          setZoomPhase("zoomed");
        } else {
          setZoomPhase("idle");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [zoomPhase, setZoomPhase]);

  const isZoomed = zoomPhase === "zooming-in" || zoomPhase === "zoomed";

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <div
        ref={contentRef}
        className="w-full h-full"
        style={{
          transform: isZoomed ? getTransform() : "scale(1) translate(0px, 0px)",
          transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
