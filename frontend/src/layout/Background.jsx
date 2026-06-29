import { ROLES } from "../config/roles";

export default  function Background({ role }) {
  const t = ROLES[role];
  return (
    <div style={{ position: "fixed", inset: 0, background: t.bg1, transition: "background 0.8s", zIndex: 0, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5,
        background: `radial-gradient(ellipse 80% 60% at 20% 10%, ${t.bg2}CC, transparent),
                     radial-gradient(ellipse 60% 80% at 80% 90%, ${t.bg3}99, transparent),
                     radial-gradient(ellipse 40% 40% at 50% 50%, ${t.accentGlow}, transparent)`,
        transition: "all 0.8s",
      }} />
      {}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.accentGlow}, transparent 70%)`,
        top: -100, right: -100, animation: "float1 8s ease-in-out infinite", transition: "all 0.8s",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.bg2}88, transparent 70%)`,
        bottom: -50, left: -80, animation: "float2 10s ease-in-out infinite", transition: "all 0.8s",
      }} />
      {}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
