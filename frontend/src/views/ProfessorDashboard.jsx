import { useState, useEffect, useMemo } from "react";
import { ROLES } from "../config/roles";
import TopNav from "../components/TopNav";
import { getAllKurse, getMaterialienByKurs, createKurs } from "../api/authApi";

const T = ROLES["professor"];

/* ── Toast ────────────────────────────────────────────────────────────── */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color = type === "success" ? T.accent : "#ef4444";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#111c33",
        border: `1px solid ${color}55`,
        borderRadius: 14,
        padding: "14px 18px",
        minWidth: 280,
        maxWidth: 380,
        boxShadow: `0 10px 40px rgba(0,0,0,0.4)`,
        animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          background: `${color}22`,
          border: `1px solid ${color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
        }}
      >
        {type === "success" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", flex: 1 }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.35)",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        ×
      </button>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(0.95);} to { opacity:1; transform:translateY(0) scale(1);} }`}</style>
    </div>
  );
}

/* ── Modal / Form Bausteine ──────────────────────────────────────────── */
function Modal({ title, onClose, children, width = 440 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: width,
          background: "#111c33",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18,
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              width: 28,
              height: 28,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function CreateKursModal({ onClose, onCreated }) {
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [modulId, setModulId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!titel.trim() || !modulId.trim()) {
      setError("Titel und Modul-ID sind erforderlich.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await createKurs({ titel, beschreibung, modulId });
      onCreated();
    } catch (err) {
      setError(err.message || "Kurs konnte nicht erstellt werden.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Neuen Kurs anlegen" onClose={onClose}>
      <Field label="Titel">
        <input
          style={inputStyle}
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="z. B. Softwaretechnik 2"
        />
      </Field>
      <Field label="Beschreibung">
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          placeholder="Kurzbeschreibung"
        />
      </Field>
      <Field label="Modul-ID (UUID)">
        <input
          style={inputStyle}
          value={modulId}
          onChange={(e) => setModulId(e.target.value)}
          placeholder="z. B. 3f9a1b2c-..."
        />
      </Field>
      {error && (
        <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.6)",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          Abbrechen
        </button>
        <button
          onClick={submit}
          disabled={saving}
          style={{
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saving ? "Speichern..." : "Kurs erstellen"}
        </button>
      </div>
    </Modal>
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

/* ── Kurs Card ───────────────────────────────────────────────────────── */
function KursCard({ kurs, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(kurs)}
      style={{
        background: selected ? T.accentGlow : "rgba(255,255,255,0.04)",
        border: `1px solid ${selected ? T.accent + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 14,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = `${T.accent}44`;
      }}
      onMouseLeave={(e) => {
        if (!selected)
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
          </svg>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
          {kurs.titel}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {kurs.beschreibung || "Keine Beschreibung."}
      </div>
    </div>
  );
}

/* ── Typ Badge ───────────────────────────────────────────────────────── */
function TypBadge({ typ }) {
  const isPdf = String(typ).toUpperCase() === "PDF";
  const col = isPdf ? "#a78bfa" : T.accent;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: col,
        background: `${col}18`,
        border: `1px solid ${col}33`,
        borderRadius: 4,
        padding: "2px 6px",
        textTransform: "uppercase",
      }}
    >
      {typ}
    </span>
  );
}



/* ── Tabs ────────────────────────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  const tabs = [
    { key: "kurse", label: "Meine Kurse" },
    { key: "materialien", label: "Materialien" }
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        padding: 5,
        marginBottom: 20,
        width: "fit-content",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            padding: "8px 18px",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            background: active === t.key ? T.accent : "transparent",
            color: active === t.key ? "#fff" : "rgba(255,255,255,0.5)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
export default function ProfessorDashboard({ user, onNavigate }) {
  const [kurse, setKurse] = useState([]);
  const [loadingKurse, setLoadingKurse] = useState(true);
  const [kurseError, setKurseError] = useState("");

  const [selectedKurs, setSelectedKurs] = useState(null);
  const [materialien, setMaterialien] = useState([]);
  const [loadingMaterial, setLoadingMaterial] = useState(false);

  const [activeTab, setActiveTab] = useState("kurse");
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);

  const loadKurse = async () => {
    try {
      setLoadingKurse(true);
      setKurseError("");
      const data = await getAllKurse();
      const list = Array.isArray(data) ? data : [];
      setKurse(list);
      if (!selectedKurs && list.length > 0) setSelectedKurs(list[0]);
    } catch (err) {
      setKurseError(err.message || "Kurse konnten nicht geladen werden.");
    } finally {
      setLoadingKurse(false);
    }
  };

  useEffect(() => {
    loadKurse(); /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    if (!selectedKurs) return;
    (async () => {
      try {
        setLoadingMaterial(true);
        const data = await getMaterialienByKurs(selectedKurs.kursId).catch(
          () => [],
        );
        setMaterialien(Array.isArray(data) ? data : []);
      } finally {
        setLoadingMaterial(false);
      }
    })();
  }, [selectedKurs]);

  const gesamtMaterialien = materialien.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg1,
        fontFamily: "inherit",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {/* Greeting */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
              Willkommen,{" "}
              <span style={{ color: T.accent }}>
                {user?.name ?? "Professor"}
              </span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {new Date().toLocaleDateString("de-DE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 4px 16px ${T.accentGlow}`,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Neuer Kurs
          </button>
        </div>

        {/* Stats */}
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
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            }
            label="Meine Kurse"
            value={loadingKurse ? "…" : kurse.length}
            sub="gesamt"
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
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            }
            label="Materialien"
            value={loadingMaterial ? "…" : gesamtMaterialien}
            sub={selectedKurs ? `in ${selectedKurs.titel}` : "—"}
            accent="#22c55e"
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
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            }
            label="Aktive Kurse"
            value={loadingKurse ? "…" : kurse.length}
            sub="im System"
            accent="#a78bfa"
          />
        </div>

        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === "kurse" &&
          (loadingKurse ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Lade Kurse...
            </div>
          ) : kurseError ? (
            <div style={{ color: "#ef4444", padding: 20 }}>{kurseError}</div>
          ) : kurse.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Noch keine Kurse angelegt.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
                gap: 14,
              }}
            >
              {kurse.map((k) => (
                <KursCard
                  key={k.kursId}
                  kurs={k}
                  selected={selectedKurs?.kursId === k.kursId}
                  onSelect={setSelectedKurs}
                />
              ))}
            </div>
          ))}

        {activeTab === "materialien" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 4,
                }}
              >
                Kurs auswählen
              </div>
              {kurse.map((k) => (
                <button
                  key={k.kursId}
                  onClick={() => setSelectedKurs(k)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background:
                      selectedKurs?.kursId === k.kursId
                        ? T.accentGlow
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedKurs?.kursId === k.kursId ? T.accent + "55" : "rgba(255,255,255,0.07)"}`,
                    color:
                      selectedKurs?.kursId === k.kursId
                        ? T.accent
                        : "rgba(255,255,255,0.6)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {k.titel}
                </button>
              ))}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {selectedKurs
                  ? `Materialien · ${selectedKurs.titel}`
                  : "Kein Kurs ausgewählt"}
              </div>

              {loadingMaterial ? (
                <div
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Lade Materialien...
                </div>
              ) : materialien.length === 0 ? (
                <div
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                  }}
                >
                  Keine Materialien für diesen Kurs vorhanden.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <th
                        style={{
                          textAlign: "left",
                          padding: "10px 20px",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                        }}
                      >
                        Titel
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                        }}
                      >
                        Typ
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                        }}
                      >
                        Hochgeladen am
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialien.map((m) => (
                      <tr
                        key={m.materialId}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 20px",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {m.titel}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <TypBadge typ={m.typ} />
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 12,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {m.hochgeladenAm
                            ? new Date(m.hochgeladenAm).toLocaleDateString(
                                "de-DE",
                              )
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div
                style={{
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <button
                  onClick={() => onNavigate?.("kurse")}
                  style={{
                    background: "transparent",
                    border: `1px solid ${T.accent}44`,
                    color: T.accent,
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Zur Kursverwaltung →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateKursModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadKurse();
            setToast({ message: "Kurs erfolgreich erstellt", type: "success" });
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
