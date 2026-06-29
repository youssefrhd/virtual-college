import { useState } from "react";
import { ROLES } from "../config/roles";

/* ── role-aware token helper ─────────────────────────────────────────── */
const getT = role => ROLES[role] ?? ROLES["student"];

/* ── Edit-fähiges Feld ───────────────────────────────────────────────── */
function EditField({ label, value, onChange, type = "text", role, editing }) {
  const t = getT(role);
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:"0.08em", color:"rgba(255,255,255,0.4)", marginBottom:6, textTransform:"uppercase" }}>
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:"100%", padding:"11px 14px",
            background:"rgba(255,255,255,0.07)",
            border:`1px solid ${focused ? t.accent : "rgba(255,255,255,0.12)"}`,
            borderRadius:9, color:"#fff", fontSize:14, outline:"none",
            transition:"border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px ${t.accentGlow}` : "none",
            boxSizing:"border-box", fontFamily:"inherit",
          }}
        />
      ) : (
        <div style={{ fontSize:14, color: value ? "#fff" : "rgba(255,255,255,0.25)", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          {value || "—"}
        </div>
      )}
    </div>
  );
}

/* ── Avatar Upload Zone ──────────────────────────────────────────────── */
function AvatarZone({ name, role, editing }) {
  const t = getT(role);
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{ position:"relative", width:96, height:96 }}>
      {/* Ring */}
      <div style={{
        position:"absolute", inset:-3, borderRadius:"50%",
        background:`conic-gradient(${t.accent}, ${t.accentDim}, ${t.accent})`,
        animation:"spin 6s linear infinite",
      }}/>
      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:t.bg1 }}/>
      <div style={{
        position:"absolute", inset:3, borderRadius:"50%",
        background:`linear-gradient(135deg, ${t.accentGlow}, rgba(255,255,255,0.05))`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, fontWeight:800, color:t.accent,
      }}>
        {initials}
      </div>
      {editing && (
        <div style={{
          position:"absolute", inset:3, borderRadius:"50%",
          background:"rgba(0,0,0,0.65)", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", cursor:"pointer",
          gap:3,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>Ändern</span>
        </div>
      )}
    </div>
  );
}

/* ── Stat Pill ───────────────────────────────────────────────────────── */
function StatPill({ label, value, accent }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, padding:"14px 18px", textAlign:"center" }}>
      <div style={{ fontSize:20, fontWeight:700, color:accent }}>{value}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:3 }}>{label}</div>
    </div>
  );
}

/* ── Activity Row ────────────────────────────────────────────────────── */
function ActivityRow({ icon, text, time, accent }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ width:32, height:32, borderRadius:8, background:`${accent}18`, border:`1px solid ${accent}33`, display:"flex", alignItems:"center", justifyContent:"center", color:accent, flexShrink:0 }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>{text}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{time}</div>
      </div>
    </div>
  );
}

/* ── Section Wrapper ─────────────────────────────────────────────────── */
function Section({ title, sub, children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"22px 24px", marginBottom:16 }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:15, fontWeight:600 }}>{title}</div>
        {sub && <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

/* ── Topbar ──────────────────────────────────────────────────────────── */
function Topbar({ role, onNavigate, name }) {
  const t = getT(role);
  const navItems = role === "student"
    ? [{label:"Dashboard",view:"dashboard"},{label:"Studienfortschritt",view:"progress"},{label:"Profil",view:"profile",active:true}]
    : [{label:"Dashboard",view:"dashboard"},{label:"Profil",view:"profile",active:true}];

  return (
    <div style={{ position:"sticky", top:0, zIndex:50, background:`${role==="student"?"rgba(15,23,42,0.88)":"rgba(13,31,26,0.88)"}`, backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg, ${t.accent}, ${t.accentDim})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {role==="student"
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          }
        </div>
        <span style={{ fontSize:15, fontWeight:700 }}>Virtual College</span>
      </div>
      <nav style={{ display:"flex", gap:4 }}>
        {navItems.map(n => (
          <button key={n.view} onClick={()=>onNavigate?.(n.view)} style={{ background:n.active?`${t.accent}1E`:"transparent", border:n.active?`1px solid ${t.accent}33`:"1px solid transparent", borderRadius:8, padding:"6px 14px", color:n.active?t.accent:"rgba(255,255,255,0.45)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>
            {n.label}
          </button>
        ))}
      </nav>
      <div style={{ width:36, height:36, borderRadius:"50%", background:`${t.accentGlow}`, border:`2px solid ${t.accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:t.accent }}>
        {name.charAt(0)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   STUDENT PROFILE
════════════════════════════════════════════════════════════════════════ */
export function StudentProfile({ user, onNavigate, onLogout }) {
  const role = "student";
  const t    = getT(role);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    vorname:     user?.vorname     ?? "Max",
    nachname:    user?.nachname    ?? "Mustermann",
    email:       user?.email       ?? "max.mustermann@vc.de",
    telefon:     user?.telefon     ?? "",
    studiengang: user?.studiengang ?? "Praktische Informatik",
    semester:    user?.semester    ?? "4",
    matrikel:    user?.matrikel    ?? "4521337",
    geburt:      user?.geburt      ?? "2001-05-21",
    bio:         user?.bio         ?? "",
  });

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const STUDENT_ACTIVITY = [
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>, text:"Blatt 9 Algorithmen abgegeben", time:"Vor 2 Stunden",  accent:"#22c55e" },
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>, text:"Vorlesung SWT Folie 7 heruntergeladen", time:"Gestern, 18:30",  accent:t.accent },
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, text:"Prüfungsanmeldung: Maschinelles Lernen", time:"20. Jun 2026",  accent:"#f59e0b" },
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text:"Note ADS eingetragen: 1,3", time:"15. Jun 2026",  accent:"#22c55e" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:t.bg1, fontFamily:"inherit", color:"#fff" }}>
      <Topbar role={role} onNavigate={onNavigate} name={`${form.vorname} ${form.nachname}`} />

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 24px" }}>

        {/* Header Card */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"28px 32px", marginBottom:20, position:"relative", overflow:"hidden" }}>
          {/* Glow Deco */}
          <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${t.accentGlow}, transparent 70%)`, pointerEvents:"none" }}/>

          <div style={{ display:"flex", alignItems:"flex-start", gap:24, flexWrap:"wrap" }}>
            <AvatarZone name={`${form.vorname} ${form.nachname}`} role={role} editing={editing} />

            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>{form.vorname} {form.nachname}</h1>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.accent, background:`${t.accentGlow}`, border:`1px solid ${t.accent}44`, borderRadius:20, padding:"3px 10px" }}>Student</span>
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:12 }}>
                {form.studiengang} · Semester {form.semester} · Matrikel-Nr. {form.matrikel}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {form.email}
                </span>
              </div>
            </div>

            <div style={{ display:"flex", gap:8, alignSelf:"flex-start" }}>
              {editing ? (
                <>
                  <button onClick={()=>setEditing(false)} style={{ padding:"8px 18px", borderRadius:9, border:`1px solid ${t.accent}`, background:`${t.accentGlow}`, color:t.accent, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    Speichern
                  </button>
                  <button onClick={()=>setEditing(false)} style={{ padding:"8px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    Abbrechen
                  </button>
                </>
              ) : (
                <button onClick={()=>setEditing(true)} style={{ padding:"8px 18px", borderRadius:9, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:7 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Bearbeiten
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:24 }}>
            <StatPill label="ECTS" value="101"     accent={t.accent}  />
            <StatPill label="Ø Note" value="1.74"  accent="#a78bfa"   />
            <StatPill label="Semester" value="4/6"  accent="#22c55e"  />
            <StatPill label="Module" value="9/15"   accent="#f59e0b"  />
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

          {/* Persönliche Daten */}
          <Section title="Persönliche Daten" sub="Angaben zu deiner Person">
            <EditField label="Vorname"        value={form.vorname}  onChange={set("vorname")}  role={role} editing={editing} />
            <EditField label="Nachname"       value={form.nachname} onChange={set("nachname")} role={role} editing={editing} />
            <EditField label="Geburtsdatum"   value={form.geburt}   onChange={set("geburt")}   role={role} editing={editing} type="date" />
            <EditField label="Telefon"        value={form.telefon}  onChange={set("telefon")}  role={role} editing={editing} type="tel" />
          </Section>

          {/* Studiendaten */}
          <Section title="Studiendaten" sub="Informationen zu deinem Studium">
            <EditField label="E-Mail"          value={form.email}       onChange={set("email")}       role={role} editing={false} />
            <EditField label="Matrikelnummer"  value={form.matrikel}    onChange={set("matrikel")}    role={role} editing={false} />
            <EditField label="Studiengang"     value={form.studiengang} onChange={set("studiengang")} role={role} editing={false} />
            <EditField label="Aktuelles Semester" value={form.semester} onChange={set("semester")}    role={role} editing={false} />
          </Section>

          {/* Aktivitäten */}
          <Section title="Letzte Aktivitäten" sub="Deine letzten Aktionen">
            {STUDENT_ACTIVITY.map((a,i) => <ActivityRow key={i} {...a} />)}
          </Section>

          {/* Account */}
          <Section title="Account & Sicherheit" sub="Passwort und Datenschutz">
            <button style={{ width:"100%", padding:"11px 16px", borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Passwort ändern
            </button>
            <button style={{ width:"100%", padding:"11px 16px", borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:24, display:"flex", alignItems:"center", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              Benachrichtigungen verwalten
            </button>
            <button onClick={onLogout} style={{ width:"100%", padding:"11px 16px", borderRadius:9, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#FCA5A5", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Abmelden
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PROFESSOR PROFILE
════════════════════════════════════════════════════════════════════════ */
export function ProfessorProfile({ user, onNavigate, onLogout }) {
  const role = "professor";
  const t    = getT(role);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    vorname:     user?.vorname     ?? "Hans",
    nachname:    user?.nachname    ?? "Müller",
    email:       user?.email       ?? "h.mueller@vc.de",
    titel:       user?.titel       ?? "Prof. Dr.",
    fachbereich: user?.fachbereich ?? "Praktische Informatik",
    buero:       user?.buero       ?? "A2.314",
    telefon:     user?.telefon     ?? "+49 69 1234-5678",
    sprechstunde:user?.sprechstunde?? "Di 14:00–15:00",
    persoNr:     user?.persoNr     ?? "PF-0042",
    geburt:      user?.geburt      ?? "1975-03-10",
  });

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const PROF_ACTIVITY = [
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, text:"Vorlesungsfolien ADS 10 hochgeladen",    time:"Vor 1 Stunde",   accent:t.accent  },
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, text:"Note für Felix Wagner eingetragen: 1,3", time:"Gestern, 16:00", accent:"#22c55e" },
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>, text:"42 Studierende in ADS kursangemeldet",  time:"18. Jun 2026",  accent:"#a78bfa" },
    { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, text:"Klausurtermin SWT gesetzt: 21. Jul",    time:"10. Jun 2026",  accent:"#f59e0b" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:t.bg1, fontFamily:"inherit", color:"#fff" }}>
      <Topbar role={role} onNavigate={onNavigate} name={`${form.titel} ${form.nachname}`} />

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 24px" }}>

        {/* Header Card */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"28px 32px", marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${t.accentGlow}, transparent 70%)`, pointerEvents:"none" }}/>

          <div style={{ display:"flex", alignItems:"flex-start", gap:24, flexWrap:"wrap" }}>
            <AvatarZone name={`${form.vorname} ${form.nachname}`} role={role} editing={editing} />
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>{form.titel} {form.vorname} {form.nachname}</h1>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:t.accent, background:`${t.accentGlow}`, border:`1px solid ${t.accent}44`, borderRadius:20, padding:"3px 10px" }}>Professor</span>
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:12 }}>
                {form.fachbereich} · Büro {form.buero} · Sprechstunde: {form.sprechstunde}
              </div>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", gap:5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {form.email}
              </span>
            </div>
            <div style={{ display:"flex", gap:8, alignSelf:"flex-start" }}>
              {editing ? (
                <>
                  <button onClick={()=>setEditing(false)} style={{ padding:"8px 18px", borderRadius:9, border:`1px solid ${t.accent}`, background:`${t.accentGlow}`, color:t.accent, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Speichern</button>
                  <button onClick={()=>setEditing(false)} style={{ padding:"8px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Abbrechen</button>
                </>
              ) : (
                <button onClick={()=>setEditing(true)} style={{ padding:"8px 18px", borderRadius:9, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:7 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Bearbeiten
                </button>
              )}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:24 }}>
            <StatPill label="Aktive Kurse"   value="2"   accent={t.accent}  />
            <StatPill label="Studierende"     value="80"  accent="#a78bfa"   />
            <StatPill label="Materialien"     value="5"   accent="#22c55e"   />
            <StatPill label="Offene Abgaben"  value="3"   accent="#f59e0b"   />
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Section title="Persönliche Daten">
            <EditField label="Vorname"      value={form.vorname}  onChange={set("vorname")}  role={role} editing={editing} />
            <EditField label="Nachname"     value={form.nachname} onChange={set("nachname")} role={role} editing={editing} />
            <EditField label="Geburtsdatum" value={form.geburt}   onChange={set("geburt")}   role={role} editing={editing} type="date" />
            <EditField label="Telefon"      value={form.telefon}  onChange={set("telefon")}  role={role} editing={editing} type="tel" />
          </Section>

          <Section title="Dienstliche Daten">
            <EditField label="E-Mail"         value={form.email}        onChange={set("email")}        role={role} editing={false} />
            <EditField label="Personalnummer" value={form.persoNr}      onChange={set("persoNr")}      role={role} editing={false} />
            <EditField label="Fachbereich"    value={form.fachbereich}  onChange={set("fachbereich")}  role={role} editing={editing} />
            <EditField label="Büro"           value={form.buero}        onChange={set("buero")}        role={role} editing={editing} />
            <EditField label="Sprechstunde"   value={form.sprechstunde} onChange={set("sprechstunde")} role={role} editing={editing} />
          </Section>

          <Section title="Letzte Aktivitäten">
            {PROF_ACTIVITY.map((a,i) => <ActivityRow key={i} {...a} />)}
          </Section>

          <Section title="Account & Sicherheit">
            <button style={{ width:"100%", padding:"11px 16px", borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Passwort ändern
            </button>
            <button style={{ width:"100%", padding:"11px 16px", borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:24, display:"flex", alignItems:"center", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              Benachrichtigungen verwalten
            </button>
            <button onClick={onLogout} style={{ width:"100%", padding:"11px 16px", borderRadius:9, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#FCA5A5", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Abmelden
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}