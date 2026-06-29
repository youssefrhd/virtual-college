import { ROLES } from "../config/roles";

export default function CodeInput({ value, onChange, role }) {
  const t = ROLES[role];
  const digits = 6;
  const chars  = value.split("").slice(0, digits);
  while (chars.length < digits) chars.push("");
 
  const inputRefs = Array.from({ length: digits }, () => null);
 
  const handleChange = (i, val) => {
    const clean = val.replace(/\D/g, "").slice(-1); 
    const next  = [...chars];
    next[i]     = clean;
    onChange(next.join(""));
    if (clean && i < digits - 1) inputRefs[i + 1]?.focus();
  };
 
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      inputRefs[i - 1]?.focus();
    }
  };
 
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, digits);
    onChange(pasted.padEnd(digits, "").slice(0, digits));
    const focusIdx = Math.min(pasted.length, digits - 1);
    inputRefs[focusIdx]?.focus();
  };
 
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "8px 0 24px" }}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={el => (inputRefs[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={ch}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            background: ch ? `${t.accentGlow}` : "rgba(255,255,255,0.06)",
            border: `1px solid ${ch ? t.accent : "rgba(255,255,255,0.12)"}`,
            borderRadius: 10,
            outline: "none",
            transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
            boxShadow: ch ? `0 0 0 3px ${t.accentGlow}` : "none",
            fontFamily: "inherit",
            caretColor: "transparent",
            cursor: "text",
          }}
        />
      ))}
    </div>
  );
}