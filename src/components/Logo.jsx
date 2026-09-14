import logoDark from "../assets/foundrx-logo.png"; // dark "FOUND" text — for light backgrounds
import logoLight from "../assets/foundrx-logo-light.png"; // light text — for dark backgrounds
import { useTheme } from "../theme.jsx";

// Transparent logo that adapts to the surface behind it.
// - variant="light" forces the light-text version (use on colored/gradient panels)
// - variant="dark" forces the dark-text version
// - otherwise it follows the theme (light text in dark mode, dark text elsewhere)
export default function Logo({ height = 40, variant, style = {} }) {
  const { theme } = useTheme();
  const useLight = variant === "light" || (variant == null && theme === "dark");
  const src = useLight ? logoLight : logoDark;

  return (
    <img
      src={src}
      alt="FoundrX Labs"
      style={{ height, width: "auto", display: "block", ...style }}
    />
  );
}
