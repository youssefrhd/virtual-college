import { useState } from "react";
import { ROLES } from "../config/roles";

export default function ResendTimer({ role, email }) {
  const t = ROLES[role];
  const [seconds, setSeconds] = useState(60);
  const [resent,  setResent]  = useState(false);
 
  useState(() => {
    const id = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(id); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, []);
 
  const handleResend = async () => {
    if (seconds > 0) return;
    try {
      
      setSeconds(60);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setSeconds(60);
    }
  };
 
  return (
    <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
      {resent ? (
        <span style={{ color: "#86EFAC" }}>Code erneut gesendet ✓</span>
      ) : seconds > 0 ? (
        <>Code erneut senden in <span style={{ color: t.accent, fontWeight: 600 }}>{seconds}s</span></>
      ) : (
        <button
          onClick={handleResend}
          style={{ background: "none", border: "none", cursor: "pointer", color: t.accent, fontSize: 12, fontFamily: "inherit", fontWeight: 600, padding: 0 }}
        >
          Code erneut senden →
        </button>
      )}
    </p>
  );
}