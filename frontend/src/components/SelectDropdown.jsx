import { useState } from "react";
import { ROLES } from "../config/roles";
export default function Select({ label, value, onChange, options, placeholder, role }) {
  const t = ROLES[role];
  const [focused, setFocused] = useState(false);
 
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)",
        marginBottom: 6, textTransform: "uppercase",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "12px 40px 12px 16px",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${focused ? t.accent : "rgba(255,255,255,0.12)"}`,
            borderRadius: 10,
            color: value ? "#fff" : "rgba(255,255,255,0.3)",
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px ${t.accentGlow}` : "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
          }}
        >
          <option value="" disabled style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.4)" }}>
            {placeholder}
          </option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}
              style={{ background: "#1a1a2e", color: "#fff" }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: value ? t.accent : "rgba(255,255,255,0.3)",
          transition: "color 0.2s",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  );
}