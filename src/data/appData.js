// Central app data for the FoundrX platform.
// This starts empty/neutral for every new account — in production these values
// are populated from CIPC, SARS, the credit bureaus, and real user activity.

export const company = {
  name: "",
  director: "",
  cipc: "",
  sector: "",
  province: "",
  stage: 1, // 1 Formalized, 2 Investment Ready, 3 Incubated, 4 Commercial Supply Chain
};

// Dual credit intelligence
export const credit = {
  personal: {
    label: "Director Personal Score",
    score: 0,
    min: 0,
    max: 850,
    band: "Not yet scored",
    change: 0,
    factors: [
      { name: "Payment history", value: 0, note: "No data yet" },
      { name: "Credit utilisation", value: 0, note: "No data yet" },
      { name: "Credit age", value: 0, note: "No data yet" },
      { name: "Recent enquiries", value: 0, note: "No data yet" },
      { name: "Public records", value: 0, note: "No data yet" },
    ],
  },
  business: {
    label: "Business Commercial Score",
    score: 0,
    min: 0,
    max: 750,
    band: "Not yet scored",
    change: 0,
    factors: [
      { name: "Trade payment record", value: 0, note: "No data yet" },
      { name: "Financial ratios", value: 0, note: "No data yet" },
      { name: "Business age", value: 0, note: "No data yet" },
      { name: "Credit exposure", value: 0, note: "No data yet" },
      { name: "Compliance filings", value: 0, note: "No data yet" },
    ],
  },
};

// 12-month score trend for the chart — empty until scores have history
export const scoreTrend = [];

export const fundingReadiness = {
  overall: 0,
  breakdown: [
    { model: "Grant / Pre-Seed", readiness: 0 },
    { model: "Blended Finance", readiness: 0 },
    { model: "Debt", readiness: 0 },
    { model: "Equity / Venture", readiness: 0 },
  ],
};

// Credit repair action plan — populated once diagnostics have run
export const repairPlan = [];

// FoundrVault — what the user needs to submit
export const documents = [
  {
    id: "cipc",
    name: "CIPC Registration (CoR 14.3)",
    why: "Proves the company is legally formalised.",
    status: "missing",
    required: true,
  },
  {
    id: "tax",
    name: "SARS Tax Clearance / PIN",
    why: "Confirms tax compliance — required by nearly every funder.",
    status: "missing",
    required: true,
  },
  {
    id: "bbbee",
    name: "B-BBEE Affidavit or Certificate",
    why: "Unlocks preferential procurement and ESD spend.",
    status: "missing",
    required: true,
  },
  {
    id: "bank",
    name: "6 Months Bank Statements",
    why: "Used for affordability and cash-flow assessment.",
    status: "missing",
    required: true,
  },
  {
    id: "id",
    name: "Director ID Document",
    why: "Identity verification and personal credit consent.",
    status: "missing",
    required: true,
  },
  {
    id: "fin",
    name: "Latest Financial Statements",
    why: "Drives the commercial credit and readiness scoring.",
    status: "missing",
    required: false,
  },
  {
    id: "sabs",
    name: "SABS / Product Compliance",
    why: "Needed for corporate supply-chain onboarding.",
    status: "missing",
    required: false,
  },
];

// Partner / incubator cohorts — populated once cohorts are created
export const cohorts = [];

// Capital curve — SMMEs moving across funding models over time
export const capitalCurve = [];

export const impact = [
  { label: "Jobs created", value: "0" },
  { label: "Revenue growth (YoY)", value: "0%" },
  { label: "Compliance milestones", value: "0" },
  { label: "Program completion", value: "0%" },
];

export const feed = [];

export const mentors = [];

export const stageLabels = [
  "Formalized",
  "Investment Ready",
  "Incubated",
  "Commercial Supply Chain",
];

// ---- Credit utilisation (personal revolving credit) ----
export const utilisation = {
  used: 0, // R
  limit: 0, // R
  get ratio() {
    return this.limit ? Math.round((this.used / this.limit) * 100) : 0;
  },
  healthyMax: 30, // %
  whatMakesItBad: [
    "Using more than 30% of your available limit signals risk to lenders.",
    "High balances carried month to month suggest over-reliance on credit.",
    "A single maxed-out account hurts more than the same balance spread across several.",
    "Utilisation is recalculated on every statement, so a high balance drags the score every month it stays up.",
  ],
  howToFix: [
    "Keep any revolving balance below 30% of the limit — the fastest lever on the score.",
    "Make a mid-cycle payment before the statement date so a lower balance is what gets reported.",
    "Ask your provider for a limit increase (without spending more) to lower the ratio automatically.",
    "Spread spending across accounts instead of maxing one; keep each below 30%.",
  ],
};

// ---- Debt composition (for the pie chart) ----
export const debtComposition = [];

// ---- Monthly revenue vs expenses (bar graph) ----
export const revenueVsExpenses = [];

// ---- Radar / spider: common credit dimensions, personal vs business record ----
export const radarFactors = [
  { dimension: "Payment behaviour", personal: 0, business: 0 },
  { dimension: "Utilisation / exposure", personal: 0, business: 0 },
  { dimension: "Account age", personal: 0, business: 0 },
  { dimension: "Enquiries", personal: 0, business: 0 },
  { dimension: "Public records", personal: 0, business: 0 },
  { dimension: "Financial strength", personal: 0, business: 0 },
];
