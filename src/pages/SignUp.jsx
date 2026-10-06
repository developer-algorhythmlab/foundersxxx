import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import ClaySelect from "../components/ClaySelect.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { Floaties, Typewriter } from "../lib.jsx";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, AlertTriangle, X } from "lucide-react";

const SECTORS = ["Manufacturing", "Retail & Trade", "Services", "Agriculture", "Technology", "Construction", "Other"];
const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape",
];

const COPY = {
  smme: {
    title: "Register your business and get investment-ready.",
    lead: "Create your FoundrX account to unlock the document vault, your dual credit view, and a live funding-readiness score.",
    points: ["Free to start — no card required", "Your data is encrypted and private", "Set up in under 5 minutes"],
  },
  partner: {
    title: "Register your organisation and oversee your portfolio.",
    lead: "Funder and incubator accounts are verified. Every action is logged, and access to founder data is strictly controlled.",
    points: ["Organisation verified before access", "All portfolio activity is audit-logged", "Founder data shared by consent only"],
  },
};

export default function SignUp({ onSignup }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("smme");
  const [form, setForm] = useState({
    business: "",
    name: "",
    email: "",
    password: "",
    sector: SECTORS[0],
    province: PROVINCES[0],
  });

  const isFunder = role === "partner";
  const copy = COPY[role];
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  function validate() {
    const orgLabel = role === "smme" ? "Business name" : "Organisation name";
    const errs = {};
    if (!form.business.trim()) errs.business = `${orgLabel} is missing`;
    if (!form.name.trim()) errs.name = "Your full name is missing";
    if (!form.email.trim()) errs.email = "Work email is missing";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is missing";
    return errs;
  }

  function submit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      setShowAlert(true);
      return;
    }
    setLoading(true);
  }

  // Show the loading overlay for 3.5s, then create the account and open the dashboard.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      onSignup({ email: form.email, role, name: form.name || "New Founder", business: form.business });
      navigate("/app");
    }, 3500);
    return () => clearTimeout(t);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="login-wrap">
      {loading && (
        <LoadingOverlay message="Please wait" subtext="Creating your account & setting up your dashboard…" />
      )}
      {showAlert && (
        <div style={styles.scrim} onClick={() => setShowAlert(false)} role="presentation">
          <div style={styles.modal} role="alertdialog" aria-modal="true" aria-labelledby="missing-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setShowAlert(false)} style={styles.modalClose} aria-label="Close">
              <X size={18} />
            </button>
            <div style={styles.modalIcon}><AlertTriangle size={26} /></div>
            <h3 id="missing-title" style={{ margin: "12px 0 6px", fontSize: "1.2rem" }}>Information missing</h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Please complete the following before we can move you on to the next step of signing up your business:
            </p>
            <ul style={{ margin: "14px 0 20px", paddingLeft: 20, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--ink)" }}>
              {Object.values(errors).map((m) => <li key={m}>{m}</li>)}
            </ul>
            <button type="button" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowAlert(false)}>
              Got it, let me fix this
            </button>
          </div>
        </div>
      )}
      {/* Brand panel — new colour template */}
      <aside className={`login-brand template-surface${isFunder ? " funder-mode" : ""}`} style={{ position: "relative", overflow: "hidden", padding: "48px 56px", display: "flex", alignItems: "center" }}>
        <Floaties tone={isFunder ? "danger" : "brand"} />
        <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))} style={styles.backBtn}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 460 }}>
          <Logo height={38} variant="light" />
          {isFunder && (
            <p className="funder-eyebrow auth-alert role-fade" style={{ margin: "32px 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
              Authorised access only
            </p>
          )}
          <h1 key={`h-${role}`} style={{ fontSize: "2rem", lineHeight: 1.15, margin: isFunder ? "12px 0 16px" : "40px 0 16px", color: "#fff" }}>
            <Typewriter
              key={role}
              segments={[{ text: copy.title }]}
              ariaLabel={copy.title}
            />
          </h1>
          <p key={`p-${role}`} className="funder-lead role-fade" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            {copy.lead}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0", display: "grid", gap: 14 }}>
            {copy.points.map((t) => (
              <li key={t} style={{ display: "flex", gap: 10, alignItems: "center", color: "rgba(255,255,255,0.9)" }}>
                <CheckCircle2 size={18} color={isFunder ? "#f87171" : "#9d6bf5"} /> {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form panel */}
      <main style={{ display: "grid", placeItems: "center", padding: "40px 24px", background: "var(--bg)", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)", padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Logo height={32} />
          </div>
          <p style={{ textAlign: "center", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "0.7rem", fontWeight: 600, color: "var(--violet)", margin: "12px 0 4px" }}>
            Create your account
          </p>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: 20 }}>Register your business</h2>

          {/* Account type */}
          <div className={`role-toggle${isFunder ? " danger" : ""}`} data-role={role}>
            <button type="button" aria-pressed={role === "smme"} onClick={() => setRole("smme")}>
              I'm an SMME
            </button>
            <button type="button" aria-pressed={role === "partner"} onClick={() => setRole("partner")}>
              Funder / Incubator
            </button>
          </div>

          <form onSubmit={submit} noValidate>
            <Field key={`b-${role}`} fade label={role === "smme" ? "Business name" : "Organisation name"} error={errors.business}>
              <div style={{ position: "relative" }}>
                <Building2 size={16} style={styles.inputIcon} />
                <input value={form.business} onChange={set("business")} style={{ ...styles.input, paddingLeft: 38, ...(errors.business ? styles.inputError : {}) }} />
              </div>
            </Field>
            <Field label="Your full name" error={errors.name}>
              <input value={form.name} onChange={set("name")} style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }} />
            </Field>
            <Field label="Work email" error={errors.email}>
              <input type="email" value={form.email} onChange={set("email")} style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }} />
            </Field>
            <Field label="Password" error={errors.password}>
              <PasswordInput value={form.password} onChange={set("password")} style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }} />
            </Field>

            {role === "smme" && (
              <div className="role-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative", zIndex: 5 }}>
                <Field label="Sector">
                  <ClaySelect ariaLabel="Sector" value={form.sector} options={SECTORS} onChange={(v) => setForm((f) => ({ ...f, sector: v }))} />
                </Field>
                <Field label="Province">
                  <ClaySelect ariaLabel="Province" value={form.province} options={PROVINCES} onChange={(v) => setForm((f) => ({ ...f, province: v }))} />
                </Field>
              </div>
            )}

            <button type="submit" className={`btn btn-primary${isFunder ? " btn-danger" : ""}`} style={{ width: "100%", justifyContent: "center", marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }} disabled={loading}>
              {loading ? "Please wait…" : (<>Create account &amp; open dashboard <ArrowRight size={18} /></>)}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--muted)", marginTop: 20, marginBottom: 0 }}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({ label, error, fade, children }) {
  return (
    <label className={fade ? "role-fade" : undefined} style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>
      {label}
      <div style={{ marginTop: 6 }}>{children}</div>
      {error && (
        <div role="alert" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color: "#dc2626", fontSize: "0.78rem", fontWeight: 600 }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}
    </label>
  );
}

const styles = {
  backBtn: { position: "absolute", top: 22, left: 22, zIndex: 4, display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "8px 14px", fontSize: "0.82rem", fontWeight: 600, color: "#fff", cursor: "pointer" },
  input: { display: "block", width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--line-strong)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", background: "var(--surface)", color: "var(--ink)" },
  inputError: { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,0.12)" },
  scrim: { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,10,30,0.55)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 24 },
  modal: { position: "relative", width: "100%", maxWidth: 420, background: "var(--surface)", color: "var(--ink)", borderRadius: "var(--radius)", border: "1px solid var(--line)", boxShadow: "var(--shadow-md)", padding: 28 },
  modalClose: { position: "absolute", top: 12, right: 12, border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer" },
  modalIcon: { width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(220,38,38,0.12)", color: "#dc2626" },
  inputIcon: { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" },
  link: { color: "var(--violet)", fontWeight: 600, textDecoration: "none" },
};
