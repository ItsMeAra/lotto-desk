"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type VantaEffect = { destroy: () => void };

declare global {
  interface Window {
    VANTA?: {
      HALO: (options: Record<string, unknown>) => VantaEffect;
    };
  }
}

/**
 * Vanta.js HALO — ambient WebGL behind the hero on the deep purple surface (#1f1633).
 * Skipped when user prefers reduced motion.
 */
export function VantaHaloBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    const win = window as Window & { THREE?: typeof THREE };
    win.THREE = THREE;

    let effect: VantaEffect | null = null;
    let cancelled = false;

    void (async () => {
      await import("vanta/dist/vanta.halo.min.js");
      if (cancelled || !containerRef.current) return;
      const HALO = win.VANTA?.HALO;
      if (!HALO) return;

      effect = HALO({
        el: containerRef.current,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minWidth: 200,
        minHeight: 200,
        scale: 1,
        scaleMobile: 1.15,
        backgroundColor: 0x1f1633,
        backgroundAlpha: 1,
        baseColor: 0x6a5fc1,
        color2: 0xc2ef4e,
        amplitudeFactor: 0.62,
        ringFactor: 1.15,
        rotationFactor: 0.75,
        size: 1,
        speed: 0.58,
        xOffset: 0,
        yOffset: 0.02,
        mouseEase: false,
      });
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
      effect = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 min-h-[100dvh] w-full overflow-hidden"
      aria-hidden
    />
  );
}
