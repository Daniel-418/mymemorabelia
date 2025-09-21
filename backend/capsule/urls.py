from django.urls import path
from .views import index

app_name = "capsule"
urlpatterns= [
    path("", index, name="home"),
]
