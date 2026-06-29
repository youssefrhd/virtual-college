import Input from "../components/Input";
import Btn from "../components/Btn";
import Divider from "../components/Divider";
import RoleTag from "../components/RoleTag";
import FormCard from "../layout/FormCard";
import { ROLES } from "../config/roles";
import { passwortVergessen } from "../api/authApi";
import { useState } from "react";
export default function ForgotView({ role, onBack }) {
  const t = ROLES[role];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const forgotHandle = async ({ email, setLoading, setAlert, setSent }) => {
  if (!email) return setAlert({ msg: "Bitte E-Mail-Adresse eingeben.", type: "error" });
  setLoading(true);
  setAlert(null);
  try {
    await passwortVergessen({ email });
  } catch {
  } finally {
    setSent(true);          
    setLoading(false);
  }
};

  return (
    <FormCard role={role}>
      <RoleTag t={t} />
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 20px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${t.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.accent}` }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
      </div>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>Passwort zurücksetzen</h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 28, textAlign: "center", lineHeight: 1.6 }}>
        {sent ? `Ein Link wurde an ${email} gesendet. Bitte prüfe dein Postfach.` : "Gib deine E-Mail-Adresse ein, wir senden dir einen Reset-Link."}
      </p>
      {sent ? (
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "14px 16px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>✉️</div>
          <div style={{ color: "#86EFAC", fontSize: 13 }}>E-Mail wurde gesendet!</div>
        </div>
      ) : (
        <Input label="E-Mail-Adresse" type="email" value={email} onChange={setEmail} placeholder="name@hochschule.de" role={role} />
      )}
      {!sent && <div style={{ marginBottom: 20 }} />}
      {!sent && <Btn role={role} onClick={forgotHandle} loading={loading} disabled={!email}>Reset-Link senden</Btn>}
      <Divider />
      <Btn role={role} variant="ghost" onClick={onBack}>← Zurück zum Login</Btn>
    </FormCard>
  );
}