/**
 * Mesh background variant for public lottery pages (similar to home, slightly calmer).
 * Must sit inside a `relative isolate` parent.
 */
export function PublicLotteryBackground() {
  return (
    <div className="public-mesh-root pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="hero-mesh-layer public-mesh-layer absolute inset-0">
        <div className="hero-mesh-blob public-mesh-blob-a" />
        <div className="hero-mesh-blob public-mesh-blob-b" />
        <div className="hero-mesh-blob public-mesh-blob-c" />
      </div>
    </div>
  );
}

