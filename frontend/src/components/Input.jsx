import { useState } from "react";
import { ROLES } from "../config/roles";

export default function Input ({ label, type = "text", value, onChange, placeholder, role }) {
  const t = ROLES[role];
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPass && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "12px 16px",
            paddingRight: isPass ? 44 : 16,
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${focused ? t.accent : "rgba(255,255,255,0.12)"}`,
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px ${t.accentGlow}` : "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4, display: "flex" }}
          >
            {show ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};