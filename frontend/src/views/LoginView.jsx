
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

export default function LoginView({
  role,
  onSwitch,
  onRegister,
  onForgot,
  onSuccess
}) {
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
    <>
      <style>
        {`
          @keyframes loginEnter {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulseLine {
            0%, 100% {
              opacity: 0.35;
            }
            50% {
              opacity: 1;
            }
          }

          @keyframes blink {
            0%, 45% {
              opacity: 1;
            }
            46%, 100% {
              opacity: 0;
            }
          }

          .login-view {
            animation: loginEnter 0.55s ease-out forwards;
          }

          .login-line {
            animation: pulseLine 2.5s ease-in-out infinite;
          }

          .login-cursor {
            animation: blink 1s step-end infinite;
          }

          .login-input {
            transition:
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              transform 0.25s ease;
          }

          .login-input:focus {
            transform: translateY(-1px);
            box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
          }

          .login-action {
            transition:
              transform 0.2s ease,
              opacity 0.2s ease;
          }

          .login-action:hover {
            transform: translateY(-1px);
          }

          .login-action:active {
            transform: translateY(0);
          }
        `}
      </style>

      <div
        className="login-view"
        style={{
          fontFamily:
            '"JetBrains Mono", "SFMono-Regular", Consolas, monospace'
        }}
      >
        <FormCard role={role}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18
            }}
          >
            <RoleTag t={t} />

            <span
              style={{
                fontFamily:
                  '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
                fontSize: 9,
                letterSpacing: "0.12em",
                padding: "4px 8px",
                borderRadius: 5,
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                color: "rgba(255,255,255,0.35)"
              }}
            >
              01
            </span>
          </div>

          <div
            className="login-line"
            style={{
              width: 32,
              height: 1,
              background: t.accent,
              marginBottom: 18
            }}
          />

          <h2
            style={{
              color: "#fff",
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              margin: "0 0 8px"
            }}
          >
            Willkommen zurück
            <span
              className="login-cursor"
              style={{
                color: t.accent,
                marginLeft: 3
              }}
            >
              _
            </span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: 11,
              lineHeight: 1.7,
              marginBottom: 28,
              letterSpacing: "0.01em"
            }}
          >
            // Authentifiziere dich als {t.label}
          </p>

          {alert && <Alert {...alert} />}

          <div className="login-input">
            <Input
              label="E-Mail-Adresse"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@hochschule.de"
              role={role}
            />
          </div>

          <div className="login-input">
            <Input
              label="Passwort"
              type="password"
              value={pass}
              onChange={setPass}
              placeholder="••••••••"
              role={role}
            />
          </div>

          <button
            className="login-action"
            onClick={onForgot}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: t.accent,
              fontSize: 10,
              padding: "0 0 20px",
              textAlign: "right",
              width: "100%",
              fontFamily: "inherit",
              letterSpacing: "0.02em"
            }}
          >
            Passwort vergessen?
          </button>

          <div className="login-action">
            <Btn
              role={role}
              onClick={loginHandle}
              loading={loading}
            >
              Anmelden
            </Btn>
          </div>

          <Divider />

          <div className="login-action">
            <Btn
              role={role}
              variant="ghost"
              onClick={onRegister}
            >
              Noch kein Konto? Registrieren
            </Btn>
          </div>

          <SwitchLink t={t} onSwitch={onSwitch} />
        </FormCard>
      </div>
    </>
  );
}

