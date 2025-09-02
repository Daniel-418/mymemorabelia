from django.urls import path

from .views import CreateCapsuleItem, ListCapsuleItems, Register, Login, CreateCapsule, ListCapsules


app_name = "capsule_api"

urlpatterns = [
    path("register/", Register.as_view(), name="register"),
    path("login/", Login.as_view(), name="login"),
    path("capsules/create/", CreateCapsule.as_view(), name="create_capsule"),
    path("capsules/", ListCapsules.as_view(), name="list_capsules"),
    path("capsules/<int:capsule_pk>/items/", ListCapsuleItems.as_view(), name="list_capsule_items"),
    path("capsules/<int:capsule_pk>/items/create/", CreateCapsuleItem.as_view(), name="create_capsule_item")
]
