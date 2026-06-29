export default function FormCard({ role, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 20,
      padding: "32px 32px 24px",
      width: "100%",
      maxWidth: 420,
      boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
      position: "relative",
      zIndex: 1,
      boxSizing: "border-box",
    }}>
      {children}
    </div>
  );
}