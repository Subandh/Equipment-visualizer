from django.urls import path
from .views import UploadCSV, History, DatasetByName
from .auth_views import LoginView, LogoutView

urlpatterns = [
    path("upload/", UploadCSV.as_view(), name="upload"),
    path("history/", History.as_view(), name="history"),
    path("datasets/by-name/", DatasetByName.as_view(), name="dataset_by_name"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
