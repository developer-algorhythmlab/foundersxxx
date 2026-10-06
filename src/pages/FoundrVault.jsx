import { useState } from "react";
import { useProgress } from "../progress.jsx";
import { SectionHeader } from "../components/ExportButton.jsx";
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Lock,
} from "lucide-react";

const STATUS = {
  verified: { label: "Verified", tone: "good", Icon: CheckCircle2 },
  expiring: { label: "Expiring soon", tone: "warn", Icon: AlertTriangle },
  missing: { label: "Not uploaded", tone: "bad", Icon: Upload },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "required", label: "Required" },
  { key: "optional", label: "Optional" },
  { key: "missing", label: "Outstanding" },
];

export default function FoundrVault() {
  const { docs, setDocs } = useProgress();
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState({});

  // Simulated upload: brief "uploading" state, then the document is verified.
  function upload(id) {
    if (busy[id]) return;
    setBusy((b) => ({ ...b, [id]: true }));
    setTimeout(() => {
      setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: "verified" } : x)));
      setBusy((b) => ({ ...b, [id]: false }));
    }, 1100);
  }

  const requiredDone = docs.filter((d) => d.required && d.status !== "missing").length;
  const requiredTotal = docs.filter((d) => d.required).length;
  const verified = docs.filter((d) => d.status === "verified").length;
  const expiring = docs.filter((d) => d.status === "expiring").length;
  const missing = docs.filter((d) => d.status === "missing").length;
  const index = Math.round((verified / docs.length) * 100);

  const shown = docs.filter((d) =>
    filter === "required" ? d.required : filter === "optional" ? !d.required : filter === "missing" ? d.status === "missing" : true
  );

  const docBlocks = [
    { type: "kv", rows: [["Compliance Readiness Index", `${index}%`], ["Required in place", `${requiredDone} of ${requiredTotal}`]] },
    { type: "table", head: [["Document", "Required", "Status", "Why it's needed"]], body: docs.map((d) => [d.name, d.required ? "Yes" : "Optional", d.status, d.why]) },
  ];

  return (
    <div className="grid" style={{ gap: 20 }}>
      {/* Compliance readiness index */}
      <div className="grid grid-3">
        <div className="card pad span-2 vault-hero">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="vault-shield"><ShieldCheck size={22} /></span>
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>Compliance Readiness Index</h3>
              <p className="muted" style={{ fontSize: "0.82rem", margin: "2px 0 0" }}>
                How complete and regulator-ready your documentation is. Funders check this first.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <span className="stat-value" style={{ fontSize: "2.8rem", color: "var(--violet-deep)" }}>{index}%</span>
            <span className="muted" style={{ fontSize: "0.85rem" }}>
              {requiredDone} of {requiredTotal} required documents in place
            </span>
          </div>
          <div className="vault-track" role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={100} aria-label="Compliance readiness">
            <div className="vault-fill" style={{ width: `${index}%` }} />
          </div>
          <div className="vault-stats">
            <span className="vault-stat good"><CheckCircle2 size={15} /> <b>{verified}</b> verified</span>
            <span className="vault-stat warn"><AlertTriangle size={15} /> <b>{expiring}</b> expiring</span>
            <span className="vault-stat bad"><Upload size={15} /> <b>{missing}</b> outstanding</span>
          </div>
        </div>

        <div className="card pad vault-why">
          <p className="eyebrow">Why it matters</p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: "8px 0 0" }}>
            Getting to <strong>100%</strong> unlocks the funding readiness check,
            corporate supply-chain onboarding, and preferential procurement via
            your B-BBEE status.
          </p>
          <p className="vault-secure"><Lock size={14} /> Encrypted, private storage</p>
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

        <div className="vault-filters" role="tablist" aria-label="Filter documents">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" role="tab" aria-selected={filter === f.key} className={`vault-filter${filter === f.key ? " is-on" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="vault-list">
          {shown.length === 0 && <p className="muted" style={{ margin: "12px 0" }}>Nothing here — you're all caught up.</p>}
          {shown.map((d) => {
            const st = STATUS[d.status];
            const isBusy = !!busy[d.id];
            return (
              <div key={d.id} className={`vault-doc tone-${st.tone}`}>
                <span className="vault-doc-ico"><FileText size={18} /></span>
                <div className="vault-doc-main">
                  <div className="vault-doc-title">
                    <strong>{d.name}</strong>
                    <span className={`vault-tag${d.required ? " req" : ""}`}>{d.required ? "Required" : "Optional"}</span>
                  </div>
                  <div className="vault-doc-why">{d.why}</div>
                </div>
                <span className={`vault-status tone-${st.tone}`}>
                  <st.Icon size={14} /> {st.label}
                </span>
                {d.status === "missing" ? (
                  <button className="btn btn-primary vault-btn" disabled={isBusy} onClick={() => upload(d.id)}>
                    {isBusy ? <><Loader2 size={15} className="vault-spin" /> Uploading…</> : <><Upload size={15} /> Upload</>}
                  </button>
                ) : (
                  <button className="btn btn-ghost vault-btn" disabled={isBusy} onClick={() => upload(d.id)}>
                    {isBusy ? <><Loader2 size={15} className="vault-spin" /> Uploading…</> : <><RefreshCw size={14} /> Replace</>}
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
