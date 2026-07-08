import React, { useEffect, useMemo, useState } from "react";
import { getStudienfortschritt } from "../api/authApi"; // Pfad ggf. anpassen

const T = {
  bg1: "#0f172a",
  accent: "#06b6d4",
  accentDim: "#0891b2",
  accentGlow: "rgba(6,182,212,0.15)",
};

function RadialProgress({ pct, size = 120, stroke = 10, color, label, value }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size}>
        <circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div style={{ marginTop: -92, fontSize: 24, fontWeight: 800 }}>{pct}%</div>
      <div style={{ marginTop: 48, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function GradeDistribution({ moduleData }) {
  const grades = moduleData
    .filter(m => m.note !== null && m.note !== undefined)
    .map(m => m.note);

  const buckets = [
    { label: "1.0 - 1.5", count: grades.filter(g => g >= 1.0 && g <= 1.5).length },
    { label: "1.6 - 2.5", count: grades.filter(g => g > 1.5 && g <= 2.5).length },
    { label: "2.6 - 3.5", count: grades.filter(g => g > 2.5 && g <= 3.5).length },
    { label: "3.6 - 4.0", count: grades.filter(g => g > 3.5 && g <= 4.0).length },
    { label: "5.0", count: grades.filter(g => g === 5.0).length },
  ];

  const max = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {buckets.map(b => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{b.label}</span>
            <span style={{ fontSize: 12, color: T.accent }}>{b.count}</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 999 }}>
            <div
              style={{
                width: `${(b.count / max) * 100}%`,
                height: "100%",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SemesterSection({ sem, module }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        marginBottom: 14,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 18px",
          cursor: "pointer",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        <span>{sem}</span>
        <span style={{ color: "rgba(255,255,255,0.45)" }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px 18px" }}>
          {module.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
              Keine Prüfungen vorhanden.
            </div>
          ) : (
            module.map((m, i) => (
              <div
                key={`${m.pruefungId}-${i}`}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{m.modulBezeichnung}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                      {m.pruefungsBezeichnung}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{m.ects ?? 0} ECTS</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                      {m.note ? `Note ${m.note}` : m.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function statusToFrontend(status) {
  if (!status) return "offen";

  const s = String(status).toUpperCase();

  if (s.includes("BESTANDEN") || s.includes("PASSED")) return "bestanden";
  if (s.includes("NICHT") || s.includes("FAILED")) return "nicht_bestanden";
  return "offen";
}

function groupBySemester(exams) {
  // Da dein Backend aktuell kein Semester im DTO liefert,
  // gruppieren wir zunächst alles in "Prüfungen".
  // Wenn du später `semester` im DTO ergänzt, kann man hier sauber nach Semester gruppieren.
  return [
    {
      sem: "Prüfungen",
      module: exams,
    },
  ];
}

export default function StudienfortschrittView({ onNavigate, user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudienfortschritt();

        if (!mounted) return;
        setProgress(data);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Studienfortschritt konnte nicht geladen werden.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const allExams = useMemo(() => {
    if (!progress) return [];

    const bestanden = (progress.bestandenePruefungen || []).map(p => ({
      ...p,
      status: statusToFrontend(p.status || "BESTANDEN"),
    }));

    const nichtBestanden = (progress.nichtBestandenePruefungen || []).map(p => ({
      ...p,
      status: statusToFrontend(p.status || "NICHT_BESTANDEN"),
    }));

    const offene = (progress.offenePruefungen || []).map(p => ({
      ...p,
      status: statusToFrontend(p.status || "OFFEN"),
    }));

    return [...bestanden, ...nichtBestanden, ...offene];
  }, [progress]);

  const bestanden = useMemo(
    () => allExams.filter(m => m.status === "bestanden"),
    [allExams]
  );

  const semGroups = useMemo(() => groupBySemester(allExams), [allExams]);

  const kpis = useMemo(() => {
    return {
      ects: progress?.earnedEcts ?? 0,
      avg: progress?.averageGrade ?? 0,
      passed: progress?.passedExams ?? 0,
      failed: progress?.failedExams ?? 0,
      open: progress?.openExams ?? 0,
    };
  }, [progress]);

  // Kannst du später auch aus Backend holen
  const ectsPlan = 180;

  const moduleData = allExams.map(p => ({
    pruefungId: p.pruefungId,
    modulId: p.modulId,
    modulBezeichnung: p.modulBezeichnung,
    pruefungsBezeichnung: p.pruefungsBezeichnung,
    ects: p.ects ?? 0,
    note: p.note ?? null,
    status: p.status,
    // Platzhalter, weil dein Backend aktuell keine Kategorie liefert
    kategorie: "Grundlagen",
  }));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg1, color: "#fff", padding: 40 }}>
        Lade Studienfortschritt...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg1, color: "#fff", padding: 40 }}>
        Fehler: {error}
      </div>
    );
  }

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
          {[
            { label: "Dashboard", view: "dashboard" },
            { label: "Studienfortschritt", view: "progress", active: true },
            { label: "Profil", view: "profile" }
          ].map(n => (
            <button
              key={n.view}
              onClick={() => onNavigate?.(n.view)}
              style={{
                background: n.active ? `rgba(6,182,212,0.12)` : "transparent",
                border: n.active ? `1px solid ${T.accent}33` : "1px solid transparent",
                borderRadius: 8,
                padding: "6px 14px",
                color: n.active ? T.accent : "rgba(255,255,255,0.45)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
            >
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
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
            Vollständige Übersicht deines Studienverlaufs
          </p>
        </div>

        {/* Radial KPIs */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px", marginBottom: 20, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          <RadialProgress
            pct={Math.round((kpis.ects / ectsPlan) * 100) || 0}
            size={130}
            stroke={10}
            color={T.accent}
            label="ECTS abgeschlossen"
            value={`${kpis.ects}/${ectsPlan}`}
          />

          <RadialProgress
            pct={allExams.length ? Math.round((kpis.passed / allExams.length) * 100) : 0}
            size={130}
            stroke={10}
            color="#22c55e"
            label="Prüfungen bestanden"
            value={`${kpis.passed}/${allExams.length}`}
          />

          <RadialProgress
            pct={allExams.length ? Math.round((kpis.open / allExams.length) * 100) : 0}
            size={130}
            stroke={10}
            color="#a78bfa"
            label="Offene Prüfungen"
            value={`${kpis.open}/${allExams.length}`}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: T.accent, lineHeight: 1 }}>
              {kpis.avg.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Durchschnittsnote</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>aus dem Backend</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* Prüfungen / Semester */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "rgba(255,255,255,0.7)" }}>
              Prüfungsübersicht
            </div>

            {semGroups.map(g => (
              <SemesterSection key={g.sem} sem={g.sem} module={g.module} />
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Notenverteilung */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Notenverteilung</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                Alle abgeschlossenen Prüfungen
              </div>
              <GradeDistribution moduleData={moduleData.filter(m => m.note !== null)} />
            </div>

            {/* Statistiken */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Zusammenfassung</div>

              {[
                { label: "Bestanden", value: kpis.passed },
                { label: "Nicht bestanden", value: kpis.failed },
                { label: "Offen", value: kpis.open },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>{item.value}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${allExams.length ? Math.round((item.value / allExams.length) * 100) : 0}%`,
                        background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`,
                        borderRadius: 3,
                        transition: "width 0.6s ease"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}