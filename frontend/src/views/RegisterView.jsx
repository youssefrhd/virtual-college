import Input from "../components/Input";
import Btn from "../components/Btn";
import Alert from "../components/Alert";
import Divider from "../components/Divider";
import RoleTag from "../components/RoleTag";
import FormCard from "../layout/FormCard";
import { ROLES } from "../config/roles";
import Select from "../components/SelectDropdown";
import DatePicker from "../components/DatePicker";
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
    if (!vorname || !nachname || !email || !pass || !pass2 || !geburtsdatum)
      return setAlert({
        msg: "Bitte alle Pflichtfelder ausfüllen.",
        type: "error",
      });
    if (pass !== pass2)
      return setAlert({
        msg: "Passwörter stimmen nicht überein.",
        type: "error",
      });
    if (pass.length < 8)
      return setAlert({
        msg: "Passwort muss mindestens 8 Zeichen haben.",
        type: "error",
      });

    if (role === "student") {
      if (!studiengang)
        return setAlert({
          msg: "Bitte einen Studiengang auswählen.",
          type: "error",
        });
      if (matrikelNr.length !== 7)
        return setAlert({
          msg: "Matrikelnummer muss 7 Ziffern haben.",
          type: "error",
        });
    }

    if (role === "professor") {
      if (!titel)
        return setAlert({ msg: "Bitte einen Titel auswählen.", type: "error" });
      if (!fachbereich)
        return setAlert({
          msg: "Bitte den Fachbereich angeben.",
          type: "error",
        });
      if (persoNr.length !== 7)
        return setAlert({
          msg: "Personalnummer muss 7 Ziffern haben.",
          type: "error",
        });
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

      console.log("Registrierung erfolgreich");
      console.log(email);

      if (typeof onSuccess === "function") {
        console.log("onSuccess wird aufgerufen");
        onSuccess(email);
      } else {
        console.log("onSuccess ist:", onSuccess);
      }
    } catch (err) {
      setAlert({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard role={role}>
      <RoleTag t={t} />
      <h2
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: 700,
          margin: "16px 0 4px",
        }}
      >
        Konto erstellen
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 13,
          marginBottom: 28,
        }}
      >
        Registrierung als {t.label}
      </p>

      {alert && <Alert {...alert} />}

      <Input
        label="Vorname"
        value={vorname}
        onChange={setVorname}
        placeholder="Max"
        role={role}
      />
      <Input
        label="Nachname"
        value={nachname}
        onChange={setNachname}
        placeholder="Mustermann"
        role={role}
      />

      {role === "student" && (
        <Input
          label="Matrikelnummer"
          value={matrikelNr}
          onChange={setMatrikelNr}
          placeholder="1234567"
          role={role}
        />
      )}

      {role === "professor" && (
        <Input
          label="Personalnummer"
          value={persoNr}
          onChange={setPersoNr}
          placeholder="1234567"
          role={role}
        />
      )}

      <DateInput
        label="Geburtsdatum"
        value={geburtsdatum}
        onChange={(value) => {
          console.log(value);
          setGeburtsdatum(value);
        }}
        role={role}
      />

      {role === "student" && (
        <>
          <Select
            label="Studiengang"
            value={studiengang}
            onChange={setStudiengang}
            placeholder="Studiengang auswählen …"
            options={STUDIENGAENGE}
            role={role}
          />
          <Input
            label="Semester"
            type="number"
            value={semester}
            onChange={setSemester}
            placeholder="1"
            role={role}
          />
        </>
      )}

      {role === "professor" && (
        <>
          <Select
            label="Titel"
            value={titel}
            onChange={setTitel}
            placeholder="Titel auswählen …"
            options={TITEL_OPTIONEN}
            role={role}
          />
          <Input
            label="Fachbereich"
            value={fachbereich}
            onChange={setFachbereich}
            placeholder="Informatik"
            role={role}
          />
        </>
      )}

      <Input
        label="E-Mail-Adresse"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="name@hochschule.de"
        role={role}
      />
      <Input
        label="Passwort"
        type="password"
        value={pass}
        onChange={setPass}
        placeholder="Mindestens 8 Zeichen"
        role={role}
      />
      <Input
        label="Passwort bestätigen"
        type="password"
        value={pass2}
        onChange={setPass2}
        placeholder="••••••••"
        role={role}
      />

      <div style={{ marginBottom: 20 }} />
      <Btn role={role} onClick={handle} loading={loading}>
        Konto erstellen
      </Btn>
      <Divider />
      <Btn role={role} variant="ghost" onClick={onBack}>
        ← Zurück zum Login
      </Btn>
    </FormCard>
  );
}
