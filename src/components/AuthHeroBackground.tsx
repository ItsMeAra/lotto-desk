/**
 * Slightly different mesh for auth pages (cooler + more subtle than homepage).
 * Must sit inside a `relative isolate` parent.
 */
export function AuthHeroBackground() {
  return (
    <div className="auth-mesh-root pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="hero-mesh-layer auth-mesh-layer absolute inset-0">
        <div className="hero-mesh-blob auth-mesh-blob-a" />
        <div className="hero-mesh-blob auth-mesh-blob-b" />
        <div className="hero-mesh-blob auth-mesh-blob-c" />
      </div>
    </div>
  );
}

