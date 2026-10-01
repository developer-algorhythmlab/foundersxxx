import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { Floaties, Typewriter } from "../lib.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SMME_COPY = {
  title: "Formalise, fund and scale your business.",
  lead: "Registration, credit and compliance in one place.",
  eyebrow: "SMME portal",
  heading: "Sign in to FoundrX",
};

const FUNDER_COPY = {
  title: "Clear insight into every applicant.",
  lead: "Credit exposure, compliance and repayment risk in one view.",
  eyebrow: "Funder & incubator portal",
  heading: "Partner sign in",
};

const STRENGTH_META = [
  { label: "Too short", color: "#dc2626" },
  { label: "Weak", color: "#dc2626" },
  { label: "Fair", color: "#f59e0b" },
  { label: "Good", color: "#eab308" },
  { label: "Strong", color: "#16a34a" },
];

function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return { score, ...STRENGTH_META[score] };
}

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("smme");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isFunder = role === "partner";
  const copy = isFunder ? FUNDER_COPY : SMME_COPY;
  const strength = passwordStrength(password);

  function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password to continue.");
      return;
    }
    setError("");
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
    <div className={`login-page template-surface${isFunder ? " funder-mode" : ""}`} style={styles.page}>
      <Floaties tone={isFunder ? "danger" : "brand"} />

      <button type="button" onClick={() => navigate("/")} style={styles.backBtn}>
        <ArrowLeft size={15} /> Back
      </button>

      <div style={styles.header}>
        <Logo height={36} variant="light" />
        <p key={`e-${role}`} className="funder-eyebrow role-fade" style={styles.modeEyebrow}>{copy.eyebrow}</p>
        <h1 style={styles.headline}>
          <Typewriter key={role} ariaLabel={copy.title} segments={[{ text: copy.title }]} />
        </h1>
        <p key={`l-${role}`} className="funder-lead role-fade" style={styles.lead}>{copy.lead}</p>
      </div>

      <div style={styles.floatCard}>
        <h2 key={role} className="role-fade" style={styles.formTitle}>{copy.heading}</h2>

        <div
          className={`role-toggle${isFunder ? " danger" : ""}`}
          data-role={role}
          style={{ "--toggle-pill": "#fff", "--toggle-tint": CARD.panelTint, "--toggle-muted": CARD.muted, "--toggle-active": CARD.violetDeep }}
        >
          <button type="button" aria-pressed={!isFunder} onClick={() => setRole("smme")}>
            I'm an SMME
          </button>
          <button type="button" aria-pressed={isFunder} onClick={() => setRole("partner")}>
            Funder / Incubator
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          {error && <p style={styles.formError}>{error}</p>}
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Password
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </label>
          {strength && (
            <div style={styles.strengthWrap}>
              <div style={styles.strengthTrack}>
                <div
                  style={{
                    ...styles.strengthFill,
                    width: `${(strength.score / 4) * 100}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <span style={{ ...styles.strengthLabel, color: strength.color }}>{strength.label}</span>
            </div>
          )}
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
            Sign in <ArrowRight size={18} />
          </button>
        </form>

        <p key={role} className="role-fade" style={styles.demoNote}>
          Demo mode — any credentials work.{" "}
          New here?{" "}
          <Link to="/signup" style={styles.link}>
            Register your business
          </Link>
        </p>
      </div>
    </div>
  );
}

const CARD = {
  ink: "#1f2937",
  muted: "#6b7280",
  line: "#e5e7eb",
  lineStrong: "#d1d5db",
  panelTint: "#f4f4f7",
  violet: "#7c3aed",
  violetDeep: "#5b21b6",
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "88px 24px 64px",
  },
  backBtn: {
    position: "absolute",
    top: 22,
    left: 22,
    zIndex: 4,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
  header: {
    position: "relative",
    zIndex: 2,
    maxWidth: 560,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modeEyebrow: {
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.75)",
    margin: "28px 0 0",
    transition: "color 0.4s ease",
  },
  headline: {
    fontSize: "clamp(1.5rem, 3.4vw, 2rem)",
    lineHeight: 1.2,
    margin: "10px 0 14px",
    color: "#fff",
  },
  lead: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: 480,
    transition: "color 0.4s ease",
  },
  featureRow: {
    listStyle: "none",
    padding: 0,
    margin: "24px 0 0",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  featureChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.82rem",
    color: "rgba(255,255,255,0.85)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 999,
    padding: "6px 14px 6px 6px",
  },
  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.16)",
    transition: "background 0.4s ease, color 0.4s ease",
  },
  floatCard: {
    position: "relative",
    zIndex: 3,
    width: "100%",
    maxWidth: 420,
    marginTop: 32,
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: 22,
    boxShadow: "0 34px 80px -24px rgba(5,3,15,0.6)",
    padding: 32,
  },
  formTitle: { textAlign: "center", fontSize: "1.4rem", marginBottom: 20, color: CARD.ink },
  formError: {
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.25)",
    color: "#b91c1c",
    fontSize: "0.85rem",
    fontWeight: 500,
    borderRadius: 10,
    padding: "10px 14px",
    margin: "0 0 16px",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: CARD.ink,
    marginBottom: 14,
  },
  input: {
    display: "block",
    width: "100%",
    marginTop: 6,
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${CARD.lineStrong}`,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    color: CARD.ink,
  },
  strengthWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "-6px 0 14px",
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    background: CARD.line,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.25s ease, background 0.25s ease",
  },
  strengthLabel: {
    fontSize: "0.74rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "4px 0 18px",
    fontSize: "0.8rem",
  },
  remember: { display: "flex", gap: 6, alignItems: "center", color: CARD.muted },
  link: { color: CARD.violet, fontWeight: 600, textDecoration: "none" },
  demoNote: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: CARD.muted,
    marginTop: 20,
    marginBottom: 0,
  },
};
