// src/utils/pdfReport.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateEquipmentPdf({
  datasetMeta,
  summary,
  distribution,
  tableRows,
}) {
  const doc = new jsPDF();

  const title = "Chemical Equipment Report";
  doc.setFontSize(18);
  doc.text(title, 14, 18);

  doc.setFontSize(11);
  const name = datasetMeta?.name || "Unknown dataset";
  const uploadedAt = datasetMeta?.uploadedAt || new Date().toLocaleString();
  doc.text(`Dataset: ${name}`, 14, 28);
  doc.text(`Generated: ${uploadedAt}`, 14, 34);

  // Summary section
  doc.setFontSize(13);
  doc.text("Summary", 14, 46);

  doc.setFontSize(11);
  const summaryLines = [
    `Total Equipment: ${summary?.total_equipment ?? "-"}`,
    `Avg Flowrate: ${summary?.avg_flowrate ?? "-"}`,
    `Avg Pressure: ${summary?.avg_pressure ?? "-"}`,
    `Avg Temperature: ${summary?.avg_temperature ?? "-"}`,
  ];
  summaryLines.forEach((line, i) => doc.text(line, 14, 54 + i * 6));

  // Type distribution table
  doc.setFontSize(13);
  doc.text("Equipment Type Distribution", 14, 82);

  const distRows = Object.entries(distribution || {}).map(([type, count]) => [
    type,
    String(count),
  ]);

  autoTable(doc, {
    startY: 88,
    head: [["Type", "Count"]],
    body: distRows.length ? distRows : [["-", "-"]],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 30, 30] },
  });

  // Equipment table
  const afterDistY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 110;

  doc.setFontSize(13);
  doc.text("Equipment Data (Top rows)", 14, afterDistY);

  const body = (tableRows || []).slice(0, 30).map((r) => [
    r.name ?? "-",
    r.type ?? "-",
    r.flowrate ?? "-",
    r.pressure ?? "-",
    r.temperature ?? "-",
  ]);

  autoTable(doc, {
    startY: afterDistY + 6,
    head: [["Name", "Type", "Flowrate", "Pressure", "Temperature"]],
    body: body.length ? body : [["-", "-", "-", "-", "-"]],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 30, 30] },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
    },
  });

  // Save
  const safeName = String(name).replace(/[^\w\-]+/g, "_");
  doc.save(`equipment_report_${safeName}.pdf`);
}
