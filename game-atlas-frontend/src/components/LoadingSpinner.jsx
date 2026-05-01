// ── Skeleton primitives ──────────────────────────────────────────────────────
export const Skeleton = ({ width = "100%", height = 16, circle = false, className = "" }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: circle ? "50%" : undefined,
    }}
  />
);

// ── Game Card Skeleton ───────────────────────────────────────────────────────
export const GameCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text-sm" />
    </div>
  </div>
);

// ── Games Grid Skeleton ──────────────────────────────────────────────────────
export const GamesGridSkeleton = ({ count = 8 }) => (
  <div className="games-grid">
    {Array.from({ length: count }).map((_, i) => (
      <GameCardSkeleton key={i} />
    ))}
  </div>
);

// ── Page Loader (spinner) ────────────────────────────────────────────────────
const LoadingSpinner = ({ size = 40, color = "var(--primary-light)" }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px" }}>
    <div
      style={{
        width: size, height: size,
        border: `3px solid rgba(139,92,246,0.2)`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  </div>
);

export default LoadingSpinner;
