import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import { Floaties, Typewriter } from "../lib.jsx";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";

const SECTORS = ["Manufacturing", "Retail & Trade", "Services", "Agriculture", "Technology", "Construction", "Other"];
const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape",
];

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

  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
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
      {/* Brand panel — new colour template */}
      <aside className="login-brand template-surface" style={{ position: "relative", overflow: "hidden", padding: "48px 56px", display: "flex", alignItems: "center" }}>
        <Floaties />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 460 }}>
          <Logo height={38} variant="light" />
          <h1 style={{ fontSize: "2rem", lineHeight: 1.15, margin: "40px 0 16px", color: "#fff" }}>
            <Typewriter
              segments={[{ text: "Register your business and get investment-ready." }]}
              ariaLabel="Register your business and get investment-ready."
            />
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            Create your FoundrX account to unlock the document vault, your dual credit view, and a
            live funding-readiness score.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0", display: "grid", gap: 14 }}>
            {[
              "Free to start — no card required",
              "Your data is encrypted and private",
              "Set up in under 5 minutes",
            ].map((t) => (
              <li key={t} style={{ display: "flex", gap: 10, alignItems: "center", color: "rgba(255,255,255,0.9)" }}>
                <CheckCircle2 size={18} color="#9d6bf5" /> {t}
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
          <div style={styles.roleToggle}>
            <button type="button" onClick={() => setRole("smme")} style={role === "smme" ? styles.roleActive : styles.roleBtn}>
              I'm an SMME
            </button>
            <button type="button" onClick={() => setRole("partner")} style={role === "partner" ? styles.roleActive : styles.roleBtn}>
              Funder / Incubator
            </button>
          </div>

          <form onSubmit={submit}>
            <Field label={role === "smme" ? "Business name" : "Organisation name"}>
              <div style={{ position: "relative" }}>
                <Building2 size={16} style={styles.inputIcon} />
                <input required value={form.business} onChange={set("business")} placeholder="e.g. Acme Trading (Pty) Ltd" style={{ ...styles.input, paddingLeft: 38 }} />
              </div>
            </Field>
            <Field label="Your full name">
              <input required value={form.name} onChange={set("name")} placeholder="Jane Dlamini" style={styles.input} />
            </Field>
            <Field label="Work email">
              <input required type="email" value={form.email} onChange={set("email")} placeholder="you@business.co.za" style={styles.input} />
            </Field>
            <Field label="Password">
              <input required type="password" value={form.password} onChange={set("password")} placeholder="Create a password" style={styles.input} />
            </Field>

            {role === "smme" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Sector">
                  <select value={form.sector} onChange={set("sector")} style={styles.input}>
                    {SECTORS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Province">
                  <select value={form.province} onChange={set("province")} style={styles.input}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }} disabled={loading}>
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

function Field({ label, children }) {
  return (
    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>
      {label}
      <div style={{ marginTop: 6 }}>{children}</div>
    </label>
  );
}

const styles = {
  roleToggle: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "var(--panel-tint)", padding: 5, borderRadius: 12, marginBottom: 20 },
  roleBtn: { border: "none", background: "transparent", padding: "9px 8px", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", color: "var(--muted)", cursor: "pointer" },
  roleActive: { border: "none", background: "var(--surface)", padding: "9px 8px", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem", color: "var(--violet-deep)", boxShadow: "var(--shadow-sm)", cursor: "pointer" },
  input: { display: "block", width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--line-strong)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", background: "var(--surface)", color: "var(--ink)" },
  inputIcon: { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" },
  link: { color: "var(--violet)", fontWeight: 600, textDecoration: "none" },
};
