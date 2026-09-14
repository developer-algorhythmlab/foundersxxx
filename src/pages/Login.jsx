import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { Floaties } from "../lib.jsx";
import { ArrowRight, ShieldCheck, TrendingUp, Users, Eye, ShieldAlert, Scale } from "lucide-react";

const SMME_COPY = {
  title: "One platform to formalise, fund, and scale South African SMMEs.",
  lead: "FoundrX pulls registration, credit, compliance, and cohort tracking into a single view — for founders and the partners backing them.",
  eyebrow: "Welcome back",
  features: [
    [ShieldCheck, "FoundrVault", "Secure CIPC, SARS & B-BBEE document vault"],
    [TrendingUp, "Dual credit", "Track director and business scores in one place"],
    [Users, "Cohort tracking", "Funders see growth and impact in real time"],
  ],
};

const FUNDER_COPY = {
  title: "Every applicant. Every number. Nothing hidden from you.",
  lead: "You decide who gets funded. FoundrX puts full credit exposure, compliance gaps, and repayment risk in front of you before you ever sign.",
  eyebrow: "Due diligence starts now",
  features: [
    [Eye, "Total visibility", "No blind spots — see what's really behind the application"],
    [ShieldAlert, "Risk exposure", "Director and business credit, laid bare, in real time"],
    [Scale, "The final call is yours", "Every cohort tracked, every red flag surfaced"],
  ],
};

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("smme");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isFunder = role === "partner";
  const copy = isFunder ? FUNDER_COPY : SMME_COPY;

  function submit(e) {
    e.preventDefault();
    const handle = email.split("@")[0];
    const displayName = handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : "";
    onLogin({
      email,
      role,
      name: role === "smme" ? displayName : "Program Manager",
    });
    navigate("/app");
  }

  return (
    <div className="login-wrap">
      {/* Brand panel — mood shifts when a funder/incubator is signing in */}
      <aside className={`login-brand template-surface${isFunder ? " funder-mode" : ""}`} style={styles.brand}>
        <Floaties tone={isFunder ? "danger" : "brand"} />
        <div style={styles.brandInner}>
          <Logo height={40} variant="light" />
          <p className="funder-eyebrow" style={styles.modeEyebrow}>{copy.eyebrow}</p>
          <h1 style={styles.brandTitle}>{copy.title}</h1>
          <p className="funder-lead" style={styles.brandLead}>{copy.lead}</p>
          <ul style={styles.featureList}>
            {copy.features.map(([Icon, t, d]) => (
              <li key={t} style={styles.feature}>
                <span className="funder-feature-icon" style={styles.featureIcon}>
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{t}</strong>
                  <span style={styles.featureDesc}>{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            ...styles.brandGlow,
            background: isFunder
              ? "radial-gradient(circle, rgba(220,38,38,0.28), transparent 60%)"
              : styles.brandGlow.background,
          }}
          aria-hidden
        />
      </aside>

      {/* Form panel */}
      <main style={styles.formPane}>
        <div style={styles.formCard}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Logo height={34} />
          </div>
          <p style={{ ...styles.eyebrow, color: isFunder ? "#dc2626" : styles.eyebrow.color }}>
            {isFunder ? "Authorised access only" : "Welcome back"}
          </p>
          <h2 style={styles.formTitle}>{isFunder ? "Funder & Incubator Access" : "Sign in to FoundrX"}</h2>

          <div style={styles.roleToggle}>
            <button
              type="button"
              onClick={() => setRole("smme")}
              style={role === "smme" ? styles.roleActive : styles.roleBtn}
            >
              I'm an SMME
            </button>
            <button
              type="button"
              onClick={() => setRole("partner")}
              style={role === "partner" ? styles.roleActiveDanger : styles.roleBtn}
            >
              Funder / Incubator
            </button>
          </div>

          <form onSubmit={submit}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <div style={styles.rowBetween}>
              <label style={styles.remember}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a href="#" style={styles.link} onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 4,
                background: isFunder ? "linear-gradient(120deg, #450a0a 0%, #7f1d1d 55%, #b91c1c 100%)" : undefined,
              }}
            >
              {isFunder ? "Enter — proceed with scrutiny" : "Sign in"} <ArrowRight size={18} />
            </button>
          </form>

          <p style={styles.demoNote}>
            {isFunder
              ? "Demo mode — any credentials work. Every application from here will be laid bare."
              : "Demo mode — any credentials work."}{" "}
            New here?{" "}
            <Link to="/signup" style={styles.link}>
              Register your business
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr)",
    background: "var(--surface)",
  },
  brand: {
    position: "relative",
    overflow: "hidden",
    color: "#fff",
    padding: "48px 56px",
    display: "flex",
    alignItems: "center",
  },
  brandInner: { position: "relative", zIndex: 2, maxWidth: 460 },
  modeEyebrow: {
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.75)",
    margin: "36px 0 0",
    transition: "color 0.4s ease",
  },
  brandTitle: {
    fontSize: "2rem",
    lineHeight: 1.15,
    margin: "10px 0 16px",
    color: "#fff",
  },
  brandLead: { color: "rgba(255,255,255,0.82)", lineHeight: 1.6, margin: 0, transition: "color 0.4s ease" },
  featureList: { listStyle: "none", padding: 0, margin: "36px 0 0", display: "grid", gap: 16 },
  feature: { display: "flex", gap: 14, alignItems: "flex-start" },
  featureIcon: {
    flex: "0 0 auto",
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.16)",
    transition: "background 0.4s ease, color 0.4s ease",
  },
  featureDesc: { display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", marginTop: 2 },
  brandGlow: {
    position: "absolute",
    width: 480,
    height: 480,
    right: -160,
    bottom: -160,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 60%)",
  },
  formPane: {
    display: "grid",
    placeItems: "center",
    padding: "40px 24px",
    background: "var(--bg)",
  },
  formCard: {
    width: "100%",
    maxWidth: 400,
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-md)",
    padding: 32,
  },
  eyebrow: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "var(--violet)",
    margin: "12px 0 4px",
  },
  formTitle: { textAlign: "center", fontSize: "1.5rem", marginBottom: 20 },
  roleToggle: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
    background: "var(--panel-tint)",
    padding: 5,
    borderRadius: 12,
    marginBottom: 20,
  },
  roleBtn: {
    border: "none",
    background: "transparent",
    padding: "9px 8px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: "0.85rem",
    color: "var(--muted)",
  },
  roleActive: {
    border: "none",
    background: "var(--surface)",
    padding: "9px 8px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "var(--violet-deep)",
    boxShadow: "var(--shadow-sm)",
  },
  roleActiveDanger: {
    border: "none",
    background: "var(--surface)",
    padding: "9px 8px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "#b91c1c",
    boxShadow: "0 0 0 1px rgba(220,38,38,0.35), var(--shadow-sm)",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 14,
  },
  input: {
    display: "block",
    width: "100%",
    marginTop: 6,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid var(--line-strong)",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "4px 0 18px",
    fontSize: "0.8rem",
  },
  remember: { display: "flex", gap: 6, alignItems: "center", color: "var(--muted)" },
  link: { color: "var(--violet)", fontWeight: 600, textDecoration: "none" },
  demoNote: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: "var(--muted)",
    marginTop: 20,
    marginBottom: 0,
  },
};
