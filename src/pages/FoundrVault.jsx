import { useState } from "react";
import { documents as seed } from "../data/appData";
import { SectionHeader } from "../components/ExportButton.jsx";
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  ShieldCheck,
} from "lucide-react";

const STATUS = {
  verified: { label: "Verified", color: "var(--good)", bg: "#dcfce7", Icon: CheckCircle2 },
  expiring: { label: "Expiring soon", color: "var(--warn)", bg: "#fef3c7", Icon: AlertTriangle },
  missing: { label: "Not uploaded", color: "var(--bad)", bg: "#fee2e2", Icon: Upload },
};

export default function FoundrVault() {
  const [docs, setDocs] = useState(seed);

  function upload(id) {
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: "verified" } : x)));
  }

  const requiredDone = docs.filter((d) => d.required && d.status !== "missing").length;
  const requiredTotal = docs.filter((d) => d.required).length;
  const index = Math.round((docs.filter((d) => d.status === "verified").length / docs.length) * 100);

  const docBlocks = [
    { type: "kv", rows: [["Compliance Readiness Index", `${index}%`], ["Required in place", `${requiredDone} of ${requiredTotal}`]] },
    { type: "table", head: [["Document", "Required", "Status", "Why it's needed"]], body: docs.map((d) => [d.name, d.required ? "Yes" : "Optional", d.status, d.why]) },
  ];

  return (
    <div className="grid" style={{ gap: 20 }}>
      {/* Compliance readiness index */}
      <div className="grid grid-3">
        <div className="card pad span-2">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <ShieldCheck size={22} color="var(--violet-deep)" />
            <h3 className="section-title" style={{ margin: 0 }}>Compliance Readiness Index</h3>
          </div>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: 8 }}>
            A single 0–100% measure of how complete and regulator-ready your
            documentation is. Funders check this before anything else.
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
            <span className="stat-value" style={{ fontSize: "2.6rem", color: "var(--violet-deep)" }}>
              {index}%
            </span>
            <span className="muted" style={{ fontSize: "0.85rem" }}>
              {requiredDone} of {requiredTotal} required documents in place
            </span>
          </div>
          <div style={{ height: 12, borderRadius: 999, background: "var(--line)", marginTop: 14 }}>
            <div
              style={{
                height: "100%",
                width: `${index}%`,
                borderRadius: 999,
                background: "var(--grad-brand)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        <div className="card pad" style={{ background: "var(--panel-tint)", border: "1px solid var(--line-strong)" }}>
          <p className="eyebrow">Why it matters</p>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: "8px 0 0" }}>
            Getting to <strong>100%</strong> unlocks the funding readiness check,
            corporate supply-chain onboarding, and preferential procurement via
            your B-BBEE status.
          </p>
        </div>
      </div>

      {/* What you need to submit */}
      <div className="card pad">
        <SectionHeader exportProps={{ title: "Document Vault Status", blocks: docBlocks, filename: "FoundrX_Documents.pdf" }}>
          <h3 className="section-title" style={{ margin: 0 }}>What you need to submit</h3>
          <p className="muted" style={{ fontSize: "0.85rem", margin: "4px 0 0" }}>
            Upload each item to your secure vault. Required documents are needed to
            progress; optional ones strengthen your funding profile.
          </p>
        </SectionHeader>

        <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
          {docs.map((d) => {
            const s = STATUS[d.status];
            return (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid var(--line)",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--panel-tint)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                  <FileText size={18} color="var(--violet-deep)" />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "0.92rem" }}>{d.name}</strong>
                    {d.required ? (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--violet)", background: "var(--panel-tint)", padding: "2px 8px", borderRadius: 999 }}>
                        REQUIRED
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", background: "var(--line)", padding: "2px 8px", borderRadius: 999 }}>
                        OPTIONAL
                      </span>
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: "0.78rem", marginTop: 3 }}>{d.why}</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: s.color, background: s.bg, padding: "6px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700 }}>
                  <s.Icon size={15} /> {s.label}
                </span>
                {d.status === "missing" ? (
                  <button className="btn btn-primary" style={{ padding: "9px 16px" }} onClick={() => upload(d.id)}>
                    <Upload size={15} /> Upload
                  </button>
                ) : (
                  <button className="btn btn-ghost" style={{ padding: "9px 16px" }} onClick={() => upload(d.id)}>
                    Replace
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
