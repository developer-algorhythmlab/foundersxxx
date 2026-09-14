import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import {
  company,
  credit,
  fundingReadiness,
  documents,
  repairPlan,
  stageLabels,
} from "../data/appData";

const VIOLET = [124, 58, 237];
const INK = [26, 21, 35];
const MUTED = [110, 104, 128];

applyPlugin(jsPDF);

// ---------------------------------------------------------------------------
// Generic branded PDF builder used by per-section "Export PDF" buttons.
// blocks: array of { type, ... }
//   { type: "text", text }
//   { type: "bullets", items: [] }
//   { type: "kv", rows: [[label, value], ...] }
//   { type: "table", head: [[...]], body: [[...]] }
// ---------------------------------------------------------------------------
function drawHeader(doc, W, title, subtitle) {
  doc.setFillColor(...VIOLET);
  doc.rect(0, 0, W, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text("FoundrX", 40, 50);
  doc.setTextColor(...VIOLET);
  doc.text(` ${title}`, 40 + doc.getTextWidth("FoundrX"), 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const date = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
  doc.text(subtitle ? `${subtitle}  •  ${date}` : `Generated ${date}`, 40, 68);
}

function drawFooter(doc, W) {
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const H = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("FoundrX — figures are indicative and not a credit decision.", 40, H - 24);
    doc.text(`Page ${i} of ${pages}`, W - 90, H - 24);
  }
}

export function buildBlocksPdf(title, blocks, filename, subtitle) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  drawHeader(doc, W, title, subtitle);
  let y = 90;

  const ensure = (need) => {
    if (y + need > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
      y = 60;
    }
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      ensure(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...INK);
      doc.text(block.text, 40, y + 12);
      y += 24;
    } else if (block.type === "text") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      const lines = doc.splitTextToSize(block.text, W - 80);
      ensure(lines.length * 14);
      doc.text(lines, 40, y + 10);
      y += lines.length * 14 + 8;
    } else if (block.type === "bullets") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...INK);
      for (const item of block.items) {
        const lines = doc.splitTextToSize(item, W - 96);
        ensure(lines.length * 14);
        doc.setTextColor(...VIOLET);
        doc.text("•", 44, y + 10);
        doc.setTextColor(...INK);
        doc.text(lines, 58, y + 10);
        y += lines.length * 14 + 4;
      }
      y += 6;
    } else if (block.type === "kv") {
      doc.autoTable({
        startY: y,
        body: block.rows,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 5, textColor: INK },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 200, textColor: MUTED }, 1: { halign: "left" } },
        margin: { left: 40, right: 40 },
      });
      y = doc.lastAutoTable.finalY + 14;
    } else if (block.type === "table") {
      doc.autoTable({
        startY: y,
        head: block.head,
        body: block.body,
        theme: block.striped ? "striped" : "grid",
        headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: "bold", fontSize: 9 },
        bodyStyles: { textColor: INK, fontSize: 9 },
        styles: { cellPadding: 6 },
        margin: { left: 40, right: 40 },
      });
      y = doc.lastAutoTable.finalY + 14;
    }
  }

  drawFooter(doc, W);
  doc.save(filename || `FoundrX_${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
}

export function exportProfilePdf() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 54;

  // ---- Header band ----
  doc.setFillColor(...VIOLET);
  doc.rect(0, 0, W, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text("FoundrX", 40, y);
  doc.setTextColor(...VIOLET);
  doc.text(" Business Profile", 40 + doc.getTextWidth("FoundrX"), y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  y += 18;
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    40,
    y
  );

  // ---- Company block ----
  y += 26;
  doc.setDrawColor(236, 231, 245);
  doc.setFillColor(244, 240, 255);
  doc.roundedRect(40, y, W - 80, 74, 8, 8, "F");
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(company.name, 56, y + 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Director: ${company.director}`, 56, y + 44);
  doc.text(`CIPC: ${company.cipc}`, 56, y + 60);
  doc.text(`${company.sector}  •  ${company.province}`, 300, y + 44);
  doc.text(`Stage: ${stageLabels[company.stage - 1]}`, 300, y + 60);
  y += 100;

  // ---- Credit summary ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text("Credit intelligence", 40, y);
  y += 8;

  doc.autoTable({
    startY: y + 6,
    head: [["Profile", "Score", "Band", "12-mo change"]],
    body: [
      [
        credit.personal.label,
        `${credit.personal.score} / ${credit.personal.max}`,
        credit.personal.band,
        `+${credit.personal.change} pts`,
      ],
      [
        credit.business.label,
        `${credit.business.score} / ${credit.business.max}`,
        credit.business.band,
        `+${credit.business.change} pts`,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: INK },
    styles: { fontSize: 10, cellPadding: 8 },
    margin: { left: 40, right: 40 },
  });
  y = doc.lastAutoTable.finalY + 20;

  // ---- Funding readiness ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Funding readiness — ${fundingReadiness.overall}% overall`, 40, y);
  doc.autoTable({
    startY: y + 8,
    head: [["Funding model", "Readiness"]],
    body: fundingReadiness.breakdown.map((b) => [b.model, `${b.readiness}%`]),
    theme: "striped",
    headStyles: { fillColor: VIOLET, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 7 },
    margin: { left: 40, right: 40 },
  });
  y = doc.lastAutoTable.finalY + 20;

  // ---- Documents ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Document vault status", 40, y);
  doc.autoTable({
    startY: y + 8,
    head: [["Document", "Required", "Status"]],
    body: documents.map((d) => [
      d.name,
      d.required ? "Yes" : "Optional",
      d.status.charAt(0).toUpperCase() + d.status.slice(1),
    ]),
    theme: "grid",
    headStyles: { fillColor: VIOLET, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 7 },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const v = data.cell.raw.toLowerCase();
        if (v === "verified") data.cell.styles.textColor = [22, 163, 74];
        if (v === "missing") data.cell.styles.textColor = [220, 38, 38];
        if (v === "expiring") data.cell.styles.textColor = [217, 119, 6];
      }
    },
    margin: { left: 40, right: 40 },
  });
  y = doc.lastAutoTable.finalY + 20;

  // ---- Credit repair plan ----
  if (y > 660) {
    doc.addPage();
    y = 54;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("How to improve your score — action plan", 40, y);
  doc.autoTable({
    startY: y + 8,
    head: [["Action", "Impact", "Est. lift", "Done"]],
    body: repairPlan.map((r) => [r.title, r.impact, r.lift, r.done ? "Done" : "To do"]),
    theme: "striped",
    headStyles: { fillColor: VIOLET, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 7 },
    columnStyles: { 0: { cellWidth: 240 } },
    margin: { left: 40, right: 40 },
  });

  // ---- Footer ----
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const H = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      "FoundrX — confidential business profile. Figures are indicative and not a credit decision.",
      40,
      H - 24
    );
    doc.text(`Page ${i} of ${pages}`, W - 90, H - 24);
  }

  doc.save(`FoundrX_Profile_${company.name.replace(/[^a-z0-9]/gi, "_")}.pdf`);
}
