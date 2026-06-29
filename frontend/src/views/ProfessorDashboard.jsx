import { useState } from "react";
import { ROLES } from "../config/roles";

const T = ROLES["professor"];

/* ── Mock Data ───────────────────────────────────────────────────────── */
const KURSE = [
  { id: 1, name: "Algorithmen & Datenstrukturen", kuerzel: "ADS", studierende: 42, semester: "SS 2026", status: "aktiv",   fortschritt: 72, einheiten: 14, abgeschlossen: 10 },
  { id: 2, name: "Softwaretechnik",               kuerzel: "SWT", studierende: 38, semester: "SS 2026", status: "aktiv",   fortschritt: 55, einheiten: 12, abgeschlossen: 7  },
  { id: 3, name: "Datenbanksysteme",              kuerzel: "DBS", studierende: 56, semester: "WS 2025", status: "beendet", fortschritt: 100,einheiten: 12, abgeschlossen: 12 },
  { id: 4, name: "Verteilte Systeme",             kuerzel: "VS",  studierende: 29, semester: "WS 2025", status: "beendet", fortschritt: 100,einheiten: 10, abgeschlossen: 10 },
];

const MATERIALIEN = [
  { id: 1, kurs: "ADS", titel: "Vorlesung 10 – Graphen",       typ: "PDF",   datum: "20. Jun 2026", groesse: "2.4 MB" },
  { id: 2, kurs: "ADS", titel: "Übungsblatt 10",               typ: "PDF",   datum: "18. Jun 2026", groesse: "0.8 MB" },
  { id: 3, kurs: "SWT", titel: "Vorlesung 7 – Design Patterns",typ: "PDF",   datum: "17. Jun 2026", groesse: "3.1 MB" },
  { id: 4, kurs: "SWT", titel: "Musterlösung Blatt 6",         typ: "ZIP",   datum: "15. Jun 2026", groesse: "1.2 MB" },
  { id: 5, kurs: "ADS", titel: "Klausurzulassung Liste",       typ: "XLSX",  datum: "12. Jun 2026", groesse: "0.3 MB" },
];

const ABGABEN = [
  { student: "Anna Schmidt",   kurs: "ADS", aufgabe: "Blatt 9", abgabe: "19. Jun", note: null,  status: "ausstehend" },
  { student: "Felix Wagner",   kurs: "SWT", aufgabe: "Blatt 6", abgabe: "15. Jun", note: 1.3,   status: "bewertet"   },
  { student: "Lena Braun",     kurs: "ADS", aufgabe: "Blatt 9", abgabe: "19. Jun", note: null,  status: "ausstehend" },
  { student: "Tom Müller",     kurs: "SWT", aufgabe: "Blatt 6", abgabe: "14. Jun", note: 2.0,   status: "bewertet"   },
  { student: "Sara Hoffmann",  kurs: "ADS", aufgabe: "Blatt 9", abgabe: "20. Jun", note: null,  status: "zu spät"    },
];

/* ── Stat Card ───────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}22`, border: `1px solid ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center", color: accent, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Kurs Card ───────────────────────────────────────────────────────── */
function KursCard({ kurs, onSelect, selected }) {
  const isActive = kurs.status === "aktiv";
  return (
    <div onClick={() => onSelect(kurs)} style={{
      background: selected ? `${T.accentGlow}` : "rgba(255,255,255,0.04)",
      border: `1px solid ${selected ? T.accent+"55" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, background: `${T.accentGlow}`, border: `1px solid ${T.accent}33`, borderRadius: 6, padding: "1px 7px" }}>{kurs.kuerzel}</span>
            <span style={{ fontSize: 10, color: isActive ? "#22c55e" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>● {kurs.status.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{kurs.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{kurs.semester} · {kurs.studierende} Studierende</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>{kurs.fortschritt}%</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Fortschritt</div>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${kurs.fortschritt}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
        <span>{kurs.abgeschlossen} / {kurs.einheiten} Einheiten</span>
        <span>{kurs.einheiten - kurs.abgeschlossen} ausstehend</span>
      </div>
    </div>
  );
}

/* ── Typ Badge ───────────────────────────────────────────────────────── */
function TypBadge({ typ }) {
  const colors = { PDF: T.accent, ZIP: "#a78bfa", XLSX: "#22c55e" };
  const col = colors[typ] ?? "rgba(255,255,255,0.4)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: col, background: `${col}18`, border: `1px solid ${col}33`, borderRadius: 4, padding: "2px 6px" }}>{typ}</span>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
export default function ProfessorDashboard({ user, onNavigate }) {
  const [selectedKurs, setSelectedKurs] = useState(null);
  const [activeTab,    setActiveTab]    = useState("kurse"); // kurse | materialien | abgaben

  const aktiveKurse   = KURSE.filter(k => k.status === "aktiv");
  const gesamtStudis  = aktiveKurse.reduce((s, k) => s + k.studierende, 0);
  const offeneAbgaben = ABGABEN.filter(a => a.status === "ausstehend").length;

  return (
    <div style={{ minHeight: "100vh", background: T.bg1, fontFamily: "inherit", color: "#fff" }}>

      {/* ── Topbar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,31,26,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 24px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Virtual College</span>
        </div>

        <nav style={{ display: "flex", gap: 4 }}>
          {[
            { label: "Dashboard", view: "dashboard", active: true },
            { label: "Profil", view: "profile" },
          ].map(n => (
            <button key={n.view} onClick={() => onNavigate?.(n.view)} style={{
              background: n.active ? "rgba(217,119,6,0.12)" : "transparent",
              border: n.active ? `1px solid ${T.accent}33` : "1px solid transparent",
              borderRadius: 8, padding: "6px 14px",
              color: n.active ? T.accent : "rgba(255,255,255,0.45)",
              fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {n.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name ?? "Prof. Dr. Müller"}</div>
            <div style={{ fontSize: 11, color: T.accent }}>Informatik · Dozent</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}44, ${T.accentDim}44)`, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.accent }}>
            {(user?.name ?? "P").charAt(0)}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
            Willkommen, <span style={{ color: T.accent }}>{user?.titel ?? "Prof. Dr."} {user?.name?.split(" ").pop() ?? "Müller"}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
            Fachbereich Informatik · {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14, marginBottom: 28 }}>
          <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>} label="Aktive Kurse" value={aktiveKurse.length} sub="SS 2026" accent={T.accent} />
          <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>} label="Studierende" value={gesamtStudis} sub="in aktiven Kursen" accent="#a78bfa" />
          <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} label="Materialien" value={MATERIALIEN.length} sub="hochgeladen" accent="#22c55e" />
          <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Offene Abgaben" value={offeneAbgaben} sub="zu bewerten" accent="#f59e0b" />
        </div>

        {/* Tab Nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {[
            { key: "kurse",       label: "Meine Kurse"   },
            { key: "materialien", label: "Lernmaterialien"},
            { key: "abgaben",     label: "Abgaben"       },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: activeTab === tab.key ? T.accent : "transparent",
              color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.45)",
              fontSize: 13, fontWeight: 500, fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Kurse ── */}
        {activeTab === "kurse" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 16 }}>
            {KURSE.map(k => (
              <KursCard key={k.id} kurs={k} selected={selectedKurs?.id === k.id} onSelect={setSelectedKurs} />
            ))}
          </div>
        )}

        {/* ── Tab: Materialien ── */}
        {activeTab === "materialien" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
            {/* Upload Banner */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Lernmaterialien</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Vorlesungsfolien, Übungsblätter, Musterlösungen</div>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 7, background: T.accent, border: "none", borderRadius: 9, padding: "9px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Datei hochladen
              </button>
            </div>
            {/* Table */}
            <div style={{ padding: "0 24px" }}>
              {MATERIALIEN.map((m, i) => (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                  borderBottom: i < MATERIALIEN.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{m.titel}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{m.kurs} · {m.datum} · {m.groesse}</div>
                  </div>
                  <TypBadge typ={m.typ} />
                  <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, padding: "5px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>↓</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Abgaben ── */}
        {activeTab === "abgaben" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Studentenabgaben</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{offeneAbgaben} ausstehend · {ABGABEN.filter(a => a.status === "bewertet").length} bewertet</div>
            </div>
            <div style={{ padding: "0 24px" }}>
              {ABGABEN.map((a, i) => {
                const sc = { ausstehend: "#f59e0b", bewertet: "#22c55e", "zu spät": "#ef4444" };
                const col = sc[a.status];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < ABGABEN.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${col}22`, border: `1px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: col, flexShrink: 0 }}>
                      {a.student.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{a.student}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{a.kurs} · {a.aufgabe} · {a.abgabe}</div>
                    </div>
                    {a.note && <span style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>{a.note}</span>}
                    <span style={{ fontSize: 10, fontWeight: 600, color: col, background: `${col}18`, border: `1px solid ${col}33`, borderRadius: 20, padding: "3px 10px" }}>{a.status}</span>
                    {a.status === "ausstehend" && (
                      <button style={{ background: T.accent, border: "none", borderRadius: 7, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>Bewerten</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}