
export const ROLES = {
  student: {
    key: "student",
    label: "Student",
    accent: "#06B6D4",
    accentDim: "#0891B2",
    accentGlow: "rgba(6,182,212,0.35)",
    bg1: "#0F172A",
    bg2: "#1E3A5F",
    bg3: "#0C4A6E",
    tag: "Studentenportal",
    switchLabel: "Ich bin Professor →",
    switchRole: "professor",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  professor: {
    key: "professor",
    label: "Professor",
    accent: "#D97706",
    accentDim: "#B45309",
    accentGlow: "rgba(217,119,6,0.35)",
    bg1: "#0D1F1A",
    bg2: "#1A3A2A",
    bg3: "#14532D",
    tag: "Dozentenportal",
    switchLabel: "← Ich bin Student",
    switchRole: "student",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        <path d="M16 3.5l2 2-6 6-2-2 6-6z" strokeWidth="1.4"/>
      </svg>
    ),
  },
};