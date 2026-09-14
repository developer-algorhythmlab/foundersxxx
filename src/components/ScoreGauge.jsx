import { useEffect, useState } from "react";
import { useTheme } from "../theme.jsx";

// Semi-circular gauge that animates from 0 to the score when the page opens.
export default function ScoreGauge({
  score,
  min = 0,
  max = 850,
  label,
  band,
  change,
  size = 200,
}) {
  const { colors, reduceMotion } = useTheme();
  const [shown, setShown] = useState(reduceMotion ? score : min);

  useEffect(() => {
    if (reduceMotion) {
      setShown(score);
      return;
    }
    // animate the arc + number together
    let start;
    let raf;
    const dur = 1200;
    const step = (t) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(min + (score - min) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score, min, reduceMotion]);

  const pct = Math.max(0, Math.min(1, (shown - min) / (max - min)));
  const radius = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;
  const circ = Math.PI * radius;
  const dash = circ * pct;

  const finalPct = (score - min) / (max - min);
  const color =
    finalPct >= 0.72 ? "var(--good)" : finalPct >= 0.5 ? "var(--violet)" : "var(--warn)";

  const gid = `g-${(label || "s").replace(/\s/g, "")}`;

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        width={size}
        height={size / 2 + 30}
        viewBox={`0 0 ${size} ${size / 2 + 30}`}
        role="img"
        aria-label={`${label}: ${score} out of ${max}, ${band}`}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: colors.c1 }} />
            <stop offset="100%" style={{ stopColor: colors.c2 }} />
          </linearGradient>
        </defs>
        <path
          d={`M ${16} ${cy} A ${radius} ${radius} 0 0 1 ${size - 16} ${cy}`}
          fill="none"
          stroke="var(--line)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${16} ${cy} A ${radius} ${radius} 0 0 1 ${size - 16} ${cy}`}
          fill="none"
          stroke={finalPct >= 0.5 ? `url(#${gid})` : color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 700,
            fill: "var(--ink)",
          }}
        >
          {Math.round(shown)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 12, fill: "var(--muted)" }}>
          / {max}
        </text>
      </svg>
      <div style={{ marginTop: -6 }}>
        <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--ink)" }}>{label}</div>
        <div
          style={{
            marginTop: 4,
            display: "inline-flex",
            gap: 8,
            alignItems: "center",
            fontSize: "0.8rem",
          }}
        >
          <span
            style={{
              padding: "2px 10px",
              borderRadius: 999,
              background: "var(--panel-tint)",
              color: "var(--violet-deep)",
              fontWeight: 600,
            }}
          >
            {band}
          </span>
          {change != null && (
            <span style={{ color: change >= 0 ? "var(--good)" : "var(--bad)", fontWeight: 600 }}>
              {change >= 0 ? "▲" : "▼"} {Math.abs(change)} pts
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
