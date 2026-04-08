import confetti from "canvas-confetti";

/** Short burst of matcha-toned confetti after winners are drawn. Skipped when reduced motion is preferred. */
export function fireDrawWinnerConfetti(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#9fe870", "#e2f6d5", "#b8e86a", "#163300"];

  void confetti({
    particleCount: 115,
    spread: 88,
    origin: { y: 0.52 },
    colors,
    ticks: 360,
    gravity: 1.05,
    scalar: 1.05,
    zIndex: 10050,
  });

  void confetti({
    particleCount: 42,
    angle: 60,
    spread: 52,
    origin: { x: 0, y: 0.66 },
    colors,
    zIndex: 10050,
  });
  void confetti({
    particleCount: 42,
    angle: 120,
    spread: 52,
    origin: { x: 1, y: 0.66 },
    colors,
    zIndex: 10050,
  });
}
