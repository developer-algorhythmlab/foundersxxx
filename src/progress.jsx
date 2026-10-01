import { createContext, useContext, useMemo, useState } from "react";
import { company, documents as seedDocs, repairPlan, utilisation } from "./data/appData";

const ProgressContext = createContext(null);

// Shared state for FoundrVault and Credit Health, so the growth stage on the
// Overview reacts as documents are uploaded and credit actions are completed.
export function ProgressProvider({ children }) {
  const [docs, setDocs] = useState(seedDocs);
  const [plan, setPlan] = useState(repairPlan);

  const value = useMemo(() => {
    const required = docs.filter((d) => d.required);
    const docsDone = required.filter((d) => d.status !== "missing").length;
    const planDone = plan.filter((r) => r.done).length;
    const utilisationOk = !(utilisation.limit > 0 && utilisation.ratio > utilisation.healthyMax);

    const steps = required.length + plan.length + (utilisationOk ? 0 : 1);
    const stepsDone = docsDone + planDone;
    const ready = docsDone === required.length && planDone === plan.length && utilisationOk;

    // Stages 3 and 4 depend on programme enrolment, so they come from the data.
    const stage = Math.max(company.stage, ready ? 2 : 1);

    return {
      docs,
      setDocs,
      plan,
      setPlan,
      stage,
      docsDone,
      docsTotal: required.length,
      planDone,
      planTotal: plan.length,
      utilisationOk,
      stepsDone,
      steps,
    };
  }, [docs, plan]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return useContext(ProgressContext);
}
