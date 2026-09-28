import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";
import Logo from "../components/Logo.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import foundrVaultIcon from "../assets/foundrvault-target.png";
import fundingReadinessIcon from "../assets/funding-readiness-chart.png";
import { Typewriter, useInView, ScrollReveal, StatCounter, Floaties, Polygraph } from "../lib.jsx";
import { useTheme } from "../theme.jsx";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Gauge,
  Users,
  MessagesSquare,
  FolderLock,
  FileDown,
  ShieldCheck,
  TrendingUp,
  Check,
  RotateCw,
  ChevronDown,
} from "lucide-react";

const PILLARS = [
  {
    icon: Layers,
    title: "SMME Lifecycle Engine",
    text: "Guides businesses step-by-step from formalisation (CIPC, SARS, B-BBEE) through governance and into corporate supply-chain access.",
    points: [
      "Establish: CIPC registration, SARS tax clearance, B-BBEE affidavits, SABS readiness",
      "Operate: invoicing, bank readiness, and foundational governance",
      "Scale: corporate supply-chain pipelines, procurement, export readiness",
    ],
  },
  {
    icon: Gauge,
    title: "Dual Credit Intelligence",
    text: "Tracks both the director's personal score and the business commercial score, with diagnostics and step-by-step credit repair.",
    points: [
      "360° view of personal + business credit in one place",
      "Diagnostics flag judgements, high utilisation, and admin errors",
      "Guided repair workflows plus a live Funding Readiness Score",
    ],
  },
  {
    icon: Users,
    title: "Partner & Funder Portal",
    text: "Gives funders and incubators real-time cohort tracking, capital-curve mapping, and one-click impact & ESG reporting.",
    points: [
      "Track every sponsored cohort as it progresses through stages",
      "Map SMMEs across the capital curve: Grant → Blended → Debt → Equity",
      "Aggregate job, revenue, and compliance impact in one click",
    ],
  },
  {
    icon: MessagesSquare,
    title: "Community & Network",
    text: "FoundrFeed, a B2B marketplace, and an integrated mentorship portal to help founders collaborate and grow together.",
    points: [
      "FoundrFeed for announcements, updates, and knowledge sharing",
      "B2B marketplace to trade services and procure from peers",
      "Mentorship portal with scheduling and session tracking",
    ],
  },
];

const FEATURES = [
  {
    icon: FolderLock,
    iconImg: foundrVaultIcon,
    title: "FoundrVault",
    text: "A secure document vault with a live Compliance Readiness Index.",
    more: [
      "Bank-grade encryption for every CIPC, SARS & B-BBEE document you upload",
      "Auto-flags expired or missing documents before they cost you a deal",
      "Compliance Readiness Index updates the moment you add or fix a document",
      "Generate shareable, read-only links for funders and auditors",
    ],
  },
  {
    icon: TrendingUp,
    iconImg: fundingReadinessIcon,
    title: "Funding Readiness Score",
    text: "See exactly how ready you are for grants, blended finance, debt, or equity.",
    more: [
      "Blends credit health, compliance, and cash-flow signals into one score",
      "Breaks readiness down by funding type: grant, blended, debt, equity",
      "Surfaces the top 3 actions that move your score fastest",
      "Recalculates in real time as you fix issues",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Credit repair workflows",
    text: "Clear actions to fix utilisation, disputes, and negative markers.",
    more: [
      "Automatically flags high utilisation, judgements, and admin errors",
      "Step-by-step guided fixes with an estimated score impact",
      "Tracks director and business credit repair separately",
      "Notifies you the moment a dispute is resolved",
    ],
  },
  {
    icon: FileDown,
    title: "One-click PDF reports",
    text: "Export any section — scores, cohorts, impact — as a branded PDF.",
    more: [
      "Branded, funder-ready PDF generated in one click",
      "Bundles scores, cohort progress, and compliance status together",
      "Built for board packs, funder updates, and ESG reporting",
      "Keeps an export history so nothing gets lost in email threads",
    ],
  },
];

const STATS = [
  { value: 1284, comma: true, label: "Jobs created" },
  { value: 38, prefix: "+", suffix: "%", label: "Avg. revenue growth" },
  { value: 132, label: "SMMEs in cohorts" },
  { value: 60, suffix: "%", label: "Program completion" },
];

const AUDIENCES = [
  {
    icon: TrendingUp,
    title: "For SMMEs",
    text: "Formalise faster, understand your credit, fix what's holding you back, and get investment-ready — with clear next steps at every stage.",
    points: [
      "Guided CIPC, SARS & B-BBEE formalisation",
      "Dual credit view with clear, prioritised fixes",
      "Funding readiness across grants, debt & equity",
      "Supply-chain & procurement opportunity matches",
    ],
  },
  {
    icon: Users,
    title: "For funders & incubators",
    text: "Track every sponsored cohort in real time, map SMMEs across the capital curve, and generate impact & ESG reports in one click.",
    points: [
      "Real-time cohort tracking by stage",
      "Capital curve: Grant → Blended → Debt → Equity",
      "One-click impact & ESG reporting — no spreadsheets",
      "Multi-tenant view for ESD managers and sponsors",
    ],
  },
];

function StatsBand() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <div ref={ref} className="template-surface land-cta-band" style={{ position: "relative", overflow: "hidden" }}>
      <Floaties />
      <div className="land-stats" style={{ position: "relative", zIndex: 2 }}>
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="land-stat-value">
              <StatCounter
                value={s.value}
                prefix={s.prefix || ""}
                suffix={s.suffix || ""}
                comma={s.comma}
                start={inView}
              />
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveLineChart() {
  const { colors, reduceMotion } = useTheme();
  const [data, setData] = useState(() => {
    const a = [];
    let v = 55;
    for (let i = 0; i < 16; i++) {
      v = Math.max(25, Math.min(95, v + (Math.random() * 16 - 8)));
      a.push({ t: i, v: Math.round(v) });
    }
    return a;
  });

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setData((d) => {
        const last = d[d.length - 1];
        const nv = Math.max(25, Math.min(95, last.v + (Math.random() * 18 - 8)));
        return d.slice(1).concat({ t: last.t + 1, v: Math.round(nv) });
      });
    }, 1200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div style={{ height: 200, marginTop: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="liveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.c2} stopOpacity={0.5} />
              <stop offset="100%" stopColor={colors.c2} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, 110]} />
          <XAxis hide dataKey="t" />
          <Area
            type="monotone"
            dataKey="v"
            stroke={colors.c1}
            strokeWidth={3}
            fill="url(#liveFill)"
            isAnimationActive={!reduceMotion}
            animationDuration={800}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function AdvicePanel() {
  const tips = [
    "Pay your revolving balance below 30% before your statement date — the fastest score lift.",
    "Clear the two overdue supplier accounts to remove your biggest negative marker.",
    "File your outstanding SARS return to keep your compliance index green.",
    "Automate minimum payments so a late mark never dents your history.",
  ];
  const [i, setI] = useState(0);
  return (
    <div className="card feature-card">
      <h3 style={{ marginBottom: 6 }}>AI credit advice</h3>
      <p className="muted" style={{ marginTop: 0, fontSize: "0.9rem" }}>
        Tap for live guidance from your FoundrX advisor.
      </p>
      <button
        className="btn btn-primary"
        style={{ marginTop: 14, marginBottom: 4 }}
        onClick={() => setI((x) => (x + 1) % tips.length)}
      >
        <Sparkles size={16} /> Advice
      </button>
      <Polygraph />
      <p className="advice-tip">{tips[i]}</p>
    </div>
  );
}

function TypingSectionHead({ segments, ariaLabel, sub }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`land-section-head head-anim${inView ? " in-view" : ""}`}>
      <h2>
        <Typewriter start={inView} segments={segments} ariaLabel={ariaLabel} />
      </h2>
      <span className="head-underline" aria-hidden="true" />
      <p style={{ marginTop: 16 }}>{sub}</p>
    </div>
  );
}

function FlipCard({ pillar, index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const [auto, setAuto] = useState(false);
  const { reduceMotion } = useTheme();
  const Icon = pillar.icon;

  // Auto-rotate every 20s, staggered per card so they don't all flip in lockstep.
  useEffect(() => {
    if (reduceMotion) return;
    const stagger = index * 3000;
    let interval;
    const start = setTimeout(() => {
      setFlipped((f) => !f);
      setAuto(true);
      setTimeout(() => setAuto(false), 700);
      interval = setInterval(() => {
        setFlipped((f) => !f);
        setAuto(true);
        setTimeout(() => setAuto(false), 700);
      }, 20000);
    }, 20000 + stagger);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [reduceMotion, index]);

  return (
    <div
      className={`flip${flipped ? " is-flipped" : ""}${auto ? " flip-auto" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${pillar.title}. Activate to see what it does.`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face">
          <span className="feature-icon"><Icon size={22} /></span>
          <h3 style={{ fontSize: "1.12rem", color: "var(--ink)", marginBottom: 8 }}>{pillar.title}</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.55, margin: 0 }}>{pillar.text}</p>
          <span className="flip-hint"><RotateCw size={14} /> Hover or tap for more</span>
        </div>
        {/* Back */}
        <div className="flip-face flip-back">
          <div className="flip-back-title">What it does</div>
          <h3 style={{ fontSize: "1.05rem", color: "var(--ink)", marginBottom: 10 }}>{pillar.title}</h3>
          <ul className="flip-points">
            {pillar.points.map((pt, i) => (
              <li key={i}><Check size={15} /> <span>{pt}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const BURST_DOTS = Array.from({ length: 10 });

function FeatureCard({ feature }) {
  const [open, setOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const Icon = feature.icon;

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) setBurstKey((k) => k + 1);
      return next;
    });
  }

  return (
    <div
      className={`card feature-card feature-card-expandable${open ? " is-open" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <span className={`feature-icon${feature.iconImg ? " feature-icon-plain" : ""}`}>
        {feature.iconImg ? (
          <img src={feature.iconImg} alt="" width={46} height={46} />
        ) : (
          <Icon size={20} />
        )}
        {open && (
          <span className="icon-burst" key={burstKey} aria-hidden="true">
            {BURST_DOTS.map((_, i) => (
              <span className="burst-dot" style={{ "--i": i }} key={i} />
            ))}
          </span>
        )}
      </span>
      <h3 style={{ fontSize: "1rem" }}>{feature.title}</h3>
      <p>{feature.text}</p>
      <span className="feature-more-hint">
        <ChevronDown size={15} className="feature-chevron" /> {open ? "Show less" : "Learn more"}
      </span>
      <div className="feature-more">
        <ul className="flip-points">
          {feature.more.map((pt, i) => (
            <li key={i}><Check size={14} /> <span>{pt}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { reduceMotion } = useTheme();
  const [loading, setLoading] = useState(false);
  // Intro sequence: "intro" (video playing) -> "revealing" (site slides in) -> "done"
  const [phase, setPhase] = useState(reduceMotion ? "done" : "intro");
  const introVideoRef = useRef(null);
  const [ctaRef, ctaInView] = useInView({ threshold: 0.4 });

  function getStarted() {
    setLoading(true);
  }

  function finishIntro() {
    setPhase((p) => (p === "intro" ? "revealing" : p));
    setTimeout(() => setPhase((p) => (p === "revealing" ? "done" : p)), 700);
  }

  // Play the intro once; reveal the site when it ends (with fallbacks).
  useEffect(() => {
    if (phase !== "intro") return;
    const v = introVideoRef.current;
    // Fallback: if the video can't autoplay or 'ended' never fires, reveal anyway.
    const fallback = setTimeout(finishIntro, 12000);
    if (v) {
      const p = v.play?.();
      if (p && p.catch) p.catch(() => finishIntro());
    }
    return () => clearTimeout(fallback);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show the please-wait overlay briefly, then head to sign up.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => navigate("/signup"), 3500);
    return () => clearTimeout(t);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* One-time intro video */}
      {phase !== "done" && (
        <div className={`intro-overlay${phase === "revealing" ? " out" : ""}`}>
          <video
            ref={introVideoRef}
            className="intro-video"
            src="/foundrx-hero.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finishIntro}
            aria-hidden="true"
          />
          <button className="intro-skip" onClick={finishIntro}>
            Skip intro →
          </button>
        </div>
      )}

      <div className={`landing site-reveal${phase !== "intro" ? " in" : ""}`}>
        {loading && <LoadingOverlay message="Please wait" subtext="Taking you to sign up…" />}
        {/* HERO */}
        <div className="template-surface" style={{ position: "relative", overflow: "hidden" }}>
          {/* Drifting aurora orbs */}
          <div className="hero-orbs" aria-hidden="true">
            <span className="orb orb-1" />
            <span className="orb orb-2" />
            <span className="orb orb-3" />
          </div>
          <Floaties />

        <nav className="land-nav">
          <Logo height={34} variant="light" />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-onDark" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/signup")}>
              Get started
            </button>
          </div>
        </nav>

        <div className="land-container land-hero hero-content reveal">
          <span className="land-eyebrow">
            <Sparkles size={15} /> Built for South Africa's SMME economy
          </span>
          <h1 className="land-h1">
            <Typewriter
              start={phase !== "intro"}
              ariaLabel="One platform to formalise, fund, and scale South African SMMEs."
              segments={[
                { text: "One platform to " },
                { text: "formalise, fund, and scale", accent: true },
                { text: " South African SMMEs." },
              ]}
            />
          </h1>
          <p className="land-sub">
            The SMME support ecosystem is fragmented across dozens of portals. FoundrX brings
            registration, credit, compliance, funding readiness, and cohort tracking into a single,
            data-driven home — for founders and the partners backing them.
          </p>
          <div className="land-cta-row">
            <button className="btn btn-primary btn-lg cta-glow" onClick={getStarted}>
              Get Started Now <ArrowRight size={18} />
            </button>
            <button className="btn btn-onDark btn-lg" onClick={() => navigate("/login")}>
              Sign in to dashboard
            </button>
          </div>
        </div>
      </div>

      {/* WHAT IT DOES */}
      <section className="land-section">
        <div className="land-container">
          <ScrollReveal className="land-section-head">
            <h2>What <span className="accent">FoundrX</span> does</h2>
            <p>Four operational pillars that carry an SMME from day one to commercial supply chains.</p>
          </ScrollReveal>
          <ScrollReveal className="grid grid-2">
            {PILLARS.map((p, i) => (
              <FlipCard key={p.title} pillar={p} index={i} />
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="land-container">
          <TypingSectionHead
            ariaLabel="Everything a founder needs, in one view"
            segments={[
              { text: "Everything", accent: true },
              { text: " a founder needs, in one view" },
            ]}
            sub="No more juggling spreadsheets, bureau portals, and email threads."
          />
          <ScrollReveal className="grid grid-4 feature-grid">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* LIVE GRAPH + ADVICE */}
      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="land-container">
          <div className="land-section-head">
            <h2>Your data, <span className="accent">alive</span></h2>
            <p>Watch your metrics move in real time — and get instant guidance.</p>
          </div>
          <ScrollReveal className="grid grid-2">
            <div className="card feature-card">
              <h3 style={{ marginBottom: 6 }}>Live activity</h3>
              <p className="muted" style={{ marginTop: 0, fontSize: "0.9rem" }}>
                Cohort momentum, updating second by second.
              </p>
              <LiveLineChart />
            </div>
            <AdvicePanel />
          </ScrollReveal>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="land-container">
          <StatsBand />
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="land-container">
          <div className="land-section-head">
            <h2>Made for both sides of the table</h2>
            <p>Whether you're building a business or backing dozens of them.</p>
          </div>
          <ScrollReveal className="grid grid-2">
            {AUDIENCES.map((a, i) => (
              <FlipCard key={a.title} pillar={a} index={i} />
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="land-container">
          <div ref={ctaRef} className="template-surface land-cta-band" style={{ position: "relative", overflow: "hidden" }}>
            <Floaties />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                <Logo height={30} variant="light" />
              </div>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.7rem,3.6vw,2.4rem)", marginBottom: 12 }}>
                <Typewriter
                  start={ctaInView}
                  showCaret={false}
                  ariaLabel="Ready to grow with FoundrX?"
                  segments={[{ text: "Ready to grow with FoundrX?" }]}
                />
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto 26px", lineHeight: 1.6 }}>
                Register your business in minutes and get your funding-readiness score today.
              </p>
              <button className="btn btn-primary btn-lg" onClick={getStarted}>
                Get Started Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="land-container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Logo height={24} />
          <span>© {new Date().getFullYear()} FoundrX Labs. Empowering South African SMMEs.</span>
        </div>
      </footer>
      </div>
    </>
  );
}
