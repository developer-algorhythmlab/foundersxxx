import { stageLabels } from "../data/appData";

// Horizontal stepper: 1 Formalized -> 2 Investment Ready -> 3 Incubated -> 4 Supply Chain
export default function StageProgress({ current = 2 }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
      {stageLabels.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div
            key={label}
            style={{ flex: 1, position: "relative", textAlign: "center" }}
          >
            {i < stageLabels.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 17,
                  left: "50%",
                  right: "-50%",
                  height: 3,
                  background: done ? "var(--violet)" : "var(--line)",
                }}
              />
            )}
            <div
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: "50%",
                margin: "0 auto",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: done || active ? "#fff" : "var(--muted)",
                background:
                  done || active ? "var(--grad-brand)" : "var(--surface)",
                border: `2px solid ${
                  done || active ? "transparent" : "var(--line-strong)"
                }`,
                boxShadow: active ? "0 0 0 6px var(--panel-tint)" : "none",
              }}
            >
              {done ? "✓" : n}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: "0.78rem",
                fontWeight: active ? 700 : 500,
                color: active ? "var(--violet-deep)" : "var(--muted)",
                padding: "0 6px",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
