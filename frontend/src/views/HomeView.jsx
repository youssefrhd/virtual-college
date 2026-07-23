import React, { useState } from "react";
import Globe from "../components/Globe";

const ACCENT = "#06b6d4";
const PROFESSOR = "#a78bfa";

const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const FEATURES = [
  {
    number: "01",
    title: "Kurse & Materialien",
    text: "Kurse, PDFs und Links zentral verwalten und jederzeit abrufen.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Studienfortschritt",
    text: "ECTS, Noten und Prüfungen auf einen Blick.",
    icon: "◌",
  },
  {
    number: "03",
    title: "Prüfungsanmeldung",
    text: "Prüfungen direkt digital an- und abmelden.",
    icon: "✓",
  },
  {
    number: "04",
    title: "Live-Benachrichtigungen",
    text: "Wichtige Änderungen und neue Informationen sofort sehen.",
    icon: "◉",
  },
];

function RoleCard({
  role,
  number,
  label,
  tagline,
  accent,
  onLogin,
  onRegister,
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        flex: 1,
        minWidth: 280,
        padding: 28,
        borderRadius: 18,
        background: hover
          ? "rgba(255,255,255,0.065)"
          : "rgba(255,255,255,0.035)",
        border: `1px solid ${
          hover ? accent + "70" : "rgba(255,255,255,0.09)"
        }`,
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 70px ${accent}18` : "none",
        transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          top: -120,
          right: -90,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}25, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.12em",
            padding: "5px 8px",
            borderRadius: 6,
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {number}
        </span>

        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: accent,
            letterSpacing: "0.1em",
          }}
        >
          {role.toUpperCase()}
        </span>
      </div>

      <div
        style={{
          width: 52,
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          marginBottom: 22,
          color: "#fff",
          fontSize: 22,
          background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
          boxShadow: `0 10px 30px ${accent}25`,
        }}
      >
        {role === "student" ? "⌁" : "▣"}
      </div>

      <h3
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        {label}
      </h3>

      <p
        style={{
          margin: "0 0 28px",
          color: "rgba(255,255,255,0.42)",
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {tagline}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onLogin}
          style={{
            flex: 1,
            border: "none",
            borderRadius: 9,
            padding: "12px 0",
            color: "#fff",
            background: accent,
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
        >
          ANMELDEN
        </button>

        <button
          onClick={onRegister}
          style={{
            flex: 1,
            border: `1px solid ${accent}55`,
            borderRadius: 9,
            padding: "12px 0",
            color: accent,
            background: "transparent",
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            cursor: "pointer",
          }}
        >
          REGISTRIEREN
        </button>
      </div>
    </div>
  );
}

export default function HomeView({ onEnter }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        background: "#070b14",
        color: "#fff",
        fontFamily: MONO,
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: .45;
          }
          50% {
            transform: scale(1.08);
            opacity: .8;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .home-fade {
          opacity: 0;
          animation: fadeUp .8s cubic-bezier(.22,1,.36,1) forwards;
        }

        .home-left {
          opacity: 0;
          animation: fadeLeft .8s cubic-bezier(.22,1,.36,1) forwards;
        }

        .home-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent);
        }

        .feature-card {
          transition: all .3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,.055) !important;
          border-color: rgba(6,182,212,.35) !important;
        }

        @media (max-width: 850px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }

          .hero-globe {
            order: -1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Background */}
      <div
        className="home-grid"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          width: 800,
          height: 800,
          top: -300,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,182,212,.12), transparent 68%)",
          animation: "pulse 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "26px 34px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9,
              color: "#fff",
              fontSize: 18,
              background: `linear-gradient(135deg, ${ACCENT}, #0891b2)`,
              boxShadow: `0 8px 25px ${ACCENT}30`,
            }}
          >
            ∿
          </div>

          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            VIRTUAL COLLEGE
          </span>
        </div>

        <button
          onClick={() => onEnter("student", "login")}
          style={{
            border: "1px solid rgba(255,255,255,.14)",
            borderRadius: 8,
            padding: "9px 16px",
            color: "rgba(255,255,255,.7)",
            background: "rgba(255,255,255,.04)",
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          LOGIN ↗
        </button>
      </header>

      {/* Hero */}
      <main
        className="hero-grid"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1.05fr .95fr",
          alignItems: "center",
          gap: 40,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "55px 34px 80px",
        }}
      >
        <section className="home-left">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 24,
              color: ACCENT,
              fontSize: 10,
              letterSpacing: "0.13em",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: ACCENT,
                boxShadow: `0 0 16px ${ACCENT}`,
              }}
            />
            DIGITAL CAMPUS SYSTEM
          </div>

          <div
            style={{
              marginBottom: 18,
              color: "rgba(255,255,255,.3)",
              fontSize: 10,
              letterSpacing: "0.14em",
            }}
          >
            [ 01 / PLATFORM ]
          </div>

          <h1
            style={{
              maxWidth: 700,
              margin: 0,
              color: "#e2e8f0",
              fontSize: "clamp(42px, 6vw, 76px)",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.075em",
            }}
          >
            Dein Studium.
            <br />
            <span
              style={{
                color: ACCENT,
                textShadow: `0 0 40px ${ACCENT}35`,
              }}
            >
              Zentral.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 550,
              margin: "28px 0 34px",
              color: "rgba(255,255,255,.43)",
              fontSize: 13,
              lineHeight: 1.9,
            }}
          >
            Virtual College verbindet Kurse, Prüfungen, Materialien und deinen
            Studienfortschritt in einer modernen digitalen Plattform.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 30,
              marginBottom: 42,
            }}
          >
            {[
              ["24/7", "ACCESS"],
              ["100%", "DIGITAL"],
              ["01", "PORTAL"],
            ].map(([value, label]) => (
              <div key={label}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    color: "rgba(255,255,255,.3)",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "rgba(255,255,255,.25)",
              fontSize: 9,
              letterSpacing: "0.1em",
            }}
          >
            <span
              style={{
                width: 34,
                height: 1,
                background: ACCENT,
              }}
            />
            SYSTEM READY
          </div>
        </section>

        <section
          className="home-fade hero-globe"
          style={{
            animationDelay: ".18s",
            display: "flex",
            justifyContent: "center",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <Globe size={500} />
        </section>
      </main>

      {/* Roles */}
      <section
        className="home-fade"
        style={{
          animationDelay: ".3s",
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "20px 34px 80px",
        }}
      >
        <div style={{ marginBottom: 26 }}>
          <div
            style={{
              marginBottom: 10,
              color: ACCENT,
              fontSize: 9,
              letterSpacing: "0.15em",
            }}
          >
            [ 02 / ACCESS ]
          </div>

          <h2
            style={{
              margin: 0,
              color: "#cbd5e1",
              fontSize: 25,
              letterSpacing: "-0.05em",
            }}
          >
            Choose your workspace.
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <RoleCard
            role="student"
            number="01"
            label="Student Workspace"
            tagline="Kurse, Prüfungen und deinen persönlichen Studienfortschritt verwalten."
            accent={ACCENT}
            onLogin={() => onEnter("student", "login")}
            onRegister={() => onEnter("student", "register")}
          />

          <RoleCard
            role="professor"
            number="02"
            label="Professor Workspace"
            tagline="Kurse verwalten, Materialien bereitstellen und Studierende betreuen."
            accent={PROFESSOR}
            onLogin={() => onEnter("professor", "login")}
            onRegister={() => onEnter("professor", "register")}
          />
        </div>
      </section>

      {/* Features */}
      <section
        className="home-fade"
        style={{
          animationDelay: ".45s",
          position: "relative",
          zIndex: 2,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 34px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              color: ACCENT,
              fontSize: 9,
              letterSpacing: "0.15em",
            }}
          >
            [ 03 / SYSTEM ]
          </span>

          <div
            style={{
              height: 1,
              flex: 1,
              background: "rgba(255,255,255,.08)",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {FEATURES.map((feature) => (
            <div
              className="feature-card"
              key={feature.number}
              style={{
                padding: 20,
                borderRadius: 14,
                background: "rgba(255,255,255,.025)",
                border: "1px solid rgba(255,255,255,.07)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 25,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    padding: "4px 7px",
                    borderRadius: 5,
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.4)",
                  }}
                >
                  {feature.number}
                </span>

                <span
                  style={{
                    color: ACCENT,
                    fontSize: 18,
                  }}
                >
                  {feature.icon}
                </span>
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#e2e8f0",
                  fontSize: 13,
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,.35)",
                  fontSize: 11,
                  lineHeight: 1.7,
                }}
              >
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 34px 30px",
          textAlign: "center",
          color: "rgba(255,255,255,.18)",
          fontSize: 9,
          letterSpacing: "0.13em",
        }}
      >
        VIRTUAL COLLEGE · SWT2 · SYSTEM ONLINE
      </footer>
    </div>
  );
}