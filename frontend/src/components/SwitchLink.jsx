import { useState } from "react";

export default function SwitchLink({ t, onSwitch }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        onClick={onSwitch}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ background: "none", border: "none", cursor: "pointer", color: hover ? t.accent : "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "inherit", transition: "color 0.2s" }}
      >
        {t.switchLabel}
      </button>
    </div>
  );
}