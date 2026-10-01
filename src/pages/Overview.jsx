import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  company,
  credit,
  scoreTrend,
  fundingReadiness,
  impact,
  revenueVsExpenses,
  debtComposition,
  stageLabels,
} from "../data/appData";
import ScoreGauge from "../components/ScoreGauge.jsx";
import LifecycleFlow from "../components/LifecycleFlow.jsx";
import StageProgress from "../components/StageProgress.jsx";
import { AnimatedBar, CountUp } from "../lib.jsx";
import { useTheme } from "../theme.jsx";
import { useProgress } from "../progress.jsx";
import { SectionHeader } from "../components/ExportButton.jsx";
import { Sparkles, BarChart3, PieChart as PieIcon } from "lucide-react";

export default function Overview({ user }) {
  const { colors } = useTheme();
  const businessName = user?.business || company.name || "Your business";
  const metaParts = [company.sector, company.province, company.cipc ? `CIPC ${company.cipc}` : null].filter(Boolean);
  const progress = useProgress();
  const stage = progress.stage;
  const stageName = stageLabels[stage - 1];
  const remaining = progress.steps - progress.stepsDone;
  const pieColors = [colors.c1, colors.c2, colors.c3, colors.c4];

  const trendBlocks = [{ type: "table", head: [["Month", "Personal", "Business"]], body: scoreTrend.map((r) => [r.month, r.personal, r.business]), striped: true }];
  const revenueBlocks = [{ type: "table", head: [["Month", "Revenue (Rk)", "Expenses (Rk)"]], body: revenueVsExpenses.map((r) => [r.month, `R${r.revenue}k`, `R${r.expenses}k`]) }];
  const debtBlocks = [{ type: "table", head: [["Debt type", "Share"]], body: debtComposition.map((d) => [d.name, `${d.value}%`]), striped: true }];
  const impactBlocks = [{ type: "kv", rows: impact.map((m) => [m.label, m.value]) }];
  const readinessBlocks = [{ type: "kv", rows: [["Overall", `${fundingReadiness.overall}%`], ...fundingReadiness.breakdown.map((b) => [b.model, `${b.readiness}%`])] }];

  return (
    <div className="grid reveal" style={{ gap: 20 }}>
      {/* Welcome banner */}
      <div
        className="card pad"
        style={{
          background: "var(--grad-brand)",
          color: "#fff",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          {metaParts.length > 0 && (
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.85rem" }}>{metaParts.join(" • ")}</p>
          )}
          <h2 style={{ color: "#fff", fontSize: "1.6rem", margin: "6px 0 0" }}>{businessName}</h2>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.18)", padding: "10px 16px", borderRadius: 999, fontWeight: 600 }}>
          <Sparkles size={18} /> Funding readiness <CountUp value={fundingReadiness.overall} suffix="%" />
        </div>
      </div>

      {/* Credit scores */}
      <div className="grid grid-3">
        <div className="card pad" style={{ display: "grid", placeItems: "center" }}>
          <ScoreGauge {...credit.personal} label={credit.personal.label} />
        </div>
        <div className="card pad" style={{ display: "grid", placeItems: "center" }}>
          <ScoreGauge {...credit.business} label={credit.business.label} />
        </div>
        <div className="card pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="eyebrow" style={{ margin: 0 }}>Funding readiness</p>
            <SectionHeader exportProps={{ title: "Funding Readiness", blocks: readinessBlocks, filename: "FoundrX_Funding_Readiness.pdf" }} />
          </div>
          <div className="stat-value" style={{ margin: "6px 0 14px" }}>
            <CountUp value={fundingReadiness.overall} suffix="%" />
          </div>
          {fundingReadiness.breakdown.map((b, i) => (
            <div key={b.model} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                <span className="muted">{b.model}</span>
                <strong>{b.readiness}%</strong>
              </div>
              <AnimatedBar value={b.readiness} height={7} delay={i * 120} />
            </div>
          ))}
        </div>
      </div>

      {/* Trend + stage */}
      <div className="grid grid-2">
        <div className="card pad">
          <SectionHeader exportProps={{ title: "Score Trend", blocks: trendBlocks, filename: "FoundrX_Score_Trend.pdf" }}>
            <h3 className="section-title" style={{ margin: 0 }}>Score trend — last 12 months</h3>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>
              Both scores trending up as compliance and payments improve.
            </p>
          </SectionHeader>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.axis }} />
                <YAxis tick={{ fontSize: 11, fill: colors.axis }} domain={[400, 700]} />
                <Tooltip contentStyle={tt} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="personal" name="Personal" stroke={colors.c1} strokeWidth={3} dot={false} isAnimationActive />
                <Line type="monotone" dataKey="business" name="Business" stroke={colors.c2} strokeWidth={3} dot={false} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card pad">
          <h3 className="section-title">Your growth stage</h3>
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 0, marginBottom: 28 }}>
            You're at <strong>{stageName}</strong>.{" "}
            {stage >= 2
              ? "Nice work — your required documents and credit actions are in place."
              : `${remaining} step${remaining === 1 ? "" : "s"} left in FoundrVault and Credit Health to reach ${stageLabels[1]}.`}
          </p>
          <StageProgress current={stage} />
        </div>
      </div>

      {/* YOUR DATA AT A GLANCE — bar graph + pie chart */}
      <div className="grid grid-2">
        <div className="card pad">
          <SectionHeader exportProps={{ title: "Revenue vs Expenses", blocks: revenueBlocks, filename: "FoundrX_Revenue.pdf" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <BarChart3 size={18} color="var(--violet-deep)" />
              <h3 className="section-title" style={{ margin: 0 }}>Revenue vs expenses</h3>
            </div>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>
              Monthly, in thousands of Rand. The widening gap is what lifts your business score.
            </p>
          </SectionHeader>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.axis }} />
                <YAxis tick={{ fontSize: 11, fill: colors.axis }} />
                <Tooltip contentStyle={tt} cursor={{ fill: "var(--panel-tint)" }} formatter={(v) => `R${v}k`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill={colors.c1} radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={colors.c3} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card pad">
          <SectionHeader exportProps={{ title: "Debt Composition", blocks: debtBlocks, filename: "FoundrX_Debt_Composition.pdf" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <PieIcon size={18} color="var(--violet-deep)" />
              <h3 className="section-title" style={{ margin: 0 }}>Debt composition</h3>
            </div>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>
              A quick view of where your debt sits.
            </p>
          </SectionHeader>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={debtComposition} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={2} stroke="var(--surface)" strokeWidth={2}>
                  {debtComposition.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={tt} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 6 }}>
            {debtComposition.map((d, i) => (
              <span key={d.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: pieColors[i % pieColors.length] }} />
                {d.name} <strong>{d.value}%</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Impact + MVP flow */}
      <div className="grid grid-2">
        <div className="card pad">
          <SectionHeader exportProps={{ title: "Ecosystem Impact", blocks: impactBlocks, filename: "FoundrX_Impact.pdf" }}>
            <h3 className="section-title" style={{ margin: 0 }}>Ecosystem impact</h3>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>Aggregated across all FoundrX cohorts.</p>
          </SectionHeader>
          <div className="grid grid-2" style={{ gap: 14, marginTop: 8 }}>
            {impact.map((m) => (
              <div key={m.label} style={{ padding: 16, borderRadius: 14, border: "1px solid var(--line)", background: "var(--panel-tint)" }}>
                <div className="stat-value" style={{ color: "var(--violet-deep)" }}>{m.value}</div>
                <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card pad">
          <h3 className="section-title">How FoundrX connects your journey</h3>
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 0 }}>From onboarding to community — one data flow.</p>
          <LifecycleFlow />
        </div>
      </div>
    </div>
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
