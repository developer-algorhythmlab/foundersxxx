// Visualises the MVP data flow from the requirements doc.
const NODES = [
  { id: "onboard", label: "SMME\nOnboarding", x: 40, y: 30 },
  { id: "vault", label: "FoundrVault\n(Docs)", x: 250, y: 30 },
  { id: "credit", label: "Dual Credit\nCheck", x: 460, y: 30 },
  { id: "stage", label: "Stage\nAssignment", x: 460, y: 150 },
  { id: "aggregate", label: "Aggregate\nCohort Data", x: 250, y: 150 },
  { id: "partner", label: "Partner\nDashboard", x: 40, y: 150 },
  { id: "community", label: "Community &\nMentorship", x: 460, y: 270 },
];

const NODE_W = 150;
const NODE_H = 70;

function Node({ n, tone }) {
  const fill = tone === "brand" ? "url(#nodeBrand)" : "var(--surface)";
  const stroke = tone === "brand" ? "none" : "var(--line-strong)";
  const text = tone === "brand" ? "#ffffff" : "var(--ink)";
  return (
    <g>
      <rect
        x={n.x}
        y={n.y}
        width={NODE_W}
        height={NODE_H}
        rx="14"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {n.label.split("\n").map((line, i) => (
        <text
          key={i}
          x={n.x + NODE_W / 2}
          y={n.y + NODE_H / 2 - 6 + i * 18}
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 14,
            fill: text,
          }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--lilac)"
      strokeWidth="2.5"
      markerEnd="url(#arrow)"
    />
  );
}

export default function LifecycleFlow() {
  return (
    <svg viewBox="0 0 620 350" width="100%" role="img" aria-label="MVP data flow">
      <defs>
        <linearGradient id="nodeBrand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--indigo)" }} />
          <stop offset="100%" style={{ stopColor: "var(--violet)" }} />
        </linearGradient>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--violet)" />
        </marker>
      </defs>

      {/* top row left-to-right */}
      <Arrow x1={190} y1={65} x2={248} y2={65} />
      <Arrow x1={400} y1={65} x2={458} y2={65} />
      {/* credit -> stage (down) */}
      <Arrow x1={535} y1={100} x2={535} y2={148} />
      {/* stage -> aggregate (left) */}
      <Arrow x1={458} y1={185} x2={402} y2={185} />
      {/* aggregate -> partner (left) */}
      <Arrow x1={248} y1={185} x2={192} y2={185} />
      {/* stage -> community (down) */}
      <Arrow x1={535} y1={220} x2={535} y2={268} />

      <Node n={NODES[0]} tone="brand" />
      <Node n={NODES[1]} tone="brand" />
      <Node n={NODES[2]} tone="brand" />
      <Node n={NODES[3]} />
      <Node n={NODES[4]} />
      <Node n={NODES[5]} tone="brand" />
      <Node n={NODES[6]} />
    </svg>
  );
}
