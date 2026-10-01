import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ style, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input {...props} type={show ? "text" : "password"} style={{ ...style, paddingRight: 44 }} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          color: "var(--muted, #6b7280)",
          cursor: "pointer",
          padding: 6,
          display: "grid",
          placeItems: "center",
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
