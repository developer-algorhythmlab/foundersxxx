import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cohorts, capitalCurve, impact } from "../data/appData";
import { useTheme } from "../theme.jsx";
import { SectionHeader } from "../components/ExportButton.jsx";
import { Building2 } from "lucide-react";

// totals across all cohorts (for the management view header + export)
function totals() {
  return cohorts.reduce(
    (a, c) => ({
      smmes: a.smmes + c.smmes,
      funded: a.funded + c.funded,
      supplyChain: a.supplyChain + c.stages.supplyChain,
    }),
    { smmes: 0, funded: 0, supplyChain: 0 }
  );
}

export default function CohortTracker() {
  const { colors } = useTheme();
  const [active, setActive] = useState(cohorts[0]?.id ?? null);
  const cohort = cohorts.find((c) => c.id === active);
  const t = totals();

  if (!cohort) {
    return (
      <div className="card pad" style={{ textAlign: "center", padding: 48 }}>
        <Building2 size={28} color="var(--violet-deep)" style={{ marginBottom: 12 }} />
        <h3 className="section-title" style={{ marginBottom: 6 }}>No cohorts yet</h3>
        <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
          Cohorts you sponsor will appear here once they're created.
        </p>
      </div>
    );
  }

  const funnel = [
    { stage: "Formalized", count: cohort.stages.formalized },
    { stage: "Investment Ready", count: cohort.stages.investmentReady },
    { stage: "Incubated", count: cohort.stages.incubated },
    { stage: "Supply Chain", count: cohort.stages.supplyChain },
  ];

  const areas = [
    ["grant", "Grant", colors.c4],
    ["blended", "Blended", colors.c3],
    ["debt", "Debt", colors.c2],
    ["equity", "Equity", colors.c1],
  ];

  // ---- PDF block builders per section ----
  const allCohortsBlocks = [
    { type: "text", text: `Portfolio total: ${t.smmes} SMMEs across ${cohorts.length} cohorts, ${t.funded} funded, ${t.supplyChain} in commercial supply chains.` },
    {
      type: "table",
      head: [["Cohort", "SMMEs", "Funded", "Complete", "Formalized", "Inv. Ready", "Incubated", "Supply Chain"]],
      body: cohorts.map((c) => [
        c.name, c.smmes, c.funded, `${c.completion}%`,
        c.stages.formalized, c.stages.investmentReady, c.stages.incubated, c.stages.supplyChain,
      ]),
    },
  ];

  const stageBlocks = [
    { type: "text", text: `Stage progression for ${cohort.name}.` },
    { type: "table", head: [["Stage", "SMMEs"]], body: funnel.map((f) => [f.stage, f.count]), striped: true },
  ];

  const capitalBlocks = [
    { type: "text", text: "SMMEs transitioning across funding models by quarter." },
    { type: "table", head: [["Quarter", "Grant", "Blended", "Debt", "Equity"]], body: capitalCurve.map((q) => [q.quarter, q.grant, q.blended, q.debt, q.equity]) },
  ];

  const impactBlocks = [
    { type: "kv", rows: impact.map((m) => [m.label, m.value]) },
  ];

  return (
    <div className="grid reveal" style={{ gap: 20 }}>
      {/* ---- Cohort management view: preview ALL cohorts ---- */}
      <div className="card pad">
        <SectionHeader
          exportProps={{ title: "Cohort Management", subtitle: "All cohorts", blocks: allCohortsBlocks, filename: "FoundrX_All_Cohorts.pdf" }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Building2 size={20} color="var(--violet-deep)" />
            <h3 className="section-title" style={{ margin: 0 }}>Cohort management view</h3>
          </div>
          <p className="muted" style={{ fontSize: "0.83rem", margin: "6px 0 0" }}>
            Every sponsored cohort at a glance — {t.smmes} SMMEs, {t.funded} funded, {t.supplyChain} in supply chains.
          </p>
        </SectionHeader>

        <div className="cohort-table-wrap" style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="cohort-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Cohort</th>
                <th>SMMEs</th>
                <th>Funded</th>
                <th>Completion</th>
                <th style={{ minWidth: 160 }}>Stage distribution</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => {
                const seg = [
                  ["Formalized", c.stages.formalized, colors.c4],
                  ["Investment Ready", c.stages.investmentReady, colors.c3],
                  ["Incubated", c.stages.incubated, colors.c2],
                  ["Supply Chain", c.stages.supplyChain, colors.c1],
                ];
                const sum = seg.reduce((a, s) => a + s[1], 0);
                return (
                  <tr
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    className={c.id === active ? "row-active" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ textAlign: "left", fontWeight: 700 }}>{c.name}</td>
                    <td>{c.smmes}</td>
                    <td>{c.funded}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--violet-deep)" }}>{c.completion}%</span>
                    </td>
                    <td>
                      <span style={{ display: "flex", height: 12, borderRadius: 999, overflow: "hidden", background: "var(--line)", minWidth: 140 }}>
                        {seg.map(([name, v, col]) => (
                          <span key={name} title={`${name}: ${v}`} style={{ width: `${(v / sum) * 100}%`, background: col }} />
                        ))}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.74rem", fontWeight: 700, color: c.id === active ? "var(--violet)" : "var(--muted)" }}>
                        {c.id === active ? "Viewing" : "View"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 12 }}>
          {[["Formalized", colors.c4], ["Investment Ready", colors.c3], ["Incubated", colors.c2], ["Supply Chain", colors.c1]].map(([n, col]) => (
            <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.76rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: col }} /> {n}
            </span>
          ))}
        </div>
      </div>

      {/* ---- Selected cohort charts ---- */}
      <div className="grid grid-2">
        <div className="card pad">
          <SectionHeader exportProps={{ title: `Stage Progression — ${cohort.name}`, blocks: stageBlocks }}>
            <h3 className="section-title" style={{ margin: 0 }}>Stage progression — {cohort.name}</h3>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>How many SMMEs have reached each milestone.</p>
          </SectionHeader>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: colors.axis }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: colors.axis }} />
                <Tooltip contentStyle={tt} cursor={{ fill: "var(--panel-tint)" }} />
                <Bar dataKey="count" name="SMMEs" fill={colors.c2} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card pad">
          <SectionHeader exportProps={{ title: "Capital Curve", blocks: capitalBlocks }}>
            <h3 className="section-title" style={{ margin: 0 }}>Capital curve mapping</h3>
            <p className="muted" style={{ fontSize: "0.82rem", margin: "4px 0 0" }}>Grant → Blended → Debt → Equity.</p>
          </SectionHeader>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capitalCurve} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  {areas.map(([key, , c]) => (
                    <linearGradient key={key} id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.85} />
                      <stop offset="100%" stopColor={c} stopOpacity={0.12} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: colors.axis }} />
                <YAxis tick={{ fontSize: 11, fill: colors.axis }} />
                <Tooltip contentStyle={tt} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {areas.map(([key, name, c]) => (
                  <Area key={key} type="monotone" dataKey={key} stackId="1" name={name} stroke={c} fill={`url(#g-${key})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---- Impact ---- */}
      <div className="card pad">
        <SectionHeader exportProps={{ title: "Impact & ESG Report", blocks: impactBlocks }}>
          <h3 className="section-title" style={{ margin: 0 }}>Automated impact & ESG reporting</h3>
          <p className="muted" style={{ fontSize: "0.83rem", margin: "4px 0 0" }}>One-click aggregation — no more spreadsheet reporting.</p>
        </SectionHeader>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          {impact.map((m) => (
            <div key={m.label} style={{ padding: 18, borderRadius: 14, background: "var(--panel-tint)", border: "1px solid var(--line)" }}>
              <div className="stat-value" style={{ color: "var(--violet-deep)" }}>{m.value}</div>
              <div className="muted" style={{ fontSize: "0.8rem", marginTop: 6 }}>{m.label}</div>
            </div>
          ))}
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
