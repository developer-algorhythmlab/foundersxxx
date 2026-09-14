import { useEffect, useRef, useState } from "react";
import { PersonStanding, Check, X, Type, Gauge } from "lucide-react";
import { useTheme, THEMES } from "../theme.jsx";

export default function AccessibilityMenu() {
  const { theme, setTheme, largeText, setLargeText, reduceMotion, setReduceMotion } =
    useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className="a11y-fab"
        aria-label="Accessibility and theme options"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <PersonStanding size={24} />
      </button>

      {open && (
        <div className="a11y-panel" ref={panelRef} role="dialog" aria-label="Accessibility options">
          <div style={styles.head}>
            <strong style={{ fontFamily: "var(--font-display)" }}>Accessibility</strong>
            <button onClick={() => setOpen(false)} aria-label="Close" style={styles.x}>
              <X size={18} />
            </button>
          </div>

          <p style={styles.section}>Theme</p>
          <div style={styles.themeGrid}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  ...styles.themeBtn,
                  borderColor: theme === t.id ? "var(--violet)" : "var(--line-strong)",
                  background: theme === t.id ? "var(--panel-tint)" : "var(--surface)",
                }}
              >
                <span style={styles.swatches}>
                  {t.swatch.map((c, i) => (
                    <span key={i} style={{ ...styles.swatch, background: c }} />
                  ))}
                </span>
                <span style={styles.themeLabel}>
                  {t.label}
                  {theme === t.id && <Check size={14} color="var(--violet)" />}
                </span>
              </button>
            ))}
          </div>

          <p style={styles.section}>Display</p>
          <Toggle
            icon={Type}
            label="Larger text"
            on={largeText}
            onToggle={() => setLargeText((v) => !v)}
          />
          <Toggle
            icon={Gauge}
            label="Reduce motion"
            on={reduceMotion}
            onToggle={() => setReduceMotion((v) => !v)}
          />
        </div>
      )}
    </>
  );
}

function Toggle({ icon: Icon, label, on, onToggle }) {
  return (
    <button onClick={onToggle} style={styles.toggleRow} aria-pressed={on}>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={17} color="var(--violet-deep)" />
        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)" }}>{label}</span>
      </span>
      <span style={{ ...styles.switch, background: on ? "var(--grad-brand)" : "var(--line-strong)" }}>
        <span style={{ ...styles.knob, transform: on ? "translateX(18px)" : "translateX(0)" }} />
      </span>
    </button>
  );
}

const styles = {
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  x: { border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer" },
  section: {
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: "0.66rem",
    fontWeight: 700,
    color: "var(--muted)",
    margin: "14px 0 8px",
  },
  themeGrid: { display: "grid", gap: 8 },
  themeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--line-strong)",
    cursor: "pointer",
  },
  swatches: { display: "flex", gap: 4 },
  swatch: { width: 16, height: 16, borderRadius: 5, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" },
  themeLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.86rem",
    fontWeight: 600,
    color: "var(--ink)",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 4px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  switch: {
    width: 38,
    height: 20,
    borderRadius: 999,
    padding: 2,
    transition: "background 0.2s ease",
    flex: "0 0 auto",
  },
  knob: {
    display: "block",
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
};
