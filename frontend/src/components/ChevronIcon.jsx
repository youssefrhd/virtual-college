export default function ChevronIcon({ color }) {
  return (
    <div style={{
      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
      pointerEvents: "none", color, transition: "color 0.2s",
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}