import { useState, useEffect } from "react";
import Input from "../components/Input";
import Btn from "../components/Btn";
import Divider from "../components/Divider";
import RoleTag from "../components/RoleTag";
import FormCard from "../layout/FormCard";
import { ROLES } from "../config/roles";
import { passwortZuruecksetzen } from "../api/authApi";


export default function ResetPasswordView({ role, onBack }) {
  const t = ROLES[role];

  const [token,       setToken]       = useState("");
  const [neuesPass,   setNeuesPass]   = useState("");
  const [neuesPass2,  setNeuesPass2]  = useState("");
  const [loading,     setLoading]     = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const handle = async () => {
    setAlert(null);

    if (!token)
      return setAlert({ msg: "Kein gültiger Reset-Token gefunden. Bitte den Link aus der E-Mail verwenden.", type: "error" });
    if (!neuesPass || !neuesPass2)
      return setAlert({ msg: "Bitte beide Felder ausfüllen.", type: "error" });
    if (neuesPass !== neuesPass2)
      return setAlert({ msg: "Passwörter stimmen nicht überein.", type: "error" });
    if (neuesPass.length < 8)
      return setAlert({ msg: "Passwort muss mindestens 8 Zeichen haben.", type: "error" });

    setLoading(true);
    try {
      await passwortZuruecksetzen({ token, neuesPasswort: neuesPass });
      setSuccess(true);
    } catch (err) {
      setAlert({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard role={role}>
      <RoleTag t={t} />

      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 20px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: success ? "rgba(34,197,94,0.15)" : t.accentGlow,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${success ? "rgba(34,197,94,0.5)" : t.accent}`,
          transition: "all 0.4s",
        }}>
          {success ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={t.accent} strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          )}
        </div>
      </div>

      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>
        {success ? "Passwort geändert!" : "Neues Passwort setzen"}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 28, textAlign: "center", lineHeight: 1.6 }}>
        {success
          ? "Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden."
          : "Wähle ein neues, sicheres Passwort für deinen Account."}
      </p>

      {success && (
        <div style={{
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 10, padding: "14px 16px",
          textAlign: "center", marginBottom: 20,
        }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🔐</div>
          <div style={{ color: "#86EFAC", fontSize: 13, fontWeight: 500 }}>
            Passwort erfolgreich zurückgesetzt!
          </div>
        </div>
      )}

      {/* ── Fehler-Alert ── */}
      {alert && !success && (
        <div style={{
          padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13,
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.4)",
          color: "#FCA5A5",
        }}>
          {alert.msg}
        </div>
      )}

      {/* ── Formular (nur wenn noch nicht erfolgreich) ── */}
      {!success && (
        <>
          {/* Token-Feld – nur anzeigen wenn kein Token in URL */}
          {!token && (
            <Input
              label="Reset-Token (aus E-Mail)"
              value={token}
              onChange={setToken}
              placeholder="Token aus dem Link einfügen"
              role={role}
            />
          )}

          <Input
            label="Neues Passwort"
            type="password"
            value={neuesPass}
            onChange={setNeuesPass}
            placeholder="Mindestens 8 Zeichen"
            role={role}
          />
          <Input
            label="Passwort bestätigen"
            type="password"
            value={neuesPass2}
            onChange={setNeuesPass2}
            placeholder="••••••••"
            role={role}
          />

          {/* Passwort-Stärke Indikator */}
          {neuesPass && <PasswordStrength pass={neuesPass} accent={t.accent} />}

          <div style={{ marginBottom: 20 }} />
          <Btn
            role={role}
            onClick={handle}
            loading={loading}
            disabled={!neuesPass || !neuesPass2}
          >
            Passwort speichern
          </Btn>
        </>
      )}

      <Divider />
      <Btn role={role} variant="ghost" onClick={onBack}>
        {success ? "Zum Login" : "← Abbrechen"}
      </Btn>
    </FormCard>
  );
}

/* ── Passwort-Stärke Anzeige ─────────────────────────────────────────── */
function PasswordStrength({ pass, accent }) {
  const checks = [
    { label: "Mind. 8 Zeichen",      ok: pass.length >= 8          },
    { label: "Großbuchstabe",        ok: /[A-Z]/.test(pass)        },
    { label: "Zahl",                 ok: /[0-9]/.test(pass)        },
    { label: "Sonderzeichen",        ok: /[^A-Za-z0-9]/.test(pass) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#22c55e", "#22c55e"];
  const labels = ["", "Schwach", "Mäßig", "Gut", "Stark"];

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Balken */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < score ? colors[score] : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      {/* Checks */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize: 11,
            color: c.ok ? "#86EFAC" : "rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", gap: 4,
            transition: "color 0.2s",
          }}>
            {c.ok
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3"><circle cx="12" cy="12" r="8"/></svg>
            }
            {c.label}
          </span>
        ))}
      </div>
      {score > 0 && (
        <div style={{ fontSize: 11, color: colors[score], marginTop: 4, fontWeight: 600 }}>
          {labels[score]}
        </div>
      )}
    </div>
  );
}