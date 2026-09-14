import Logo from "./Logo.jsx";
import { useTheme } from "../theme.jsx";

// Full-screen loading state: logo + a spinner in the brand's blue→purple colours.
export default function LoadingOverlay({ message = "Please wait", subtext }) {
  const { reduceMotion } = useTheme();
  return (
    <div className="load-overlay" role="status" aria-live="polite">
      <div className="load-card">
        <Logo height={30} />
        <span className={`spinner${reduceMotion ? " spinner-static" : ""}`} aria-hidden="true" />
        <div>
          <div className="load-title">{message}</div>
          {subtext && <div className="load-sub">{subtext}</div>}
        </div>
      </div>
    </div>
  );
}
