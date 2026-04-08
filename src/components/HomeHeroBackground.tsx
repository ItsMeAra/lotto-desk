/**
 * Green mesh behind homepage content. Must sit inside a `relative isolate min-h-dvh` parent
 * (see page.tsx) — never use negative z-index here or it hides behind body background.
 */
export function HomeHeroBackground() {
  return (
    <div
      className="hero-mesh-root pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="hero-mesh-layer absolute inset-0">
        <div className="hero-mesh-blob hero-mesh-blob-a" />
        <div className="hero-mesh-blob hero-mesh-blob-b" />
        <div className="hero-mesh-blob hero-mesh-blob-c" />
      </div>
    </div>
  );
}
