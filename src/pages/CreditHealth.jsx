import { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { credit, repairPlan, utilisation, debtComposition, radarFactors } from "../data/appData";
import ScoreGauge from "../components/ScoreGauge.jsx";
import { AnimatedBar, CountUp } from "../lib.jsx";
import { useTheme } from "../theme.jsx";
import ExportButton, { SectionHeader } from "../components/ExportButton.jsx";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Wrench,
  PieChart as PieIcon,
  Radar as RadarIcon,
} from "lucide-react";

function FactorRow({ f, delay }) {
  const color = f.value >= 70 ? "var(--good)" : f.value >= 50 ? "var(--violet)" : "var(--warn)";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
        <strong>{f.name}</strong>
        <span style={{ color, fontWeight: 700 }}>{f.value}</span>
      </div>
      <div style={{ margin: "6px 0 4px" }}>
        <AnimatedBar value={f.value} height={6} color={color} delay={delay} />
      </div>
      <div className="muted" style={{ fontSize: "0.75rem" }}>{f.note}</div>
    </div>
  );
}

function CreditCard({ data }) {
  return (
    <div className="card pad">
      <div style={{ display: "grid", placeItems: "center" }}>
        <ScoreGauge {...data} label={data.label} size={190} />
      </div>
      <div style={{ marginTop: 18, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>What's driving this score</p>
        {data.factors.map((f, i) => (
          <FactorRow key={f.name} f={f} delay={i * 120} />
        ))}
      </div>
    </div>
  );
}

const PRIORITY = ["Critical", "Critical", "High", "High"];

function ImproveCard({ fixes, ratio, limit, healthyMax }) {
  const [done, setDone] = useState({});
  const hasData = limit > 0;
  const critical = hasData && ratio > healthyMax;
  const doneCount = fixes.filter((_, i) => done[i]).length;
  const pct = Math.round((doneCount / fixes.length) * 100);
  const accent = critical ? "var(--bad)" : "var(--good)";

  return (
    <div className={critical ? "critical-card" : ""} style={{ padding: 16, borderRadius: 14, border: `1px solid ${critical ? "var(--bad)" : "var(--line-strong)"}`, background: "var(--panel-tint)" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <Wrench size={16} color={accent} />
        <strong style={{ fontSize: "0.9rem" }}>How to improve it</strong>
        {critical && <span className="critical-badge">Critical — act now</span>}
        <span className="muted" style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700 }}>{doneCount}/{fixes.length} done</span>
      </div>

      {!hasData && (
        <div role="alert" style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, fontSize: "0.8rem", fontWeight: 600, color: "var(--warn)" }}>
          <AlertTriangle size={14} /> Information missing — add your credit limit and balance to see your live utilisation.
        </div>
      )}
      {critical && (
        <p style={{ margin: "0 0 10px", fontSize: "0.8rem", fontWeight: 600, color: "var(--bad)" }}>
          You're at {ratio}% — above the {healthyMax}% healthy ceiling. Funders will flag this. Tick each step as you complete it.
        </p>
      )}

      <div style={{ height: 6, borderRadius: 999, background: "var(--line)", overflow: "hidden", marginBottom: 12 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--good)", transition: "width 0.4s ease" }} />
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {fixes.map((t, i) => {
          const on = !!done[i];
          const tag = PRIORITY[i] || "High";
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                aria-pressed={on}
                className="fix-item"
                style={{ opacity: on ? 0.6 : 1 }}
              >
                {on ? <CheckCircle2 size={18} color="var(--good)" style={{ flex: "0 0 auto" }} /> : <Circle size={18} color={critical ? "var(--bad)" : "var(--muted)"} style={{ flex: "0 0 auto" }} />}
                <span style={{ flex: 1, textAlign: "left", fontSize: "0.83rem", lineHeight: 1.5, color: "var(--ink)", textDecoration: on ? "line-through" : "none" }}>{t}</span>
                <span className={`fix-tag ${tag === "Critical" ? "fix-tag-critical" : ""}`}>{tag}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CreditHealth() {
  const { colors } = useTheme();
  const [plan, setPlan] = useState(repairPlan);

  function toggle(id) {
    setPlan((p) => p.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  }
  const doneCount = plan.filter((r) => r.done).length;

  const pieColors = [colors.c1, colors.c2, colors.c3, colors.c4];
  const factorData = credit.business.factors.map((f) => ({ name: f.name, value: f.value }));

  // ---- PDF section blocks ----
  const scoresBlocks = [
    {
      type: "table",
      head: [["Profile", "Score", "Band", "12-mo change"]],
      body: [
        [credit.personal.label, `${credit.personal.score} / ${credit.personal.max}`, credit.personal.band, `+${credit.personal.change} pts`],
        [credit.business.label, `${credit.business.score} / ${credit.business.max}`, credit.business.band, `+${credit.business.change} pts`],
      ],
    },
    { type: "heading", text: "Personal factors" },
    { type: "table", head: [["Factor", "Score", "Note"]], body: credit.personal.factors.map((f) => [f.name, f.value, f.note]), striped: true },
    { type: "heading", text: "Business factors" },
    { type: "table", head: [["Factor", "Score", "Note"]], body: credit.business.factors.map((f) => [f.name, f.value, f.note]), striped: true },
  ];

  const utilBlocks = [
    { type: "kv", rows: [["Utilisation", `${utilisation.ratio}%`], ["Used", `R${utilisation.used.toLocaleString()}`], ["Limit", `R${utilisation.limit.toLocaleString()}`], ["Healthy target", `<= ${utilisation.healthyMax}%`]] },
    { type: "heading", text: "What makes it bad" },
    { type: "bullets", items: utilisation.whatMakesItBad },
    { type: "heading", text: "How to improve it" },
    { type: "bullets", items: utilisation.howToFix },
  ];

  const debtBlocks = [{ type: "table", head: [["Debt type", "Share"]], body: debtComposition.map((d) => [d.name, `${d.value}%`]), striped: true }];

  const radarBlocks = [
    { type: "text", text: "Common credit dimensions scored out of 100 for the personal (director) and business records." },
    { type: "table", head: [["Dimension", "Personal", "Business"]], body: radarFactors.map((r) => [r.dimension, r.personal, r.business]) },
  ];

  const factorBlocks = [{ type: "table", head: [["Business factor", "Score / 100"]], body: factorData.map((f) => [f.name, f.value]), striped: true }];

  const planBlocks = [{ type: "table", head: [["Action", "Impact", "Est. lift", "Status"]], body: plan.map((r) => [r.title, r.impact, r.lift, r.done ? "Done" : "To do"]), striped: true }];

  return (
    <div className="grid reveal" style={{ gap: 20 }}>
      <div
        className="card pad"
        style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "var(--panel-tint)", border: "1px solid var(--line-strong)" }}
      >
        <TrendingUp size={22} color="var(--violet-deep)" style={{ flex: "0 0 auto", marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
            <h3 className="section-title" style={{ marginBottom: 2 }}>360° dual credit view</h3>
            <ExportButton title="Credit Scores" blocks={scoresBlocks} filename="FoundrX_Credit_Scores.pdf" />
          </div>
          <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
            FoundrX tracks both your <strong>personal director score</strong> and your{" "}
            <strong>business commercial score</strong> — the two numbers every funder checks
            before approving capital.
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        <CreditCard data={credit.personal} />
        <CreditCard data={credit.business} />
      </div>

      {/* CREDIT UTILISATION */}
      <div className="card pad">
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
          <AlertTriangle size={20} color="var(--warn)" />
          <h3 className="section-title" style={{ margin: 0 }}>Credit utilisation</h3>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--bad)", background: "var(--panel-tint)", padding: "4px 12px", borderRadius: 999 }}>
            Needs attention
          </span>
          <span style={{ marginLeft: "auto" }}>
            <ExportButton title="Credit Utilisation" blocks={utilBlocks} filename="FoundrX_Utilisation.pdf" />
          </span>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: 0 }}>
          How much of your available credit you're using. This is one of the biggest levers on your score.
        </p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <span className="stat-value" style={{ fontSize: "2.4rem", color: "var(--bad)" }}>
            <CountUp value={utilisation.ratio} suffix="%" />
          </span>
          <span className="muted" style={{ fontSize: "0.85rem" }}>
            R{utilisation.used.toLocaleString()} used of R{utilisation.limit.toLocaleString()} limit
          </span>
        </div>

        {/* bar with 30% healthy threshold marker */}
        <div style={{ position: "relative", marginTop: 14, marginBottom: 8 }}>
          <AnimatedBar value={utilisation.ratio} height={14} color="linear-gradient(90deg,#f59e0b,#e11d48)" />
          <div
            style={{
              position: "absolute",
              top: -4,
              bottom: -4,
              left: `${utilisation.healthyMax}%`,
              width: 2,
              background: "var(--good)",
            }}
            aria-hidden
          />
          <span style={{ position: "absolute", left: `${utilisation.healthyMax}%`, top: -20, transform: "translateX(-50%)", fontSize: "0.68rem", fontWeight: 700, color: "var(--good)", whiteSpace: "nowrap" }}>
            Healthy ≤ {utilisation.healthyMax}%
          </span>
        </div>

        <div className="grid grid-2" style={{ marginTop: 20 }}>
          <div style={{ padding: 16, borderRadius: 14, border: "1px solid var(--line)", background: "var(--surface)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <AlertTriangle size={16} color="var(--bad)" />
              <strong style={{ fontSize: "0.9rem" }}>What makes it bad</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              {utilisation.whatMakesItBad.map((t, i) => (
                <li key={i} style={{ fontSize: "0.83rem", lineHeight: 1.5, color: "var(--muted)" }}>{t}</li>
              ))}
            </ul>
          </div>
          <ImproveCard fixes={utilisation.howToFix} ratio={utilisation.ratio} limit={utilisation.limit} healthyMax={utilisation.healthyMax} />
        </div>
      </div>

      {/* SCORE FACTOR SPIDER (RADAR) */}
      <div className="card pad">
        <SectionHeader exportProps={{ title: "Score Factor Spider", blocks: radarBlocks, filename: "FoundrX_Score_Factors.pdf" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <RadarIcon size={18} color="var(--violet-deep)" />
            <h3 className="section-title" style={{ margin: 0 }}>Score factor spider — personal vs business record</h3>
          </div>
          <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>
            Six common credit dimensions, each scored out of 100. The further from the centre, the stronger the record.
          </p>
        </SectionHeader>
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarFactors} outerRadius="72%">
              <PolarGrid stroke={colors.grid} />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: colors.axis }} />
              <PolarRadiusAxis domain={[0, 100]} angle={90} tick={{ fontSize: 9, fill: colors.axis }} />
              <Radar name="Personal (director)" dataKey="personal" stroke={colors.c1} fill={colors.c1} fillOpacity={0.28} />
              <Radar name="Business" dataKey="business" stroke={colors.c2} fill={colors.c2} fillOpacity={0.28} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={tt} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEBT COMPOSITION + SCORE FACTOR BREAKDOWN */}
      <div className="grid grid-2">
        <div className="card pad">
          <SectionHeader exportProps={{ title: "Debt Composition", blocks: debtBlocks, filename: "FoundrX_Debt_Composition.pdf" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <PieIcon size={18} color="var(--violet-deep)" />
              <h3 className="section-title" style={{ margin: 0 }}>Debt composition</h3>
            </div>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>
              Where your debt sits. Revolving credit weighs heaviest on utilisation.
            </p>
          </SectionHeader>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={debtComposition}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="var(--surface)"
                  strokeWidth={2}
                >
                  {debtComposition.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={tt} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "grid", gap: 6, marginTop: 4 }}>
            {debtComposition.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: pieColors[i % pieColors.length], flex: "0 0 auto" }} />
                <span style={{ flex: 1 }}>{d.name}</span>
                <strong>{d.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card pad">
          <SectionHeader exportProps={{ title: "Business Score Factor Breakdown", blocks: factorBlocks, filename: "FoundrX_Factor_Breakdown.pdf" }}>
            <h3 className="section-title" style={{ margin: 0 }}>Business score — factor breakdown</h3>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>
              Each factor scored out of 100. Lower bars are the ones dragging your score.
            </p>
          </SectionHeader>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorData} layout="vertical" margin={{ top: 4, right: 30, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: colors.axis }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: colors.axis }} />
                <Tooltip contentStyle={tt} cursor={{ fill: "var(--panel-tint)" }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {factorData.map((f, i) => (
                    <Cell key={i} fill={f.value >= 70 ? "var(--good)" : f.value >= 50 ? colors.c2 : "var(--warn)"} />
                  ))}
                  <LabelList dataKey="value" position="right" style={{ fill: "var(--ink)", fontSize: 11, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* HOW TO IMPROVE — ACTION PLAN */}
      <div className="card pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h3 className="section-title" style={{ marginBottom: 2 }}>How to improve your score</h3>
            <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Work top to bottom — actions are ordered by impact.</p>
          </div>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ExportButton title="Credit Action Plan" blocks={planBlocks} filename="FoundrX_Action_Plan.pdf" />
            <span style={{ padding: "8px 14px", borderRadius: 999, background: "var(--panel-tint)", color: "var(--violet-deep)", fontWeight: 700, fontSize: "0.85rem" }}>
              {doneCount} / {plan.length} done
            </span>
          </span>
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {plan.length === 0 && (
            <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>
              No actions yet — your plan will populate once your credit diagnostics run.
            </p>
          )}
          {plan.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                gap: 14,
                padding: 16,
                borderRadius: 14,
                border: "1px solid var(--line)",
                background: r.done ? "var(--panel-tint)" : "var(--surface)",
                alignItems: "flex-start",
                transition: "background 0.2s ease",
              }}
            >
              <button
                onClick={() => toggle(r.id)}
                aria-label={r.done ? "Mark incomplete" : "Mark complete"}
                style={{ border: "none", background: "transparent", padding: 0, marginTop: 2, flex: "0 0 auto", cursor: "pointer" }}
              >
                {r.done ? <CheckCircle2 size={22} color="var(--good)" /> : <Circle size={22} color="var(--line-strong)" />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "0.95rem", textDecoration: r.done ? "line-through" : "none", color: r.done ? "var(--muted)" : "var(--ink)" }}>
                    {r.title}
                  </strong>
                  <span style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
                    <Badge tone={r.impact}>{r.impact} impact</Badge>
                    <span style={{ fontSize: "0.75rem", color: "var(--good)", fontWeight: 700, alignSelf: "center" }}>{r.lift}</span>
                  </span>
                </div>
                <p className="muted" style={{ margin: "6px 0 0", fontSize: "0.83rem" }}>{r.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, padding: 16, borderRadius: 14, background: "var(--grad-brand)", color: "#fff", alignItems: "flex-start" }}>
          <Lightbulb size={20} style={{ flex: "0 0 auto", marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.55 }}>
            <strong>Golden rule:</strong> pay every account on time and keep utilisation under 30%.
            These two habits account for more than half of both scores. Small, consistent payments
            beat one big lump sum.
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({ tone, children }) {
  const map = {
    High: { bg: "#fee2e2", fg: "#b91c1c" },
    Medium: { bg: "#fef3c7", fg: "#b45309" },
    Low: { bg: "#dcfce7", fg: "#15803d" },
  };
  const c = map[tone] || map.Medium;
  return (
    <span style={{ background: c.bg, color: c.fg, padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, alignSelf: "center" }}>
      {children}
    </span>
  );
}

const tt = {
  borderRadius: 12,
  border: "1px solid var(--line-strong)",
  fontSize: 12,
  boxShadow: "var(--shadow-md)",
  background: "var(--surface)",
  color: "var(--ink)",
};
