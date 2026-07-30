import React, { useEffect, useMemo, useState } from "react";
import TopNav from "../components/TopNav";
import { ROLES } from "../config/roles";
import {
  getAllKurse,
  getKurs,
  createKurs,
  deleteKurs,
  getMaterialienByKurs,
  createPdfMaterial,
  createLinkMaterial,
  downloadMaterial,
  getMaterialById,
  deleteMaterial,
} from "../api/authApi";

/* ── role-aware token helper (identisch zu Profile.jsx) ──────────────── */
const getT = (role) => ROLES[role] ?? ROLES["student"];

const danger = "#ef4444";
const purple = "#a78bfa";

/* ── Toast (Erfolgs-/Fehlermeldung) ──────────────────────────────────── */
function Toast({ message, type = "success", accent, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color = type === "success" ? accent : danger;

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
        boxShadow: `0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`,
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
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
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
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

/* ── Section Wrapper (identisch zu Profile.jsx) ───────────────────────── */
function Section({ title, sub, right, children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "22px 24px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
          {sub && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
              {sub}
            </div>
          )}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyleFor(t) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 9,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };
}

function PrimaryButton({ t, children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 18px",
        borderRadius: 9,
        border: `1px solid ${t.accent}`,
        background: t.accentGlow,
        color: t.accent,
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 16px",
        borderRadius: 9,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "transparent",
        color: "rgba(255,255,255,0.6)",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

/* ── Generischer Löschbestätigungs-Dialog ─────────────────────────────
   Wird sowohl für Material- als auch für Kurs-Löschung verwendet.       */
function DeleteConfirmModal({ titel, entityLabel = "Eintrag", hint, onCancel, onConfirm, deleting }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 150,
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
          maxWidth: 380,
          background: "#111c33",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: danger,
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
            {entityLabel} löschen?
          </div>
        </div>

        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 20 }}>
          "{titel}" wird unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
          {hint && (
            <div style={{ marginTop: 10, color: danger, fontWeight: 600 }}>
              {hint}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <GhostButton onClick={onCancel} disabled={deleting} style={{ cursor: deleting ? "default" : "pointer" }}>
            Abbrechen
          </GhostButton>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              background: danger,
              border: "none",
              color: "#fff",
              borderRadius: 9,
              padding: "10px 16px",
              fontWeight: 600,
              fontSize: 13,
              cursor: deleting ? "default" : "pointer",
              fontFamily: "inherit",
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? "Löschen..." : "Löschen"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Kurs erstellen (Professor) ──────────────────────────────────────── */
function CreateKursModal({ t, onClose, onCreated }) {
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [modulId, setModulId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputStyle = inputStyleFor(t);

  const submit = async () => {
    if (!titel.trim() ) {
      setError("Titel ist erforderlich.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await createKurs({ titel, beschreibung, modulId: modulId.trim() ? modulId : null });
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
      <Field label="Modul-ID (UUID) (optional)">
        <input style={inputStyle} value={modulId} onChange={(e) => setModulId(e.target.value)} placeholder="z. B. 3f9a1b2c-..." />
      </Field>

      {error && <div style={{ color: danger, fontSize: 12, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <GhostButton onClick={onClose}>Abbrechen</GhostButton>
        <PrimaryButton t={t} onClick={submit} disabled={saving}>
          {saving ? "Speichern..." : "Kurs erstellen"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ── Material hinzufügen (PDF oder Link) ────────────────────────────── */
function AddMaterialModal({ t, kursId, onClose, onCreated }) {
  const [tab, setTab] = useState("pdf"); // "pdf" | "link"
  const [titel, setTitel] = useState("");
  const [url, setUrl] = useState("");
  const [datei, setDatei] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputStyle = inputStyleFor(t);

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
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 18,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          padding: 4,
        }}
      >
        {[
          { key: "pdf", label: "PDF hochladen" },
          { key: "link", label: "Link" },
        ].map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: tab === tb.key ? t.accent : "transparent",
              color: tab === tb.key ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <Field label="Titel">
        <input style={inputStyle} value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="z. B. Vorlesungsfolien Woche 3" />
      </Field>

      {tab === "pdf" ? (
        <Field label="PDF-Datei">
          <input type="file" accept="application/pdf" onChange={(e) => setDatei(e.target.files?.[0] ?? null)} style={{ ...inputStyle, padding: "8px 10px" }} />
        </Field>
      ) : (
        <Field label="URL">
          <input style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </Field>
      )}

      {error && <div style={{ color: danger, fontSize: 12, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
        <GhostButton onClick={onClose}>Abbrechen</GhostButton>
        <PrimaryButton t={t} onClick={submit} disabled={saving}>
          {saving ? "Speichern..." : "Hinzufügen"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ── Sortierbare Material-Tabelle ────────────────────────────────────── */
function SortableHeader({ label, sortKey, sort, setSort, accent }) {
  const active = sort.key === sortKey;
  const toggle = () =>
    setSort((s) => ({
      key: sortKey,
      dir: s.key === sortKey && s.dir === "asc" ? "desc" : "asc",
    }));
  return (
    <th
      onClick={toggle}
      style={{
        textAlign: "left",
        padding: "10px 12px",
        fontSize: 11,
        fontWeight: 700,
        color: active ? accent : "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label} {active ? (sort.dir === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}

function MaterialTable({ t, materialien, isProfessor = false, onDeleted }) {
  const [sort, setSort] = useState({ key: "hochgeladenAm", dir: "desc" });
  const [openingId, setOpeningId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { materialId, titel }
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
      const detail = await getMaterialById(materialId);
      if (!detail?.url) throw new Error("Kein Link hinterlegt.");
      const href = detail.url.startsWith("http") ? detail.url : `https://${detail.url}`;
      window.open(href, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err.message || "Link konnte nicht geöffnet werden.");
    } finally {
      setOpeningId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setDeleteError("");
      await deleteMaterial(deleteTarget.materialId);
      setDeleteTarget(null);
      onDeleted?.();
    } catch (err) {
      setDeleteError(err.message || "Material konnte nicht gelöscht werden.");
    } finally {
      setDeleting(false);
    }
  };

  if (materialien.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        Noch keine Lernmaterialien vorhanden.
      </div>
    );
  }

  return (
    <div>
      {deleteError && <div style={{ padding: "8px 12px", fontSize: 12, color: danger }}>{deleteError}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <SortableHeader label="Titel" sortKey="titel" sort={sort} setSort={setSort} accent={t.accent} />
              <SortableHeader label="Typ" sortKey="typ" sort={sort} setSort={setSort} accent={t.accent} />
              <SortableHeader label="Hochgeladen am" sortKey="hochgeladenAm" sort={sort} setSort={setSort} accent={t.accent} />
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
                        color: isPdf ? purple : t.accent,
                        background: isPdf ? `${purple}18` : t.accentGlow,
                        border: `1px solid ${isPdf ? purple : t.accent}44`,
                        borderRadius: 20,
                        padding: "3px 9px",
                      }}
                    >
                      {m.typ}
                    </span>
                  </td>

                  <td style={{ padding: "12px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    {m.hochgeladenAm ? new Date(m.hochgeladenAm).toLocaleDateString("de-DE") : "—"}
                  </td>

                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      {isPdf ? (
                        <button
                          onClick={() => handleDownload(m.materialId)}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: t.accent,
                            background: "transparent",
                            border: `1px solid ${t.accent}44`,
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
                            color: t.accent,
                            background: "transparent",
                            border: `1px solid ${t.accent}44`,
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

                      {isProfessor && (
                        <button
                          onClick={() => setDeleteTarget({ materialId: m.materialId, titel: m.titel })}
                          title="Material löschen"
                          style={{
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: 8,
                            color: danger,
                            cursor: "pointer",
                            flexShrink: 0,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          titel={deleteTarget.titel}
          entityLabel="Material"
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

function KursDetail({ t, kursId, isProfessor, onClose, onSuccess, onKursDeleted }) {
  const [kurs, setKurs] = useState(null);
  const [materialien, setMaterialien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const [showDeleteKurs, setShowDeleteKurs] = useState(false);
  const [deletingKurs, setDeletingKurs] = useState(false);
  const [deleteKursError, setDeleteKursError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [k, m] = await Promise.all([
        getKurs(kursId),
        getMaterialienByKurs(kursId).catch(() => []),
      ]);
      setKurs(k);
      setMaterialien(Array.isArray(m) ? m : []);
    } catch (err) {
      setError(err.message || "Kurs konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [kursId]);

  const handleConfirmDeleteKurs = async () => {
    try {
      setDeletingKurs(true);
      setDeleteKursError("");
      await deleteKurs(kursId);
      setShowDeleteKurs(false);
      onKursDeleted?.(kurs?.titel);
    } catch (err) {
      setDeleteKursError(err.message || "Kurs konnte nicht gelöscht werden.");
    } finally {
      setDeletingKurs(false);
    }
  };

  return (
    <Modal title={kurs?.titel ?? "Kurs"} onClose={onClose} width={720}>
      {loading ? (
        <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          Lade Kurs...
        </div>
      ) : error ? (
        <div style={{ color: danger, padding: 20 }}>{error}</div>
      ) : (
        <>
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "16px 18px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              {kurs?.beschreibung || "Keine Beschreibung vorhanden."}
            </div>

            {isProfessor && (
              <button
                onClick={() => setShowDeleteKurs(true)}
                title="Kurs löschen"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: danger,
                  borderRadius: 8,
                  padding: "7px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Kurs löschen
              </button>
            )}
          </div>

          {deleteKursError && (
            <div style={{ color: danger, fontSize: 12, marginBottom: 14 }}>{deleteKursError}</div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Lernmaterialien</div>
            {isProfessor && (
              <button
                onClick={() => setShowAddMaterial(true)}
                style={{
                  background: t.accentGlow,
                  border: `1px solid ${t.accent}44`,
                  color: t.accent,
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Material hinzufügen
              </button>
            )}
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
            <MaterialTable
              t={t}
              materialien={materialien}
              isProfessor={isProfessor}
              onDeleted={() => {
                load();
                onSuccess?.("Material erfolgreich gelöscht");
              }}
            />
          </div>
        </>
      )}

      {showAddMaterial && (
        <AddMaterialModal
          t={t}
          kursId={kursId}
          onClose={() => setShowAddMaterial(false)}
          onCreated={() => {
            setShowAddMaterial(false);
            load();
            onSuccess?.("Lernmaterial erfolgreich hinzugefügt");
          }}
        />
      )}

      {showDeleteKurs && (
        <DeleteConfirmModal
          titel={kurs?.titel ?? "Dieser Kurs"}
          entityLabel="Kurs"
          hint="Alle zugehörigen Lernmaterialien werden ebenfalls entfernt."
          deleting={deletingKurs}
          onCancel={() => setShowDeleteKurs(false)}
          onConfirm={handleConfirmDeleteKurs}
        />
      )}
    </Modal>
  );
}

/* ── Kurskarte (Section-Look wie Profile.jsx) ─────────────────────────── */
function KursCard({ t, kurs, isProfessor, onOpen, onRequestDelete }) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${t.accent}66`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <button
        onClick={() => onOpen(kurs.kursId)}
        style={{
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: "20px 20px",
          cursor: "pointer",
          color: "#fff",
          fontFamily: "inherit",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentDim})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, paddingRight: isProfessor ? 30 : 0 }}>
            {kurs.titel}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {kurs.beschreibung || "Keine Beschreibung."}
        </div>
        <div style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>
          Details ansehen →
        </div>
      </button>

      {isProfessor && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete(kurs);
          }}
          title="Kurs löschen"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            color: danger,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ── Hauptkomponente ─────────────────────────────────────────────────── */
export default function KurseView({ user, isProfessor = false, onNavigate }) {
  const role = isProfessor ? "professor" : "student";
  const t = getT(role);

  const [kurse, setKurse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [openKursId, setOpenKursId] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  const [deleteCardTarget, setDeleteCardTarget] = useState(null); // Kurs-Objekt
  const [deletingCardKurs, setDeletingCardKurs] = useState(false);
  const [deleteCardError, setDeleteCardError] = useState("");

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

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return kurse;
    return kurse.filter(
      (k) => k.titel?.toLowerCase().includes(q) || k.beschreibung?.toLowerCase().includes(q),
    );
  }, [kurse, search]);

  const handleConfirmDeleteCard = async () => {
    if (!deleteCardTarget) return;
    try {
      setDeletingCardKurs(true);
      setDeleteCardError("");
      await deleteKurs(deleteCardTarget.kursId);
      setDeleteCardTarget(null);
      load();
      showToast(`Kurs "${deleteCardTarget.titel}" erfolgreich gelöscht`);
    } catch (err) {
      setDeleteCardError(err.message || "Kurs konnte nicht gelöscht werden.");
    } finally {
      setDeletingCardKurs(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg1, fontFamily: "inherit", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Header Card – identisch im Aufbau zu Profile.jsx */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "28px 32px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${t.accentGlow}, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Kurse</h1>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.accent,
                    background: t.accentGlow,
                    border: `1px solid ${t.accent}44`,
                    borderRadius: 20,
                    padding: "3px 10px",
                  }}
                >
                  {isProfessor ? "Professor" : "Student"}
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>
                {isProfessor ? "Verwalte deine Kurse und Lernmaterialien" : "Alle verfügbaren Kurse"}
              </p>
            </div>

            {isProfessor && (
              <PrimaryButton t={t} onClick={() => setShowCreate(true)}>
                + Neuer Kurs
              </PrimaryButton>
            )}
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurse durchsuchen..."
            style={{ ...inputStyleFor(t), marginTop: 22, maxWidth: 340 }}
          />
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            Lade Kurse...
          </div>
        ) : error ? (
          <div style={{ color: danger, padding: 20 }}>{error}</div>
        ) : filtered.length === 0 ? (
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
            Keine Kurse gefunden.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
              gap: 16,
            }}
          >
            {filtered.map((k) => (
              <KursCard
                key={k.kursId}
                t={t}
                kurs={k}
                isProfessor={isProfessor}
                onOpen={setOpenKursId}
                onRequestDelete={setDeleteCardTarget}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateKursModal
          t={t}
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
          t={t}
          kursId={openKursId}
          isProfessor={isProfessor}
          onClose={() => setOpenKursId(null)}
          onSuccess={showToast}
          onKursDeleted={(titel) => {
            setOpenKursId(null);
            load();
            showToast(`Kurs "${titel}" erfolgreich gelöscht`);
          }}
        />
      )}

      {deleteCardTarget && (
        <DeleteConfirmModal
          titel={deleteCardTarget.titel}
          entityLabel="Kurs"
          hint="Alle zugehörigen Lernmaterialien werden ebenfalls entfernt."
          deleting={deletingCardKurs}
          onCancel={() => {
            setDeleteCardTarget(null);
            setDeleteCardError("");
          }}
          onConfirm={handleConfirmDeleteCard}
        />
      )}
      {deleteCardError && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 200,
            color: danger,
            background: "#111c33",
            border: `1px solid ${danger}55`,
            borderRadius: 10,
            padding: "10px 16px",
            fontSize: 12,
          }}
        >
          {deleteCardError}
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} accent={t.accent} onClose={() => setToast(null)} />
      )}
    </div>
  );
}