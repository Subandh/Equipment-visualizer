import io
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader

def export_pdf_report(
    out_pdf_path: str,
    dataset_meta: dict,
    summary: dict,
    distribution: dict,
    table_rows: list,
    matplotlib_fig,
):
    """
    Creates a simple PDF:
    - Title + dataset meta
    - Summary block
    - Type distribution chart image (if any)
    - Sample table rows (first 25)
    """
    c = canvas.Canvas(out_pdf_path, pagesize=A4)
    width, height = A4

    y = height - 2 * cm

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(2 * cm, y, "Chemical Visualizer - Report")
    y -= 1.0 * cm

    # Meta
    c.setFont("Helvetica", 10)
    c.drawString(2 * cm, y, f"Dataset: {dataset_meta.get('name', '-')}")
    y -= 0.5 * cm
    c.drawString(2 * cm, y, f"Uploaded/Loaded At: {dataset_meta.get('uploadedAt', '-')}")
    y -= 0.9 * cm

    # Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2 * cm, y, "Summary")
    y -= 0.6 * cm

    c.setFont("Helvetica", 10)
    lines = [
        f"Total Equipment: {summary.get('total_equipment')}",
        f"Avg Flowrate: {summary.get('avg_flowrate')}",
        f"Avg Pressure: {summary.get('avg_pressure')}",
        f"Avg Temperature: {summary.get('avg_temperature')}",
    ]
    for line in lines:
        c.drawString(2 * cm, y, line)
        y -= 0.45 * cm

    y -= 0.4 * cm

    # Chart image
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2 * cm, y, "Equipment Type Distribution")
    y -= 0.6 * cm

    # Save matplotlib figure to memory buffer
    img_buf = io.BytesIO()
    matplotlib_fig.savefig(img_buf, format="png", dpi=150, bbox_inches="tight")
    img_buf.seek(0)
    img = ImageReader(img_buf)

    # Place chart
    img_w = 16 * cm
    img_h = 8 * cm
    if y - img_h < 2 * cm:
        c.showPage()
        y = height - 2 * cm

    c.drawImage(img, 2 * cm, y - img_h, width=img_w, height=img_h, preserveAspectRatio=True, mask="auto")
    y -= (img_h + 0.8 * cm)

    # Table preview
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2 * cm, y, "Data Preview (first 25 rows)")
    y -= 0.6 * cm

    if not table_rows:
        c.setFont("Helvetica", 10)
        c.drawString(2 * cm, y, "No rows available.")
        c.save()
        return

    cols = list(table_rows[0].keys())
    max_rows = min(len(table_rows), 25)

    c.setFont("Helvetica-Bold", 8)
    header = " | ".join(cols[:8])  # limit columns so it fits
    c.drawString(2 * cm, y, header[:180])
    y -= 0.45 * cm

    c.setFont("Helvetica", 8)
    for i in range(max_rows):
        row = table_rows[i]
        values = [str(row.get(col, "")) for col in cols[:8]]
        line = " | ".join(values)
        c.drawString(2 * cm, y, line[:180])
        y -= 0.4 * cm

        if y < 2 * cm:
            c.showPage()
            y = height - 2 * cm

    c.save()
