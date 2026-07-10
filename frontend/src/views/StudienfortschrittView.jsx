import React, { useEffect, useMemo, useState } from "react";
import { getStudienfortschritt } from "../api/authApi";


const T = {
  bg1: "#0f172a",
  accent: "#06b6d4",
  accentDim: "#0891b2",
  accentGlow: "rgba(6,182,212,0.15)",
  success: "#22c55e",
  danger: "#ef4444",
};

function RadialProgress({ pct, size = 120, stroke = 10, color, label, value }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePct = Number.isFinite(pct) ? Math.min(Math.max(pct, 0), 100) : 0;
  const progress = circumference - (safePct / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          <circle stroke="rgba(255,255,255,0.08)" fill="transparent" strokeWidth={stroke}
            r={radius} cx={size / 2} cy={size / 2} />
          <circle stroke={color} fill="transparent" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={progress}
            r={radius} cx={size / 2} cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>
          {safePct}%
        </div>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function GradeDistribution({ grades }) {
  const buckets = [
    { label: "1.0 - 1.5", count: grades.filter(g => g >= 1.0 && g <= 1.5).length },
    { label: "1.6 - 2.5", count: grades.filter(g => g > 1.5 && g <= 2.5).length },
    { label: "2.6 - 3.5", count: grades.filter(g => g > 2.5 && g <= 3.5).length },
    { label: "3.6 - 4.0", count: grades.filter(g => g > 3.5 && g <= 4.0).length },
    { label: "5.0", count: grades.filter(g => g === 5.0).length },
  ];
  const max = Math.max(...buckets.map(b => b.count), 1);

  if (grades.length === 0) {
    return <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Noch keine benoteten Prüfungen.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {buckets.map(b => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{b.label}</span>
            <span style={{ fontSize: 12, color: T.accent }}>{b.count}</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 999 }}>
            <div style={{
              width: `${(b.count / max) * 100}%`, height: "100%", borderRadius: 999,
              background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExamSection({ title, exams, color, emptyText }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, marginBottom: 14, overflow: "hidden",
    }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: "100%", background: "transparent", border: "none", color: "#fff",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 18px", cursor: "pointer", fontSize: 15, fontWeight: 700,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
          {title}
          <span style={{
            fontSize: 11, fontWeight: 600, color, background: `${color}22`,
            border: `1px solid ${color}44`, borderRadius: 20, padding: "1px 8px",
          }}>
            {exams.length}
          </span>
        </span>
        <span style={{ color: "rgba(255,255,255,0.45)" }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px 18px" }}>
          {exams.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{emptyText}</div>
          ) : (
            exams.map((m, i) => (
              <div key={`${m.pruefungId ?? i}`} style={{
                padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)", marginBottom: 10,
                display: "flex", justifyContent: "space-between", gap: 12,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.modulBezeichnung ?? "Unbekanntes Modul"}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                    {m.pruefungsBezeichnung ?? ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{m.ects ?? 0} ECTS</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    {m.note != null ? `Note ${m.note}` : "offen"}
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

export default function StudienfortschrittView({ onNavigate, user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getStudienfortschritt();
        if (mounted) setProgress(data);
      } catch (err) {
        if (mounted) setError(err.message || "Studienfortschritt konnte nicht geladen werden.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const bestanden = progress?.bestandenePruefungen ?? [];
  const nichtBestanden = progress?.nichtBestandenePruefungen ?? [];
  const offen = progress?.offenePruefungen ?? [];

  const kpis = {
    ects: progress?.earnedEcts ?? 0,
    avg: progress?.averageGrade ?? 0,
    passed: progress?.passedExams ?? bestanden.length,
    failed: progress?.failedExams ?? nichtBestanden.length,
    open: progress?.openExams ?? offen.length,
  };
  const totalExams = kpis.passed + kpis.failed + kpis.open;
  const ectsPlan = 180; // ggf. später vom Backend liefern lassen

  const grades = useMemo(
    () => [...bestanden, ...nichtBestanden].map(p => p.note).filter(n => n != null),
    [bestanden, nichtBestanden]
  );

  if (loading) {
    return <div style={{ minHeight: "100vh", background: T.bg1, color: "#fff", padding: 40 }}>Lade Studienfortschritt...</div>;
  }
  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg1, color: "#fff", padding: 40 }}>
        <div style={{ color: T.danger, marginBottom: 12 }}>Fehler: {error}</div>
        <button onClick={() => onNavigate?.("dashboard")} style={{
          background: "transparent", border: `1px solid ${T.accent}`, color: T.accent,
          borderRadius: 8, padding: "8px 16px", cursor: "pointer",
        }}>Zurück zum Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg1, fontFamily: "inherit", color: "#fff" }}>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Studienfortschritt</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
            Vollständige Übersicht deines Studienverlaufs
          </p>
        </div>

        {totalExams === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            Es liegen aktuell keine Prüfungsdaten vor.
          </div>
        ) : (
          <>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px", marginBottom: 20, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
              <RadialProgress pct={Math.round((kpis.ects / ectsPlan) * 100) || 0} color={T.accent} label="ECTS abgeschlossen" value={`${kpis.ects}/${ectsPlan}`} />
              <RadialProgress pct={totalExams ? Math.round((kpis.passed / totalExams) * 100) : 0} color={T.success} label="Prüfungen bestanden" value={`${kpis.passed}/${totalExams}`} />
              <RadialProgress pct={totalExams ? Math.round((kpis.open / totalExams) * 100) : 0} color="#a78bfa" label="Offene Prüfungen" value={`${kpis.open}/${totalExams}`} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ fontSize: 44, fontWeight: 800, color: T.accent, lineHeight: 1 }}>
                  {Number(kpis.avg).toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Durchschnittsnote</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
              <div>
                <ExamSection title="Bestandene Prüfungen" exams={bestanden} color={T.success} emptyText="Noch keine bestandenen Prüfungen." />
                <ExamSection title="Offene Prüfungen" exams={offen} color="#a78bfa" emptyText="Keine offenen Prüfungen." />
                <ExamSection title="Nicht bestandene Prüfungen" exams={nichtBestanden} color={T.danger} emptyText="Keine nicht bestandenen Prüfungen." />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Notenverteilung</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                    Alle abgeschlossenen Prüfungen
                  </div>
                  <GradeDistribution grades={grades} />
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Zusammenfassung</div>
                  {[
                    { label: "Bestanden", value: kpis.passed, color: T.success },
                    { label: "Nicht bestanden", value: kpis.failed, color: T.danger },
                    { label: "Offen", value: kpis.open, color: "#a78bfa" },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                        <span style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{item.value}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${totalExams ? Math.round((item.value / totalExams) * 100) : 0}%`,
                          background: item.color, borderRadius: 3, transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}