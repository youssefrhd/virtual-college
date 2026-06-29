import Btn from "../components/Btn";
import FormCard from "../layout/FormCard";
import { ROLES } from "../config/roles";

export default function SuccessView({ role, onBack }) {
  const t = ROLES[role];
  return (
    <FormCard role={role}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${t.accentGlow}`, border: `2px solid ${t.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Erfolgreich!</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Du bist als <span style={{ color: t.accent }}>{ROLES[role].label}</span> angemeldet.<br />Weiterleitung zum Dashboard…
        </p>
        <Btn role={role} onClick={onBack}>Zurück zum Login</Btn>
      </div>
    </FormCard>
  );
}