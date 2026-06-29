export default function RoleTag({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ color: t.accent }}>{t.icon}</div>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent }}>{t.tag}</span>
    </div>
  );
}