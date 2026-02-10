import sys
from PyQt5.QtWidgets import QApplication
from services.auth_store import load_token, clear_token
from ui.login_window import LoginWindow
from ui.dashboard_window import DashboardWindow
from services.auth_store import clear_token

def logout(self):
    clear_token()
    self.close()

def main():
    app = QApplication(sys.argv)

    dashboard = DashboardWindow()
    login_window = None

    def open_dashboard():
        """Called after successful login OR when token already exists"""
        nonlocal login_window

        if login_window:
            login_window.close()

        dashboard.show()

    def open_login():
        """Used if token missing OR logout added later"""
        nonlocal login_window

        dashboard.hide()

        login_window = LoginWindow(on_success=open_dashboard)
        login_window.show()

    # --- Startup logic ---
    token = load_token()

    if token:
        open_dashboard()
    else:
        open_login()

    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
