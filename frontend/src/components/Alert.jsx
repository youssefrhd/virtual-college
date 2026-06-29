export default function Alert ({ msg, type }) {
    return (
  <div style={{
    padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13,
    background: type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
    border: `1px solid ${type === "error" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
    color: type === "error" ? "#FCA5A5" : "#86EFAC",
  }}>
    {msg}
  </div>
);
} 