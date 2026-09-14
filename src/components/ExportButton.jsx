import { Download } from "lucide-react";
import { buildBlocksPdf } from "./exportPdf.js";

// A compact "Export PDF" button placed in a section header.
// Pass the section `title`, `blocks` (see buildBlocksPdf), and optional filename.
export default function ExportButton({ title, blocks, filename, subtitle, label = "Export PDF" }) {
  return (
    <button
      className="btn btn-ghost"
      style={{ padding: "7px 13px", fontSize: "0.76rem", flex: "0 0 auto" }}
      onClick={() => buildBlocksPdf(title, blocks, filename, subtitle)}
      aria-label={`Export ${title} as PDF`}
    >
      <Download size={14} /> {label}
    </button>
  );
}

// Header row helper: title on the left, export button on the right.
export function SectionHeader({ children, exportProps }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 4,
      }}
    >
      <div style={{ minWidth: 0 }}>{children}</div>
      {exportProps && <ExportButton {...exportProps} />}
    </div>
  );
}
