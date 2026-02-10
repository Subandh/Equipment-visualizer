from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel,
    QFileDialog, QMessageBox, QTableWidget, QTableWidgetItem,
    QInputDialog
)

from ui.widgets import MplCanvas
from ui.history_window import HistoryWindow
from services import api

from utils.pdf_report import export_pdf_report


class DashboardWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Visualizer - Desktop Dashboard")
        self.resize(1100, 760)

        self.dataset_meta = None
        self.summary = {}
        self.distribution = {}
        self.table_rows = []

        main = QVBoxLayout()

        # Top buttons row
        top = QHBoxLayout()

        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.clicked.connect(self.pick_and_upload)
        top.addWidget(self.upload_btn)

        self.history_btn = QPushButton("History")
        self.history_btn.clicked.connect(self.open_history_window)
        top.addWidget(self.history_btn)

        self.load_btn = QPushButton("Load Dataset (by name)")
        self.load_btn.clicked.connect(self.prompt_load_by_name)
        top.addWidget(self.load_btn)

        self.pdf_btn = QPushButton("Generate PDF")
        self.pdf_btn.clicked.connect(self.generate_pdf)
        top.addWidget(self.pdf_btn)

        top.addStretch()
        main.addLayout(top)

        # Summary
        self.summary_label = QLabel("No dataset loaded yet.")
        self.summary_label.setStyleSheet("font-size: 12px;")
        main.addWidget(self.summary_label)

        # Chart
        self.chart = MplCanvas(width=6, height=4)
        main.addWidget(self.chart)

        # Table
        self.table = QTableWidget()
        main.addWidget(self.table)

        self.setLayout(main)

    # --- API actions ---

    def pick_and_upload(self):
        path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if not path:
            return

        try:
            data = api.upload_csv(path)
            self.apply_upload_payload(data)
            self.update_display()
        except Exception as e:
            QMessageBox.critical(self, "Upload failed", str(e))

    def open_history_window(self):
        self.hw = HistoryWindow(on_pick=self.load_dataset_by_name)
        self.hw.show()

    def prompt_load_by_name(self):
        name, ok = QInputDialog.getText(
            self,
            "Load Dataset",
            "Enter dataset filename exactly (example: sample_equipment_data.csv):"
        )
        if not ok:
            return
        name = (name or "").strip()
        if not name:
            return
        self.load_dataset_by_name(name)

    def load_dataset_by_name(self, name: str):
        """
        Calls GET /api/datasets/by-name/?name=...
        Backend returns: {summary, distribution, table}
        We'll attach dataset_meta for display.
        """
        try:
            data = api.get_dataset_by_name(name)

            # Keep meta consistent with your web shape
            self.dataset_meta = {
                "name": name,
                "uploadedAt": "(loaded from history)",
            }
            self.summary = data.get("summary", {})
            self.distribution = data.get("distribution", {})
            self.table_rows = data.get("table", [])

            self.update_display()
        except Exception as e:
            QMessageBox.critical(self, "Load failed", str(e))

    # --- helpers ---

    def apply_upload_payload(self, data: dict):
        self.dataset_meta = data.get("dataset_meta", {})
        self.summary = data.get("summary", {})
        self.distribution = data.get("distribution", {})
        self.table_rows = data.get("table", [])

    def update_display(self):
        # Summary
        name = (self.dataset_meta or {}).get("name", "—")
        uploaded = (self.dataset_meta or {}).get("uploadedAt", "—")

        self.summary_label.setText(
            f"Dataset: {name}\nUploaded: {uploaded}\n"
            f"Total: {self.summary.get('total_equipment')}  |  "
            f"Avg Flowrate: {self.summary.get('avg_flowrate')}  |  "
            f"Avg Pressure: {self.summary.get('avg_pressure')}  |  "
            f"Avg Temperature: {self.summary.get('avg_temperature')}"
        )

        # Chart
        self.chart.ax.clear()
        dist = self.distribution or {}
        if dist:
            labels = list(dist.keys())
            values = list(dist.values())
            self.chart.ax.pie(values, labels=labels, autopct="%1.0f%%")
            self.chart.ax.set_title("Equipment Type Distribution")
        else:
            self.chart.ax.text(0.5, 0.5, "No 'Type' distribution found", ha="center", va="center")
            self.chart.ax.set_axis_off()
        self.chart.draw()

        # Table: dynamic columns (works with any CSV)
        rows = self.table_rows or []
        if not rows:
            self.table.setRowCount(0)
            self.table.setColumnCount(0)
            return

        cols = list(rows[0].keys())
        self.table.setColumnCount(len(cols))
        self.table.setHorizontalHeaderLabels(cols)

        max_rows = min(len(rows), 200)
        self.table.setRowCount(max_rows)

        for r in range(max_rows):
            for c, col_name in enumerate(cols):
                val = rows[r].get(col_name, "")
                self.table.setItem(r, c, QTableWidgetItem(str(val)))

        self.table.resizeColumnsToContents()

    # --- PDF ---
    def generate_pdf(self):
        if not self.dataset_meta:
            QMessageBox.warning(self, "No dataset", "Load or upload a dataset first.")
            return

        out_path, _ = QFileDialog.getSaveFileName(
            self,
            "Save PDF Report",
            f"{self.dataset_meta.get('name', 'report')}.pdf",
            "PDF Files (*.pdf)"
        )
        if not out_path:
            return

        try:
            export_pdf_report(
                out_pdf_path=out_path,
                dataset_meta=self.dataset_meta,
                summary=self.summary,
                distribution=self.distribution,
                table_rows=self.table_rows,
                matplotlib_fig=self.chart.fig,  # uses the same chart already drawn
            )
            QMessageBox.information(self, "PDF saved", f"Report saved to:\n{out_path}")
        except Exception as e:
            QMessageBox.critical(self, "PDF failed", str(e))
