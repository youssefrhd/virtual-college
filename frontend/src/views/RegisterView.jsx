
import Input from "../components/Input";
import Btn from "../components/Btn";
import Alert from "../components/Alert";
import Divider from "../components/Divider";
import RoleTag from "../components/RoleTag";
import FormCard from "../layout/FormCard";
import { ROLES } from "../config/roles";
import Select from "../components/SelectDropdown";
import { registerStudent, registerProfessor } from "../api/authApi";
import { useState } from "react";
import DateInput from "../components/DateInput";

const STUDIENGAENGE = [
  { value: "Praktische Informatik", label: "Praktische Informatik" },
  { value: "Technische Informatik", label: "Technische Informatik" },
  { value: "Data Science", label: "Data Science" },
];

const TITEL_OPTIONEN = [
  { value: "Prof. Dr.", label: "Prof. Dr." },
  { value: "Prof. Dr.-Ing.", label: "Prof. Dr.-Ing." },
  { value: "Dr.", label: "Dr." },
  { value: "Dr.-Ing.", label: "Dr.-Ing." },
  { value: "M.Sc.", label: "M.Sc." },
];

export default function RegisterView({ role, onBack, onSuccess }) {
  const t = ROLES[role];

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [geburtsdatum, setGeburtsdatum] = useState("");

  const [matrikelNr, setMatrikelNr] = useState("");
  const [studiengang, setStudiengang] = useState("");
  const [semester, setSemester] = useState("");

  const [titel, setTitel] = useState("");
  const [fachbereich, setFachbereich] = useState("");
  const [persoNr, setPersoNr] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handle = async () => {
    if (
      !vorname ||
      !nachname ||
      !email ||
      !pass ||
      !pass2 ||
      !geburtsdatum
    ) {
      return setAlert({
        msg: "Bitte alle Pflichtfelder ausfüllen.",
        type: "error",
      });
    }

    if (pass !== pass2) {
      return setAlert({
        msg: "Passwörter stimmen nicht überein.",
        type: "error",
      });
    }

    if (pass.length < 8) {
      return setAlert({
        msg: "Passwort muss mindestens 8 Zeichen haben.",
        type: "error",
      });
    }

    if (role === "student") {
      if (!studiengang) {
        return setAlert({
          msg: "Bitte einen Studiengang auswählen.",
          type: "error",
        });
      }

      if (matrikelNr.length !== 7) {
        return setAlert({
          msg: "Matrikelnummer muss 7 Ziffern haben.",
          type: "error",
        });
      }
    }

    if (role === "professor") {
      if (!titel) {
        return setAlert({
          msg: "Bitte einen Titel auswählen.",
          type: "error",
        });
      }

      if (!fachbereich) {
        return setAlert({
          msg: "Bitte den Fachbereich angeben.",
          type: "error",
        });
      }

      if (persoNr.length !== 7) {
        return setAlert({
          msg: "Personalnummer muss 7 Ziffern haben.",
          type: "error",
        });
      }
    }

    setLoading(true);
    setAlert(null);

    try {
      if (role === "student") {
        await registerStudent({
          vorname,
          nachname,
          matrikelNr,
          geburtsdatum,
          email,
          passwort: pass,
          studiengang,
          semester: parseInt(semester, 10),
        });
      } else {
        await registerProfessor({
          vorname,
          nachname,
          persoNr,
          email,
          passwort: pass,
          geburtsdatum,
          titel,
          fachbereich,
        });
      }

      if (typeof onSuccess === "function") {
        onSuccess(email);
      }
    } catch (err) {
      setAlert({
        msg: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes registerEnter {
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

          .register-view {
            animation: registerEnter 0.55s ease-out forwards;
            font-family: Bahnschrift, "Segoe UI", Arial, sans-serif;
          }

          .register-line {
            animation: pulseLine 2.5s ease-in-out infinite;
          }

          .register-cursor {
            animation: blink 1s step-end infinite;
          }

          .register-field {
            transition:
              transform 0.2s ease,
              opacity 0.2s ease;
          }

          .register-field:hover {
            transform: translateY(-1px);
          }

          .register-action {
            transition:
              transform 0.2s ease,
              opacity 0.2s ease;
          }

          .register-action:hover {
            transform: translateY(-1px);
          }

          .register-action:active {
            transform: translateY(0);
          }
        `}
      </style>

      <div className="register-view">
        <FormCard role={role}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
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
                color: "rgba(255,255,255,0.35)",
              }}
            >
              02
            </span>
          </div>

          <div
            className="register-line"
            style={{
              width: 32,
              height: 1,
              background: t.accent,
              marginBottom: 18,
            }}
          />

          <h2
            style={{
              color: "#fff",
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: "0 0 8px",
            }}
          >
            Konto erstellen
            <span
              className="register-cursor"
              style={{
                color: t.accent,
                marginLeft: 3,
              }}
            >
              _
            </span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: 12,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Neues Konto für den Bereich {t.label} erstellen
          </p>

          {alert && <Alert {...alert} />}

          <div className="register-field">
            <Input
              label="Vorname"
              value={vorname}
              onChange={setVorname}
              placeholder="Max"
              role={role}
            />
          </div>

          <div className="register-field">
            <Input
              label="Nachname"
              value={nachname}
              onChange={setNachname}
              placeholder="Mustermann"
              role={role}
            />
          </div>

          {role === "student" && (
            <div className="register-field">
              <Input
                label="Matrikelnummer"
                value={matrikelNr}
                onChange={setMatrikelNr}
                placeholder="1234567"
                role={role}
              />
            </div>
          )}

          {role === "professor" && (
            <div className="register-field">
              <Input
                label="Personalnummer"
                value={persoNr}
                onChange={setPersoNr}
                placeholder="1234567"
                role={role}
              />
            </div>
          )}

          <div className="register-field">
            <DateInput
              label="Geburtsdatum"
              value={geburtsdatum}
              onChange={setGeburtsdatum}
              role={role}
            />
          </div>

          {role === "student" && (
            <>
              <div className="register-field">
                <Select
                  label="Studiengang"
                  value={studiengang}
                  onChange={setStudiengang}
                  placeholder="Studiengang auswählen …"
                  options={STUDIENGAENGE}
                  role={role}
                />
              </div>

              <div className="register-field">
                <Input
                  label="Semester"
                  type="number"
                  value={semester}
                  onChange={setSemester}
                  placeholder="1"
                  role={role}
                />
              </div>
            </>
          )}

          {role === "professor" && (
            <>
              <div className="register-field">
                <Select
                  label="Titel"
                  value={titel}
                  onChange={setTitel}
                  placeholder="Titel auswählen …"
                  options={TITEL_OPTIONEN}
                  role={role}
                />
              </div>

              <div className="register-field">
                <Input
                  label="Fachbereich"
                  value={fachbereich}
                  onChange={setFachbereich}
                  placeholder="Informatik"
                  role={role}
                />
              </div>
            </>
          )}

          <div className="register-field">
            <Input
              label="E-Mail-Adresse"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@hochschule.de"
              role={role}
            />
          </div>

          <div className="register-field">
            <Input
              label="Passwort"
              type="password"
              value={pass}
              onChange={setPass}
              placeholder="Mindestens 8 Zeichen"
              role={role}
            />
          </div>

          <div className="register-field">
            <Input
              label="Passwort bestätigen"
              type="password"
              value={pass2}
              onChange={setPass2}
              placeholder="••••••••"
              role={role}
            />
          </div>

          <div style={{ marginBottom: 20 }} />

          <div className="register-action">
            <Btn
              role={role}
              onClick={handle}
              loading={loading}
            >
              Konto erstellen
            </Btn>
          </div>

          <Divider />

          <div className="register-action">
            <Btn
              role={role}
              variant="ghost"
              onClick={onBack}
            >
              ← Zurück zum Login
            </Btn>
          </div>
        </FormCard>
      </div>
    </>
  );
}

