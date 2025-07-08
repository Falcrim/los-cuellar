from django.urls import path, include
from rest_framework import routers

from gestion_usuarios_accesos.apis import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
