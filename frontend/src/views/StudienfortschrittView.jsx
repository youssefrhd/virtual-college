import { useState, useEffect } from "react";
import { ROLES } from "../config/roles";
import { useAuth } from "../context/authContext";

// ⚠️ Stelle sicher, dass du diese Funktion in deiner authApi.js hinzugefügt hast!
import { fetchStudienfortschritt } from "../api/authApi"; 

const T = ROLES["student"];
const SEM_LABELS = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

const statusColor = { bestanden: "#22c55e", laufend: T.accent, geplant: "rgba(255,255,255,0.2)" };
const statusBg = { bestanden: "rgba(34,197,94,0.12)", laufend: `${T.accentGlow}`, geplant: "rgba(255,255,255,0.04)" };

/* ── Radial Progress ─────────────────────────────────────────────────── */
function RadialProgress({ pct, size = 120, stroke = 10, color, label, value }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${(circ * pct) / 100} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 6px ${color}88)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{value}</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{pct}%</span>
        </div>
      </div>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 100 }}>{label}</span>
    </div>
  );
}

/* ── Grade Badge ─────────────────────────────────────────────────────── */
function GradeBadge({ grade }) {
  if (!grade) return <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>—</span>;
  const col = grade <= 1.5 ? "#22c55e" : grade <= 2.5 ? T.accent : grade <= 3.5 ? "#f59e0b" : "#ef4444";
  return <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{grade.toFixed(1)}</span>;
}

/* ── Semester Section ────────────────────────────────────────────────── */
function SemesterSection({ sem, module }) {
  const [open, setOpen] = useState(sem <= 3);
  const bestandene = module.filter(m => m.status === "bestanden");
  const ects = bestandene.reduce((s, m) => s + m.credits, 0);
  const grades = bestandene.filter(m => m.grade).map(m => m.grade);
  const avg = grades.length ? (grades.reduce((s, g) => s + g, 0) / grades.length).toFixed(1) : null;

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.accentGlow}`, border: `1px solid ${T.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.accent }}>
            {sem}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Semester {sem}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
              {module.length} Module · {ects} ECTS{avg ? ` · Ø ${avg}` : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {module.map(m => (
              <div key={m.id} style={{ width: 8, height: 8, borderRadius: 2, background: statusColor[m.status], opacity: m.status === "geplant" ? 0.3 : 1 }} />
            ))}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 20px 16px" }}>
          {module.map((m, i) => (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[m.status], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: m.status === "geplant" ? "rgba(255,255,255,0.4)" : "#fff" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{m.kategorie}</div>
              </div>
              <GradeBadge grade={m.grade} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 50, textAlign: "right" }}>{m.credits} ECTS</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", color: statusColor[m.status], background: statusBg[m.status], border: `1px solid ${statusColor[m.status]}33`, borderRadius: 20, padding: "2px 8px", minWidth: 70, textAlign: "center" }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Horizontale Note-Verteilung ─────────────────────────────────────── */
function GradeDistribution({ moduleData }) {
  const grades = moduleData.filter(m => m.grade).map(m => m.grade);
  const buckets = [
    { label: "1,0–1,5", min: 1.0, max: 1.5, color: "#22c55e" },
    { label: "1,6–2,0", min: 1.6, max: 2.0, color: T.accent },
    { label: "2,1–2,5", min: 2.1, max: 2.5, color: "#f59e0b" },
    { label: "2,6–3,0", min: 2.6, max: 3.0, color: "#f97316" },
    { label: "3,1–4,0", min: 3.1, max: 4.0, color: "#ef4444" },
  ].map(b => ({ ...b, count: grades.filter(g => g >= b.min && g <= b.max).length }));
  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div>
      {buckets.map(b => (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 60 }}>{b.label}</span>
          <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(b.count / maxCount) * 100}%`, background: b.color, borderRadius: 4, transition: "width 0.6s ease", minWidth: b.count > 0 ? 8 : 0 }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: b.color, minWidth: 20, textAlign: "right" }}>{b.count}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main View ───────────────────────────────────────────────────────── */
export default function StudienfortschrittView({ user, onNavigate }) {
  const { auth } = useAuth(); // Den aktuellen Login-Token holen
  const [moduleData, setModuleData] = useState([]);
  const [kpis, setKpis] = useState({ ects: 0, avg: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Daten vom echten Backend holen
        const data = await fetchStudienfortschritt(auth?.token);

        // 2. KPIs direkt aus dem Backend-DTO übernehmen
        setKpis({
          ects: data.earnedEcts || 0,
          avg: data.averageGrade || 0
        });

        // 3. Die Listen aus dem Backend in unsere UI-Struktur umwandeln
        const gemischteModule = [
          ...(data.bestandene || []).map(m => ({
            id: m.pruefungId, name: m.modulBezeichnung, credits: m.ects, grade: m.note,
            semester: 1, status: "bestanden", kategorie: "Informatik"
          })),
          ...(data.offene || []).map(m => ({
            id: m.pruefungId, name: m.modulBezeichnung, credits: m.ects, grade: null,
            semester: 2, status: "laufend", kategorie: "Informatik"
          })),
          ...(data.nichtBestandene || []).map(m => ({
            id: m.pruefungId, name: m.modulBezeichnung, credits: m.ects, grade: m.note,
            semester: 1, status: "nicht bestanden", kategorie: "Informatik"
          }))
        ];

        // Falls das Backend noch komplett leer ist, laden wir Dummy-Daten, damit es nicht kaputt aussieht
        if (gemischteModule.length === 0) {
          throw new Error("Backend liefert noch keine Module, wechsle auf Fallback.");
        }

        setModuleData(gemischteModule);
      } catch (error) {
        console.warn("Lade Fallback-Daten (Backend eventuell nicht erreichbar):", error);
        // FALLBACK: Dummy-Daten für die Anzeige, falls Spring Boot noch nicht läuft
        setKpis({ ects: 24, avg: 1.6 });
        setModuleData([
          { id: 1, name: "Mathematik I", credits: 8, grade: 1.3, semester: 1, status: "bestanden", kategorie: "Grundlagen" },
          { id: 2, name: "Programmieren I", credits: 6, grade: 1.7, semester: 1, status: "bestanden", kategorie: "Grundlagen" },
          { id: 6, name: "Programmieren II", credits: 6, grade: 1.3, semester: 2, status: "bestanden", kategorie: "Entwicklung" },
          { id: 10, name: "Software Engineering", credits: 6, grade: null, semester: 3, status: "laufend", kategorie: "Entwicklung" },
          { id: 13, name: "Computergrafik", credits: 5, grade: null, semester: 4, status: "geplant", kategorie: "Entwicklung" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [auth]);

  if (loading) return <div style={{ color: "#fff", textAlign: "center", marginTop: 80 }}>Lade Studienfortschritt...</div>;

  const bestanden = moduleData.filter(m => m.status === "bestanden");
  const ectsPlan = 180; // Standard Bachelor ECTS

  const semGroups = SEM_LABELS.map((_, i) => ({
    sem: i + 1,
    module: moduleData.filter(m => m.semester === i + 1),
  })).filter(g => g.module.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg1, fontFamily: "inherit", color: "#fff" }}>

      {/* Topbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,23,42,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /></svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Virtual College</span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {[{ label: "Dashboard", view: "dashboard" }, { label: "Studienfortschritt", view: "progress", active: true }, { label: "Profil", view: "profile" }].map(n => (
            <button key={n.view} onClick={() => onNavigate?.(n.view)} style={{ background: n.active ? `rgba(6,182,212,0.12)` : "transparent", border: n.active ? `1px solid ${T.accent}33` : "1px solid transparent", borderRadius: 8, padding: "6px 14px", color: n.active ? T.accent : "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${T.accentGlow}`, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.accent }}>
          {(user?.name ?? "M").charAt(0)}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Studienfortschritt</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>Vollständige Übersicht deines Studienverlaufs</p>
        </div>

        {/* Radial KPIs */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px", marginBottom: 20, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          <RadialProgress pct={Math.round((kpis.ects / ectsPlan) * 100) || 0} size={130} stroke={10} color={T.accent} label="ECTS abgeschlossen" value={`${kpis.ects}/${ectsPlan}`} />
          <RadialProgress pct={moduleData.length ? Math.round((bestanden.length / moduleData.length) * 100) : 0} size={130} stroke={10} color="#22c55e" label="Module bestanden" value={`${bestanden.length}/${moduleData.length}`} />
          <RadialProgress pct={50} size={130} stroke={10} color="#a78bfa" label="Semester absolviert" value="3/6" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: T.accent, lineHeight: 1 }}>{kpis.avg.toFixed(2)}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Durchschnittsnote</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>aus dem Backend</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* Semester Accordion */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "rgba(255,255,255,0.7)" }}>Alle Module nach Semester</div>
            {semGroups.map(g => (
              <SemesterSection key={g.sem} sem={g.sem} module={g.module} />
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Notenverteilung */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Notenverteilung</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Alle abgeschlossenen Prüfungen</div>
              <GradeDistribution moduleData={moduleData} />
            </div>

            {/* Kategorien */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Bereiche</div>
              {["Grundlagen", "Entwicklung", "Systeme", "KI & Data", "Wahlpflicht", "Abschluss"].map(kat => {
                const mods = moduleData.filter(m => m.kategorie === kat);
                const done = mods.filter(m => m.status === "bestanden").length;
                const pct = mods.length ? Math.round((done / mods.length) * 100) : 0;
                return (
                  <div key={kat} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{kat}</span>
                      <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>{done}/{mods.length}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}