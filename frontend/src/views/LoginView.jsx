import Input from "../components/Input";
import Btn from "../components/Btn";
import Alert from "../components/Alert";
import Divider from "../components/Divider";
import RoleTag from "../components/RoleTag";
import SwitchLink from "../components/SwitchLink";
import FormCard from "../layout/FormCard";
import { ROLES } from "../config/roles";
import { useState } from "react";
import { login } from "../api/authApi";
import { useAuth } from "../context/authContext";

export default function LoginView({ role, onSwitch, onRegister, onForgot, onSuccess }) {
  const t = ROLES[role];
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { saveAuth } = useAuth();

  const loginHandle = async () => {

  if (!email || !pass) {
    setAlert({
      msg: "Bitte E-Mail und Passwort ausfüllen.",
      type: "error"
    });
    return;
  }

  setLoading(true);
  setAlert(null);

  try {

    const data = await login({
      email,
      passwort: pass
    });

    saveAuth(data);

    if (onSuccess) {
      onSuccess(data);
    }

  } catch (err) {

    setAlert({
      msg: err.message || "Login fehlgeschlagen",
      type: "error"
    });

  } finally {
    setLoading(false);
  }
};

  return (
    <FormCard role={role}>
      <RoleTag t={t} />
      <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "16px 0 4px" }}>Willkommen zurück</h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 28 }}>Melde dich als {t.label} an</p>
      {alert && <Alert {...alert} />}
      <Input label="E-Mail-Adresse" type="email" value={email} onChange={setEmail} placeholder="name@hochschule.de" role={role} />
      <Input label="Passwort" type="password" value={pass} onChange={setPass} placeholder="••••••••" role={role} />
      <button onClick={onForgot} style={{ background: "none", border: "none", cursor: "pointer", color: t.accent, fontSize: 12, padding: "0 0 20px", textAlign: "right", width: "100%", fontFamily: "inherit" }}>
        Passwort vergessen?
      </button>
      <Btn role={role} onClick={loginHandle} loading={loading}>Anmelden</Btn>
      <Divider />
      <Btn role={role} variant="ghost" onClick={onRegister}>Noch kein Konto? Registrieren</Btn>
      <SwitchLink t={t} onSwitch={onSwitch} />
    </FormCard>
  );
}