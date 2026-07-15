import React from "react";
import NotificationBell from "./NotificationBell";

const T_ACCENT = "#06b6d4";
const T_ACCENT_DIM = "#0891b2";
const T_GLOW = "rgba(6,182,212,0.15)";

const NAV_ITEMS = {
  student: [
    { label: "Studienfortschritt", view: "progress" },
    { label: "Kurse", view: "kurse" },
    { label: "Profil", view: "profile" },
  ],
  professor: [
    { label: "Dashboard", view: "dashboard" },
    { label: "Kurse", view: "kurse" },
    { label: "Profil", view: "profile" },
  ],
};

export default function TopNav({ role = "student", activeView, onNavigate, user }) {
  const items = NAV_ITEMS[role] ?? NAV_ITEMS.student;

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(15,23,42,0.88)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "0 24px", height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: `linear-gradient(135deg, ${T_ACCENT}, ${T_ACCENT_DIM})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Virtual College</span>
      </div>

      <nav style={{ display: "flex", gap: 4 }}>
        {items.map((n) => {
          const active = n.view === activeView;
          return (
            <button
              key={n.view}
              onClick={() => onNavigate?.(n.view)}
              style={{
                background: active ? "rgba(6,182,212,0.12)" : "transparent",
                border: active ? `1px solid ${T_ACCENT}33` : "1px solid transparent",
                borderRadius: 8, padding: "6px 14px",
                color: active ? T_ACCENT : "rgba(255,255,255,0.45)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              {n.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <NotificationBell />
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: T_GLOW,
          border: `2px solid ${T_ACCENT}`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, fontWeight: 700, color: T_ACCENT,
        }}>
          {(user?.name ?? "M").charAt(0)}
        </div>
      </div>
    </div>
  );
}