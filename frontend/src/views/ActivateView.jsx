import { useState } from "react";
import { ROLES } from "../config/roles";
import { activate } from "../api/authApi";
import CodeInput from "../components/CodeInput"
import ResendTimer from "../components/resendTimer"

export default function ActivateView({ role, email = "", onBack, onSuccess }) {
  const t = ROLES[role];
  const [code,    setCode]    = useState("");
  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState(null);
 
  const isComplete = code.replace(/\D/g, "").length === 6;
 
  const handle = async () => {
    if (!isComplete) return setAlert({ msg: "Bitte den vollständigen 6-stelligen Code eingeben.", type: "error" });
    setLoading(true);
    setAlert(null);
    try {
      await activate({ email, code });
      onSuccess?.();
    } catch (err) {
      setAlert({ msg: err.message, type: "error" });
      setCode("");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ color: t.accent }}>{t.icon}</div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent }}>
          {t.tag}
        </span>
      </div>
 
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 20px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: t.accentGlow,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${t.accent}`,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
      </div>
 
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>
        E-Mail bestätigen
      </h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 4, textAlign: "center", lineHeight: 1.6 }}>
        Wir haben einen 6-stelligen Code an
      </p>
      <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>
        {email || "deine E-Mail-Adresse"}
      </p>
 
      {alert && (
        <div style={{
          padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13,
          background: alert.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
          border: `1px solid ${alert.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
          color: alert.type === "error" ? "#FCA5A5" : "#86EFAC",
        }}>
          {alert.msg}
        </div>
      )}
 
      <CodeInput value={code} onChange={setCode} role={role} />
 
      <ResendTimer role={role} email={email} />
 
      <button
        onClick={handle}
        disabled={!isComplete || loading}
        onMouseEnter={e => {
          if (!(!isComplete || loading)) e.currentTarget.style.background = t.accentDim;
          if (!(!isComplete || loading)) e.currentTarget.style.boxShadow = `0 4px 20px ${t.accentGlow}`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = t.accent;
          e.currentTarget.style.boxShadow = "none";
        }}
        style={{
          width: "100%", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          cursor: !isComplete || loading ? "not-allowed" : "pointer",
          border: "none", transition: "all 0.2s", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: t.accent, color: "#fff",
          opacity: !isComplete || loading ? 0.6 : 1,
          boxShadow: "none",
        }}
      >
        {loading ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        ) : "Account aktivieren"}
      </button>
 
      <div style={{ height: 12 }} />
      <button
        onClick={onBack}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        style={{
          width: "100%", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "transparent", color: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        ← Zurück zum Login
      </button>
    </>
  );
}