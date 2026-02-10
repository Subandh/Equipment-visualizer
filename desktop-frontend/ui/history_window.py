from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QListWidget, QPushButton,
    QMessageBox, QHBoxLayout
)
from services import api

class HistoryWindow(QWidget):
    """
    Shows last 5 datasets from GET /api/history/
    User selects one -> calls callback(name)
    """
    def __init__(self, on_pick):
        super().__init__()
        self.on_pick = on_pick
        self.setWindowTitle("History - Last Uploads")
        self.resize(520, 420)

        layout = QVBoxLayout()

        layout.addWidget(QLabel("Select a dataset to load:"))

        self.list = QListWidget()
        self.list.itemDoubleClicked.connect(self.pick_selected)
        layout.addWidget(self.list)

        btn_row = QHBoxLayout()
        self.refresh_btn = QPushButton("Refresh")
        self.refresh_btn.clicked.connect(self.load_history)
        btn_row.addWidget(self.refresh_btn)

        self.load_btn = QPushButton("Load Selected")
        self.load_btn.clicked.connect(self.pick_selected)
        btn_row.addWidget(self.load_btn)

        layout.addLayout(btn_row)
        self.setLayout(layout)

        self.items = []
        self.load_history()

    def load_history(self):
        try:
            self.list.clear()
            self.items = api.get_history()  # backend serializer list
            # Expect each item has: name, uploadedAt
            for x in self.items:
                name = x.get("name", "")
                uploaded = x.get("uploadedAt", "")
                self.list.addItem(f"{name}   •   {uploaded}")
        except Exception as e:
            QMessageBox.critical(self, "History failed", str(e))

    def pick_selected(self):
        idx = self.list.currentRow()
        if idx < 0 or idx >= len(self.items):
            QMessageBox.warning(self, "No selection", "Select a dataset first.")
            return

        name = self.items[idx].get("name")
        if not name:
            QMessageBox.warning(self, "Invalid item", "Selected item has no dataset name.")
            return

        # call back to dashboard to load dataset
        self.on_pick(name)
        self.close()
