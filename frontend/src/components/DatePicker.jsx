import { useState } from "react";
import { ROLES } from "../config/roles";
import ChevronIcon from "../components/ChevronIcon"
export default function DatePicker({ label, value, onChange, role }) {
  const t = ROLES[role];
 
  const [y, m, d] = value ? value.split("-") : ["", "", ""];
 
  const update = (ny, nm, nd) => {
    if (ny && nm && nd) onChange(`${ny}-${nm.padStart(2,"0")}-${nd.padStart(2,"0")}`);
    else onChange("");
  };
 
  const days   = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: "01", label: "Januar" },  { value: "02", label: "Februar" },
    { value: "03", label: "März" },    { value: "04", label: "April" },
    { value: "05", label: "Mai" },     { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },    { value: "08", label: "August" },
    { value: "09", label: "September"},{ value: "10", label: "Oktober" },
    { value: "11", label: "November" },{ value: "12", label: "Dezember" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 17 - i);
 
  const selectStyle = (hasValue, focused) => ({
    flex: 1,
    padding: "12px 28px 12px 12px",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${focused ? t.accent : "rgba(255,255,255,0.12)"}`,
    borderRadius: 10,
    color: hasValue ? "#fff" : "rgba(255,255,255,0.3)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focused ? `0 0 0 3px ${t.accentGlow}` : "none",
    fontFamily: "inherit",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    minWidth: 0,
  });
 
  const [focusD, setFocusD] = useState(false);
  const [focusM, setFocusM] = useState(false);
  const [focusY, setFocusY] = useState(false);
 
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)",
        marginBottom: 6, textTransform: "uppercase",
      }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 8 }}>
 
        <div style={{ position: "relative", flex: "0 0 80px" }}>
          <select value={d} onChange={e => update(y, m, e.target.value)}
            onFocus={() => setFocusD(true)} onBlur={() => setFocusD(false)}
            style={selectStyle(!!d, focusD)}>
            <option value="" disabled style={{ background: "#1a1a2e" }}>TT</option>
            {days.map(n => (
              <option key={n} value={String(n).padStart(2,"0")}
                style={{ background: "#1a1a2e", color: "#fff" }}>
                {n}
              </option>
            ))}
          </select>
          <ChevronIcon color={d ? t.accent : "rgba(255,255,255,0.3)"} />
        </div>
 
        <div style={{ position: "relative", flex: "1 1 0" }}>
          <select value={m} onChange={e => update(y, e.target.value, d)}
            onFocus={() => setFocusM(true)} onBlur={() => setFocusM(false)}
            style={selectStyle(!!m, focusM)}>
            <option value="" disabled style={{ background: "#1a1a2e" }}>Monat</option>
            {months.map(mo => (
              <option key={mo.value} value={mo.value}
                style={{ background: "#1a1a2e", color: "#fff" }}>
                {mo.label}
              </option>
            ))}
          </select>
          <ChevronIcon color={m ? t.accent : "rgba(255,255,255,0.3)"} />
        </div>
 
        <div style={{ position: "relative", flex: "0 0 96px" }}>
          <select value={y} onChange={e => update(e.target.value, m, d)}
            onFocus={() => setFocusY(true)} onBlur={() => setFocusY(false)}
            style={selectStyle(!!y, focusY)}>
            <option value="" disabled style={{ background: "#1a1a2e" }}>JJJJ</option>
            {years.map(yr => (
              <option key={yr} value={String(yr)}
                style={{ background: "#1a1a2e", color: "#fff" }}>
                {yr}
              </option>
            ))}
          </select>
          <ChevronIcon color={y ? t.accent : "rgba(255,255,255,0.3)"} />
        </div>
 
      </div>
    </div>
  );
}
 
