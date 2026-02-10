from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox
)
from services import api
from services.auth_store import save_token

class LoginWindow(QWidget):
    def __init__(self, on_success):
        super().__init__()
        self.on_success = on_success
        self.setWindowTitle("Chemical Visualizer - Login")
        self.setMinimumWidth(360)

        layout = QVBoxLayout()

        layout.addWidget(QLabel("Username"))
        self.username = QLineEdit()
        layout.addWidget(self.username)

        layout.addWidget(QLabel("Password"))
        self.password = QLineEdit()
        self.password.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password)

        self.btn = QPushButton("Login")
        self.btn.clicked.connect(self.do_login)
        layout.addWidget(self.btn)

        self.setLayout(layout)

    def do_login(self):
        u = self.username.text().strip()
        p = self.password.text().strip()
        if not u or not p:
            QMessageBox.warning(self, "Missing", "Enter username and password")
            return

        try:
            token = api.login(u, p)
            save_token(token)
            self.on_success()
            self.close()
        except Exception as e:
            QMessageBox.critical(self, "Login failed", str(e))
