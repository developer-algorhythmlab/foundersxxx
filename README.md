# FoundrX — SMME Growth Platform

A Vite + React application for the FoundrX SMME ecosystem: onboarding, dual credit
intelligence, document management, and partner cohort tracking. White + purple theme.

## Run it

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # production build into /dist
npm run preview    # preview the production build
```

Requires Node 18+.

## Login

Login is the first screen. This is a **demo build — any email/password works.**
Prefilled credentials are provided. Toggle between an **SMME** and a
**Funder / Incubator** account before signing in.

## What's inside

- **Login** — split brand/form screen, role toggle, gradient panel.
- **Overview** — dual credit gauges, funding-readiness bars, 12-month score trend
  chart, growth-stage stepper, ecosystem impact stats, and the MVP data-flow diagram.
- **Credit Health** — full breakdown of the **director personal score** and the
  **business commercial score**, each with contributing factors, plus an interactive
  **"How to improve your score"** action plan you can tick off.
- **FoundrVault** — the **Compliance Readiness Index** and a checklist of exactly
  which documents to submit (CIPC, SARS, B-BBEE, bank statements, ID, financials),
  why each is needed, and a mock upload flow.
- **Cohort Tracker** — partner/incubator view with a stage-progression bar chart, a
  **capital curve** area chart (Grant → Blended → Debt → Equity), and impact reporting.
- **Community** — FoundrFeed (post updates), mentor advisory booking, B2B directory.

## Export to PDF

The **"Export data (PDF)"** button in the top bar (every dashboard page) generates a
branded, multi-section business profile — credit summary, funding readiness, document
vault status, and the credit action plan — using jsPDF.

## Logo

`src/assets/foundrx-logo.png` is the supplied FoundrX Labs logo, trimmed and flattened
onto a pure-white background so it blends on any white surface. Rendered via
`src/components/Logo.jsx` (pass `chip` for a white-chip backing when on a colored panel).

## Tech

React 18 · React Router · Recharts · jsPDF + jspdf-autotable · lucide-react icons.
Styling is a small design-token system in `src/index.css` (no CSS framework).
