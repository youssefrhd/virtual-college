import React, { useState } from "react";
import Globe from "../components/Globe";

const ACCENT = "#06b6d4";
const ACCENT_DIM = "#0891b2";
const PROF_ACCENT = "#a78bfa";

const FEATURES = [
  {
    title: "Kurse & Materialien",
    text: "Zentrale Verwaltung von Kursen, PDFs und Links — jederzeit griffbereit.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
      </svg>
    ),
  },
  {
    title: "Studienfortschritt",
    text: "ECTS, Noten und Prüfungen auf einen Blick — inklusive PDF-Export.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Prüfungsanmeldung",
    text: "Direkt im Portal an- und abmelden, ganz ohne Papierformulare.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: "Echtzeit-Benachrichtigungen",
    text: "Nie wieder etwas verpassen — neue Materialien, Noten und Termine live.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
];

function RoleCard({ role, label, tagline, accent, onLogin, onRegister }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, minWidth: 260, background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hover ? accent + "66" : "rgba(255,255,255,0.09)"}`,
        borderRadius: 20, padding: "28px 26px", transition: "all 0.25s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hover ? `0 16px 40px ${accent}22` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}22, transparent 70%)`, pointerEvents: "none",
      }} />

      <div style={{
        width: 46, height: 46, borderRadius: 12, marginBottom: 16,
        background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          {role === "student" ? (
            <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>
          ) : (
            <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></>
          )}
        </svg>
      </div>

      <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 22 }}>
        {tagline}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onLogin}
          style={{
            flex: 1, background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, border: "none",
            borderRadius: 10, padding: "11px 0", color: "#fff", fontWeight: 700, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Anmelden
        </button>
        <button
          onClick={onRegister}
          style={{
            flex: 1, background: "transparent", border: `1px solid ${accent}55`,
            borderRadius: 10, padding: "11px 0", color: accent, fontWeight: 600, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Registrieren
        </button>
      </div>
    </div>
  );
}

export default function HomeView({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#fff", fontFamily: "inherit", overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.5; } 50% { opacity:0.9; } }
        .home-fade { animation: fadeUp 0.6s ease forwards; opacity: 0; }
      `}</style>

      <div style={{
        position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: 900, height: 900, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.10), transparent 65%)",
        pointerEvents: "none", animation: "pulseGlow 6s ease-in-out infinite",
      }} />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 32px", position: "relative", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DIM})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Virtual College</span>
        </div>

        <button
          onClick={() => onEnter("student", "login")}
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 9, padding: "8px 18px", color: "rgba(255,255,255,0.8)",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Anmelden
        </button>
      </div>

      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "40px 32px 20px",
        display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40,
        alignItems: "center", position: "relative", zIndex: 2,
      }}>
        <div className="home-fade" style={{ animationDelay: "0.05s" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
            background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, color: ACCENT,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT }} />
            Digitales Campus-Portal
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 5vw, 60px)", fontWeight: 800, lineHeight: 1.08,
            margin: 0, marginBottom: 20, color: "#94a3b8", letterSpacing: "-0.02em",
          }}>
            Willkommen bei{" "}
            <span style={{
              background: `linear-gradient(135deg, #e2e8f0, #94a3b8)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              display: "block",
            }}>
              Virtual College
            </span>
          </h1>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 480, marginBottom: 32 }}>
            Deine gesamte Hochschule an einem Ort — Kurse, Studienfortschritt,
            Prüfungsanmeldung und Materialien. Für Studierende und Lehrende,
            überall erreichbar.
          </p>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { value: "24/7", label: "Zugriff" },
              { value: "100%", label: "digital" },
              { value: "2", label: "Rollen · 1 Portal" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-fade" style={{ animationDelay: "0.15s" }}>
          <Globe size={460} />
        </div>
      </div>

      <div className="home-fade" style={{ animationDelay: "0.25s", maxWidth: 1000, margin: "20px auto 0", padding: "20px 32px", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#cbd5e1", margin: 0 }}>Wie möchtest du starten?</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
            Wähle deine Rolle, um dich anzumelden oder ein neues Konto zu erstellen
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <RoleCard
            role="student"
            label="Ich bin Student"
            tagline="Kurse einsehen, Prüfungen anmelden und deinen Studienfortschritt verfolgen."
            accent={ACCENT}
            onLogin={() => onEnter("student", "login")}
            onRegister={() => onEnter("student", "register")}
          />
          <RoleCard
            role="professor"
            label="Ich bin Professor"
            tagline="Kurse verwalten, Materialien bereitstellen und Studierende betreuen."
            accent={PROF_ACCENT}
            onLogin={() => onEnter("professor", "login")}
            onRegister={() => onEnter("professor", "register")}
          />
        </div>
      </div>

      <div className="home-fade" style={{ animationDelay: "0.35s", maxWidth: 1100, margin: "50px auto 0", padding: "0 32px 70px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px 20px",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, marginBottom: 14,
                background: `${ACCENT}18`, border: `1px solid ${ACCENT}33`,
                display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT,
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.55 }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 0 30px", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>
        Virtual College · SWT2
      </div>
    </div>
  );
}