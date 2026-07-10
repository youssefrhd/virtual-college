import React, { useEffect, useMemo, useState } from "react";
import TopNav from "../components/TopNav";
import {
  getAllKurse,
  getKurs,
  createKurs,
  getMaterialienByKurs,
  createPdfMaterial,
  createLinkMaterial,
  downloadMaterial,
  getMaterialById
} from "../api/authApi";

const T = {
  bg1: "#0f172a",
  accent: "#06b6d4",
  accentDim: "#0891b2",
  accentGlow: "rgba(6,182,212,0.15)",
  danger: "#ef4444",
  purple: "#a78bfa",
};

const BASE_URL = "http://localhost:8080";

/* ── Toast (Erfolgs-/Fehlermeldung) ──────────────────────────────────── */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color = type === "success" ? T.accent : T.danger;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      display: "flex", alignItems: "center", gap: 12,
      background: "#111c33", border: `1px solid ${color}55`,
      borderRadius: 14, padding: "14px 18px", minWidth: 280, maxWidth: 380,
      boxShadow: `0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`,
      animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: `${color}22`, border: `1px solid ${color}55`,
        display: "flex", alignItems: "center", justifyContent: "center", color,
      }}>
        {type === "success" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", flex: 1 }}>{message}</div>
      <button onClick={onClose} style={{
        background: "none", border: "none", color: "rgba(255,255,255,0.35)",
        cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1,
      }}>×</button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── Modal-Wrapper ───────────────────────────────────────────────────── */
function Modal({ title, onClose, children, width = 460 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: width, background: "#111c33",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18,
          padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{title}</div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.6)",
            width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 16,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit",
  outline: "none",
};

function PrimaryButton({ children, ...props }) {
  return (
    <button {...props} style={{
      background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`, border: "none",
      borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 600, fontSize: 13,
      cursor: "pointer", ...props.style,
    }}>
      {children}
    </button>
  );
}

/* ── Kurs erstellen (Professor) ──────────────────────────────────────── */
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
        <input style={inputStyle} value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="z. B. Softwaretechnik 2" />
      </Field>
      <Field label="Beschreibung">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="Kurzbeschreibung des Kurses" />
      </Field>
      <Field label="Modul-ID (UUID)">
        <input style={inputStyle} value={modulId} onChange={(e) => setModulId(e.target.value)} placeholder="z. B. 3f9a1b2c-..." />
      </Field>

      {error && <div style={{ color: T.danger, fontSize: 12, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
          Abbrechen
        </button>
        <PrimaryButton onClick={submit} disabled={saving}>
          {saving ? "Speichern..." : "Kurs erstellen"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ── Material hinzufügen (PDF oder Link) ────────────────────────────── */
function AddMaterialModal({ kursId, onClose, onCreated }) {
  const [tab, setTab] = useState("pdf"); // "pdf" | "link"
  const [titel, setTitel] = useState("");
  const [url, setUrl] = useState("");
  const [datei, setDatei] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!titel.trim()) {
      setError("Titel ist erforderlich.");
      return;
    }
    if (tab === "pdf" && !datei) {
      setError("Bitte eine PDF-Datei auswählen.");
      return;
    }
    if (tab === "link" && !url.trim()) {
      setError("Bitte eine URL angeben.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      if (tab === "pdf") {
        await createPdfMaterial({ titel, kursId, datei });
      } else {
        await createLinkMaterial({ titel, url, kursId });
      }
      onCreated();
    } catch (err) {
      setError(err.message || "Material konnte nicht hinzugefügt werden.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Lernmaterial hinzufügen" onClose={onClose}>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
        {[
          { key: "pdf", label: "PDF hochladen" },
          { key: "link", label: "Link" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: tab === t.key ? T.accent : "transparent",
            color: tab === t.key ? "#fff" : "rgba(255,255,255,0.5)",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <Field label="Titel">
        <input style={inputStyle} value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="z. B. Vorlesungsfolien Woche 3" />
      </Field>

      {tab === "pdf" ? (
        <Field label="PDF-Datei">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setDatei(e.target.files?.[0] ?? null)}
            style={{ ...inputStyle, padding: "8px 10px" }}
          />
        </Field>
      ) : (
        <Field label="URL">
          <input style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </Field>
      )}

      {error && <div style={{ color: T.danger, fontSize: 12, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
          Abbrechen
        </button>
        <PrimaryButton onClick={submit} disabled={saving}>
          {saving ? "Speichern..." : "Hinzufügen"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ── Sortierbare Material-Tabelle ────────────────────────────────────── */
function SortableHeader({ label, sortKey, sort, setSort }) {
  const active = sort.key === sortKey;
  const toggle = () => setSort((s) => ({
    key: sortKey,
    dir: s.key === sortKey && s.dir === "asc" ? "desc" : "asc",
  }));
  return (
    <th onClick={toggle} style={{
      textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700,
      color: active ? T.accent : "rgba(255,255,255,0.4)", textTransform: "uppercase",
      letterSpacing: "0.04em", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    }}>
      {label} {active ? (sort.dir === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}


function MaterialTable({ materialien }) {
  const [sort, setSort] = useState({ key: "hochgeladenAm", dir: "desc" });
  const [openingId, setOpeningId] = useState(null);

  const sorted = useMemo(() => {
    const arr = [...materialien];
    arr.sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [materialien, sort]);

  if (materialien.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        Noch keine Lernmaterialien vorhanden.
      </div>
    );
  }

  const handleDownload = async (materialId) => {
    try {
      await downloadMaterial(materialId);
    } catch (err) {
      alert(err.message || "Download fehlgeschlagen.");
    }
  };

  const handleOpenLink = async (materialId) => {
    try {
      setOpeningId(materialId);
      const detail = await getMaterialById(materialId); // liefert u. a. { url }

      if (!detail?.url) {
        throw new Error("Kein Link hinterlegt.");
      }

      const href = detail.url.startsWith("http") ? detail.url : `https://${detail.url}`;
      window.open(href, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err.message || "Link konnte nicht geöffnet werden.");
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <SortableHeader label="Titel" sortKey="titel" sort={sort} setSort={setSort} />
            <SortableHeader label="Typ" sortKey="typ" sort={sort} setSort={setSort} />
            <SortableHeader label="Hochgeladen am" sortKey="hochgeladenAm" sort={sort} setSort={setSort} />
            <th style={{ padding: "10px 12px" }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => {
            const isPdf = String(m.typ).toUpperCase() === "PDF";
            const isOpening = openingId === m.materialId;

            return (
              <tr key={m.materialId} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "12px", fontSize: 13, fontWeight: 500, color: "#fff" }}>
                  {m.titel}
                </td>

                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: isPdf ? T.purple : T.accent,
                      background: isPdf ? `${T.purple}18` : `${T.accent}18`,
                      border: `1px solid ${isPdf ? T.purple : T.accent}44`,
                      borderRadius: 20,
                      padding: "3px 9px",
                    }}
                  >
                    {m.typ}
                  </span>
                </td>

                <td style={{ padding: "12px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {m.hochgeladenAm
                    ? new Date(m.hochgeladenAm).toLocaleDateString("de-DE")
                    : "—"}
                </td>

                <td style={{ padding: "12px", textAlign: "right" }}>
                  {isPdf ? (
                    <button
                      onClick={() => handleDownload(m.materialId)}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: T.accent,
                        background: "transparent",
                        border: `1px solid ${T.accent}44`,
                        borderRadius: 8,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Herunterladen
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenLink(m.materialId)}
                      disabled={isOpening}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: T.accent,
                        background: "transparent",
                        border: `1px solid ${T.accent}44`,
                        borderRadius: 8,
                        padding: "6px 12px",
                        cursor: isOpening ? "default" : "pointer",
                        opacity: isOpening ? 0.6 : 1,
                        fontFamily: "inherit",
                      }}
                    >
                      {isOpening ? "Öffne..." : "Öffnen"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
/* ── Kurs-Detail (Modal) ─────────────────────────────────────────────── */
function KursDetail({ kursId, isProfessor, onClose, onSuccess }) {
  const [kurs, setKurs] = useState(null);
  const [materialien, setMaterialien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [k, m] = await Promise.all([
        getKurs(kursId),
        getMaterialienByKurs(kursId).catch(() => []), // Endpoint evtl. noch nicht vorhanden
      ]);
      setKurs(k);
      setMaterialien(Array.isArray(m) ? m : []);
    } catch (err) {
      setError(err.message || "Kurs konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [kursId]);

  return (
    <Modal title={kurs?.titel ?? "Kurs"} onClose={onClose} width={720}>
      {loading ? (
        <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Lade Kurs...</div>
      ) : error ? (
        <div style={{ color: T.danger, padding: 20 }}>{error}</div>
      ) : (
        <>
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "16px 18px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              {kurs?.beschreibung || "Keine Beschreibung vorhanden."}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Lernmaterialien</div>
            {isProfessor && (
              <button onClick={() => setShowAddMaterial(true)} style={{
                background: `${T.accent}18`, border: `1px solid ${T.accent}44`, color: T.accent,
                borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                + Material hinzufügen
              </button>
            )}
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
            <MaterialTable materialien={materialien} />
          </div>
        </>
      )}

      {showAddMaterial && (
        <AddMaterialModal
          kursId={kursId}
          onClose={() => setShowAddMaterial(false)}
          onCreated={() => {
            setShowAddMaterial(false);
            load();
            onSuccess?.("Lernmaterial erfolgreich hinzugefügt");
          }}
        />
      )}
    </Modal>
  );
}

/* ── Kurskarte ───────────────────────────────────────────────────────── */
function KursCard({ kurs, onOpen }) {
  return (
    <button onClick={() => onOpen(kurs.kursId)} style={{
      textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px 20px", cursor: "pointer", color: "#fff", fontFamily: "inherit",
      transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 10,
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.accent}66`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" /></svg>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{kurs.titel}</div>
      </div>
      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {kurs.beschreibung || "Keine Beschreibung."}
      </div>
      <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>Details ansehen →</div>
    </button>
  );
}

/* ── Hauptkomponente ─────────────────────────────────────────────────── */
export default function KurseView({ user, isProfessor = false, onNavigate }) {
  const [kurse, setKurse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [openKursId, setOpenKursId] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => setToast({ message, type });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllKurse();
      setKurse(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Kurse konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return kurse;
    return kurse.filter(k =>
      k.titel?.toLowerCase().includes(q) || k.beschreibung?.toLowerCase().includes(q)
    );
  }, [kurse, search]);

  return (
    <div style={{ minHeight: "100vh", background: T.bg1, fontFamily: "inherit", color: "#fff" }}>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Kurse</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
              {isProfessor ? "Verwalte deine Kurse und Lernmaterialien" : "Alle verfügbaren Kurse"}
            </p>
          </div>
          {isProfessor && (
            <PrimaryButton onClick={() => setShowCreate(true)}>+ Neuer Kurs</PrimaryButton>
          )}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kurse durchsuchen..."
          style={{ ...inputStyle, marginBottom: 22, maxWidth: 340 }}
        />

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Lade Kurse...</div>
        ) : error ? (
          <div style={{ color: T.danger, padding: 20 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            Keine Kurse gefunden.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16 }}>
            {filtered.map(k => (
              <KursCard key={k.kursId} kurs={k} onOpen={setOpenKursId} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateKursModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
            showToast("Kurs erfolgreich erstellt");
          }}
        />
      )}

      {openKursId && (
        <KursDetail
          kursId={openKursId}
          isProfessor={isProfessor}
          onClose={() => setOpenKursId(null)}
          onSuccess={showToast}
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