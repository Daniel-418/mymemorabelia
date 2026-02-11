from django.urls import path
from .views import project_home

app_name = "capsule"
urlpatterns = [
    path("", project_home, name="home"),
]
