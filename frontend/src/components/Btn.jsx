import { useState } from "react";
import Spinner from "./Spinner";
import { ROLES } from "../config/roles";


export default function Btn  ({ children, onClick, variant = "primary", role, disabled, loading }) {
  const t = ROLES[role];
  const [hover, setHover] = useState(false);
  const base = {
    width: "100%", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.2s",
    fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  };
  const styles = variant === "primary"
    ? { ...base, background: hover && !disabled ? t.accentDim : t.accent, color: "#fff", opacity: disabled ? 0.6 : 1, boxShadow: hover && !disabled ? `0 4px 20px ${t.accentGlow}` : "none" }
    : { ...base, background: hover ? "rgba(255,255,255,0.08)" : "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" };
  return (
    <button style={styles} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} disabled={disabled}>
      {loading ? <Spinner /> : children}
    </button>
  );
};