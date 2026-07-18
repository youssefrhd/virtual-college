import React, { useEffect, useState, useCallback } from "react";
import TopNav from "../components/TopNav";
import { getVerfuegbarePruefungen, pruefungAnmelden, pruefungAbmelden } from "../api/authApi";

const T = {
  bg1: "#0f172a",
  accent: "#06b6d4",
  accentDim: "#0891b2",
  accentGlow: "rgba(6,182,212,0.15)",
  success: "#22c55e",
  danger: "#ef4444",
};

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const color = type === "success" ? T.success : T.danger;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      display: "flex", alignItems: "center", gap: 12,
      background: "#111c33", border: `1px solid ${color}55`,
      borderRadius: 14, padding: "14px 18px", minWidth: 280, maxWidth: 380,
      boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      animation: "toastIn 0.3s ease forwards",
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", flex: 1 }}>{message}</div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>×</button>
      <style>{`@keyframes toastIn { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }`}</style>
    </div>
  );
}

function StatusPill({ p }) {
  if (p.anmeldungStatus === "ANGEMELDET") {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: T.success, background: `${T.success}18`, border: `1px solid ${T.success}44`, borderRadius: 20, padding: "3px 10px" }}>
        Angemeldet
      </span>
    );
  }
  if (!p.anmeldungMoeglich) {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "3px 10px" }}>
        Anmeldung geschlossen
      </span>
    );
  }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, background: T.accentGlow, border: `1px solid ${T.accent}44`, borderRadius: 20, padding: "3px 10px" }}>
      Anmeldung offen
    </span>
  );
}

function PruefungCard({ p, onAnmelden, onAbmelden, busy }) {
  const isAngemeldet = p.anmeldungStatus === "ANGEMELDET";

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "18px 20px", display: "flex", justifyContent: "space-between",
      alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{p.bezeichnung}</div>
          <StatusPill p={p} />
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
          {p.modulBezeichnung ?? "—"} · {p.pruefungstyp}
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          <span>📅 {p.datum ? new Date(p.datum).toLocaleDateString("de-DE") : "—"}</span>
          <span>📍 {p.raum ?? "—"}</span>
          <span>🕐 Anmeldung: {new Date(p.anmeldungStart).toLocaleDateString("de-DE")} – {new Date(p.anmeldungEnde).toLocaleDateString("de-DE")}</span>
        </div>
      </div>

      <div>
        {isAngemeldet ? (
          <button
            onClick={() => onAbmelden(p.pruefungId)}
            disabled={busy}
            style={{
              background: "transparent", border: `1px solid ${T.danger}55`, color: T.danger,
              borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600,
              cursor: busy ? "default" : "pointer", fontFamily: "inherit", opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "..." : "Abmelden"}
          </button>
        ) : (
          <button
            onClick={() => onAnmelden(p.pruefungId)}
            disabled={busy || !p.anmeldungMoeglich}
            style={{
              background: p.anmeldungMoeglich ? `linear-gradient(135deg, ${T.accent}, ${T.accentDim})` : "rgba(255,255,255,0.06)",
              border: "none", color: p.anmeldungMoeglich ? "#fff" : "rgba(255,255,255,0.3)",
              borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600,
              cursor: busy || !p.anmeldungMoeglich ? "default" : "pointer",
              fontFamily: "inherit", opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "..." : "Anmelden"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PruefungsanmeldungView({ user, onNavigate }) {
  const [pruefungen, setPruefungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("alle"); // alle | angemeldet | offen

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getVerfuegbarePruefungen();
      setPruefungen(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Prüfungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAnmelden = async (pruefungId) => {
    try {
      setBusyId(pruefungId);
      await pruefungAnmelden(pruefungId);
      await load();
      setToast({ message: "Erfolgreich zur Prüfung angemeldet", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Anmeldung fehlgeschlagen", type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const handleAbmelden = async (pruefungId) => {
    try {
      setBusyId(pruefungId);
      await pruefungAbmelden(pruefungId);
      await load();
      setToast({ message: "Von der Prüfung abgemeldet", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Abmeldung fehlgeschlagen", type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const filtered = pruefungen.filter((p) => {
    if (filter === "angemeldet") return p.anmeldungStatus === "ANGEMELDET";
    if (filter === "offen") return p.anmeldungMoeglich && p.anmeldungStatus !== "ANGEMELDET";
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: T.bg1, fontFamily: "inherit", color: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Prüfungsanmeldung</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
            Melde dich für anstehende Prüfungen an oder wieder ab
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {[
            { key: "alle", label: "Alle" },
            { key: "offen", label: "Offen" },
            { key: "angemeldet", label: "Angemeldet" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: filter === f.key ? T.accent : "transparent",
              color: filter === f.key ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Lade Prüfungen...</div>
        ) : error ? (
          <div style={{ color: T.danger, padding: 20 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            Keine Prüfungen in dieser Ansicht.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((p) => (
              <PruefungCard
                key={p.pruefungId}
                p={p}
                busy={busyId === p.pruefungId}
                onAnmelden={handleAnmelden}
                onAbmelden={handleAbmelden}
              />
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}