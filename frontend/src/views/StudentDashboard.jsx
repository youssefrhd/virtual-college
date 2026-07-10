import { useState } from "react";
import { ROLES } from "../config/roles";
import TopNav from "../components/TopNav";

/* ── Shared Tokens ───────────────────────────────────────────────────── */
const T = ROLES["student"];

/* ── Mock Data ───────────────────────────────────────────────────────── */
const SEMESTER_DATA = [
  { sem: "S1", ects: 30, max: 30, gpa: 1.3 },
  { sem: "S2", ects: 28, max: 30, gpa: 1.7 },
  { sem: "S3", ects: 25, max: 30, gpa: 2.1 },
  { sem: "S4", ects: 18, max: 30, gpa: null }, // aktuell
];

const MODULES = [
  {
    id: 1,
    name: "Algorithmen & Datenstrukturen",
    credits: 5,
    grade: 1.3,
    status: "bestanden",
    progress: 100,
  },
  {
    id: 2,
    name: "Betriebssysteme",
    credits: 5,
    grade: 1.7,
    status: "bestanden",
    progress: 100,
  },
  {
    id: 3,
    name: "Datenbanken",
    credits: 5,
    grade: 2.0,
    status: "bestanden",
    progress: 100,
  },
  {
    id: 4,
    name: "Software Engineering",
    credits: 5,
    grade: null,
    status: "laufend",
    progress: 68,
  },
  {
    id: 5,
    name: "Maschinelles Lernen",
    credits: 5,
    grade: null,
    status: "laufend",
    progress: 42,
  },
  {
    id: 6,
    name: "Computergrafik",
    credits: 5,
    grade: null,
    status: "geplant",
    progress: 0,
  },
];

const UPCOMING = [
  {
    id: 1,
    fach: "Software Engineering",
    datum: "14. Jul 2026",
    uhrzeit: "10:00",
    raum: "A1.201",
    typ: "Klausur",
  },
  {
    id: 2,
    fach: "Maschinelles Lernen",
    datum: "21. Jul 2026",
    uhrzeit: "14:00",
    raum: "B2.105",
    typ: "Klausur",
  },
  {
    id: 3,
    fach: "Computergrafik",
    datum: "28. Jul 2026",
    uhrzeit: "09:00",
    raum: "C3.012",
    typ: "Abgabe",
  },
];

/* ── Mini Bar Chart ──────────────────────────────────────────────────── */
function SemesterChart() {
  const [hovered, setHovered] = useState(null);
  const maxH = 120;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          height: maxH + 32,
          paddingBottom: 0,
        }}
      >
        {SEMESTER_DATA.map((s, i) => {
          const pct = s.ects / s.max;
          const barH = Math.round(pct * maxH);
          const isHov = hovered === i;
          const isCur = s.gpa === null;
          return (
            <div
              key={s.sem}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.accent,
                  marginBottom: 4,
                  opacity: isHov ? 1 : 0,
                  transition: "opacity 0.15s",
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: 6,
                  padding: "2px 6px",
                  whiteSpace: "nowrap",
                }}
              >
                {s.ects} ECTS{s.gpa ? ` · Ø ${s.gpa}` : ""}
              </div>
              {/* Bar */}
              <div
                style={{
                  width: "100%",
                  height: barH,
                  background: isCur
                    ? `linear-gradient(180deg, ${T.accent}, ${T.accentDim})`
                    : `linear-gradient(180deg, ${T.accentGlow}, rgba(6,182,212,0.15))`,
                  border: `1px solid ${isCur ? T.accent : "rgba(6,182,212,0.3)"}`,
                  borderRadius: "6px 6px 0 0",
                  transition: "all 0.2s",
                  transform: isHov ? "scaleY(1.02)" : "scaleY(1)",
                  transformOrigin: "bottom",
                  boxShadow: isHov ? `0 0 16px ${T.accentGlow}` : "none",
                }}
              />
              {/* Label */}
              <div
                style={{
                  fontSize: 11,
                  color: isCur ? T.accent : "rgba(255,255,255,0.4)",
                  marginTop: 6,
                  fontWeight: isCur ? 700 : 400,
                }}
              >
                {s.sem}
                {isCur && " ●"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Donut Chart ─────────────────────────────────────────────────────── */
function DonutChart({ value, max, label, color }) {
  const r = 36,
    stroke = 8;
  const circ = 2 * Math.PI * r;
  const pct = value / max;
  const dash = circ * pct;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{ position: "relative", width: 92, height: 92 }}>
        <svg width="92" height="92" viewBox="0 0 92 92">
          <circle
            cx="46"
            cy="46"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />
          <circle
            cx="46"
            cy="46"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 46 46)"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            {value}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            /{max}
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Stat Card ───────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent}22`,
          border: `1px solid ${accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            marginTop: 3,
          }}
        >
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

/* ── Module Row ──────────────────────────────────────────────────────── */
function ModuleRow({ mod }) {
  const statusColor = {
    bestanden: "#22c55e",
    laufend: T.accent,
    geplant: "rgba(255,255,255,0.3)",
  };
  const col = statusColor[mod.status];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: col,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {mod.name}
        </div>
        {mod.status === "laufend" && (
          <div style={{ marginTop: 5 }}>
            <div
              style={{
                height: 3,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${mod.progress}%`,
                  background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`,
                  borderRadius: 2,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        {mod.grade && (
          <span style={{ fontSize: 13, fontWeight: 700, color: col }}>
            {mod.grade}
          </span>
        )}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: col,
            background: `${col}18`,
            border: `1px solid ${col}33`,
            borderRadius: 20,
            padding: "2px 8px",
          }}
        >
          {mod.status}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          {mod.credits} ECTS
        </span>
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────────── */
export default function StudentDashboard({ user, onNavigate }) {
  const totalEcts = SEMESTER_DATA.reduce((s, d) => s + d.ects, 0);
  const grades = MODULES.filter((m) => m.grade).map((m) => m.grade);
  const avgGrade = (grades.reduce((s, g) => s + g, 0) / grades.length).toFixed(
    1,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg1,
        fontFamily: "inherit",
        color: "#fff",
      }}
    >

     
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
            Guten Morgen,{" "}
            <span style={{ color: T.accent }}>
              {user?.name?.split(" ")[0] ?? "Max"}
            </span>{" "}
            👋
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            Semester 4 · Praktische Informatik ·{" "}
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <StatCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            }
            label="ECTS gesamt"
            value={totalEcts}
            sub="von 240 Ziel"
            accent={T.accent}
          />
          <StatCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
            label="Ø Note"
            value={avgGrade}
            sub="Aktuelles Semester"
            accent="#a78bfa"
          />
          <StatCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            label="Prüfungen"
            value={UPCOMING.length}
            sub="in den nächsten 30 Tagen"
            accent="#f59e0b"
          />
          <StatCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            label="Module bestanden"
            value={MODULES.filter((m) => m.status === "bestanden").length}
            sub={`von ${MODULES.length} gesamt`}
            accent="#22c55e"
          />
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* Left: Semester Chart */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  ECTS pro Semester
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 2,
                  }}
                >
                  Verlauf & aktueller Stand
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.accent,
                  background: `${T.accentGlow}`,
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                Live
              </div>
            </div>
            <SemesterChart />
          </div>

          {/* Right: Donuts */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "22px 24px",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
              Studiumsfortschritt
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 22,
              }}
            >
              Gesamtüberblick
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                justifyItems: "center",
              }}
            >
              <DonutChart
                value={totalEcts}
                max={240}
                label="ECTS"
                color={T.accent}
              />
              <DonutChart value={3} max={8} label="Semester" color="#a78bfa" />
              <DonutChart
                value={MODULES.filter((m) => m.status === "bestanden").length}
                max={MODULES.length}
                label="Module"
                color="#22c55e"
              />
              <DonutChart
                value={Math.round((totalEcts / 240) * 100)}
                max={100}
                label="% abgeschlossen"
                color="#f59e0b"
              />
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* Module Liste */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600 }}>Meine Module</div>
              <button
                onClick={() => onNavigate?.("progress")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.accent,
                  fontSize: 12,
                  fontFamily: "inherit",
                }}
              >
                Alle ansehen →
              </button>
            </div>
            {MODULES.map((m) => (
              <ModuleRow key={m.id} mod={m} />
            ))}
          </div>

          {/* Anstehende Prüfungen */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "22px 24px",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
              Anstehende Prüfungen
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 16,
              }}
            >
              Nächste 30 Tage
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {UPCOMING.map((e, i) => (
                <div
                  key={e.id}
                  style={{
                    background:
                      i === 0 ? `${T.accentGlow}` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 ? T.accent + "44" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {e.fach}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        <span>📅 {e.datum}</span>
                        <span>🕐 {e.uhrzeit}</span>
                        <span>📍 {e.raum}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: e.typ === "Klausur" ? "#f59e0b" : "#a78bfa",
                        background:
                          e.typ === "Klausur" ? "#f59e0b18" : "#a78bfa18",
                        border: `1px solid ${e.typ === "Klausur" ? "#f59e0b33" : "#a78bfa33"}`,
                        borderRadius: 20,
                        padding: "3px 8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.typ}
                    </span>
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
