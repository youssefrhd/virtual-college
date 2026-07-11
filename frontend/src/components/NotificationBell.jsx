import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  getBenachrichtigungen,
  getUngeleseneCount,
  markiereAlsGelesen,
  markiereAlleAlsGelesen,
} from "../api/authApi";

const T_ACCENT = "#06b6d4";
const T_ACCENT_DIM = "#0891b2";
const T_DANGER = "#ef4444";

const POLL_INTERVAL_MS = 15000;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Std.`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `vor ${diffD} Tag${diffD > 1 ? "en" : ""}`;
  return date.toLocaleDateString("de-DE");
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const wrapperRef = useRef(null);

  const loadCount = useCallback(async () => {
    try {
      const res = await getUngeleseneCount();
      setCount(res?.count ?? 0);
    } catch (err) {
      // Zähler ist sekundär, still fehlschlagen und beim nächsten Poll erneut versuchen
      console.error("Benachrichtigungs-Zähler konnte nicht geladen werden:", err);
    }
  }, []);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBenachrichtigungen();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Benachrichtigungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initiales Laden + Polling für Echtzeit-Aktualisierung
  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadCount]);

  // Klick außerhalb schließt das Dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) loadList();
  };

  const handleMarkOne = async (id) => {
    try {
      await markiereAlsGelesen(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, gelesen: true } : n)));
      setCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Konnte Benachrichtigung nicht als gelesen markieren:", err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markiereAlleAlsGelesen();
      setItems((prev) => prev.map((n) => ({ ...n, gelesen: true })));
      setCount(0);
    } catch (err) {
      console.error("Konnte nicht alle als gelesen markieren:", err);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={toggleOpen}
        aria-label="Benachrichtigungen"
        style={{
          position: "relative", width: 36, height: 36, borderRadius: 10,
          background: open ? "rgba(6,182,212,0.14)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? T_ACCENT + "55" : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={open ? T_ACCENT : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>

        {count > 0 && (
          <span style={{
            position: "absolute", top: -5, right: -5,
            minWidth: 18, height: 18, padding: "0 4px",
            borderRadius: 999, background: T_DANGER,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#fff",
            border: "2px solid #0f172a",
            animation: "pulseNotif 2s ease-in-out infinite",
          }}>
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: 46, right: 0, width: 340, maxHeight: 420,
          background: "#111c33", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          overflow: "hidden", zIndex: 150,
          animation: "dropdownIn 0.2s ease forwards",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Benachrichtigungen</div>
            {count > 0 && (
              <button onClick={handleMarkAll} style={{
                background: "none", border: "none", color: T_ACCENT,
                fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>
                Alle als gelesen markieren
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading ? (
              <div style={{ padding: 28, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                Lade Benachrichtigungen...
              </div>
            ) : error ? (
              <div style={{ padding: 20, color: T_DANGER, fontSize: 12 }}>{error}</div>
            ) : items.length === 0 ? (
              <div style={{ padding: 28, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                Keine Benachrichtigungen vorhanden.
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.gelesen && handleMarkOne(n.id)}
                  style={{
                    width: "100%", textAlign: "left", display: "flex", gap: 10,
                    padding: "12px 16px", background: n.gelesen ? "transparent" : "rgba(6,182,212,0.06)",
                    border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: n.gelesen ? "default" : "pointer", fontFamily: "inherit",
                  }}
                >
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                    background: n.gelesen ? "transparent" : T_ACCENT,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: n.gelesen ? 400 : 600, color: n.gelesen ? "rgba(255,255,255,0.55)" : "#fff", lineHeight: 1.4 }}>
                      {n.titel || n.nachricht}
                    </div>
                    {n.titel && n.nachricht && (
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2, lineHeight: 1.4 }}>
                        {n.nachricht}
                      </div>
                    )}
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                      {timeAgo(n.erstelltAm)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseNotif {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}