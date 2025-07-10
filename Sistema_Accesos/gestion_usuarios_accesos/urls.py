from django.urls import path, include
from rest_framework import routers

from gestion_usuarios_accesos.apis import UserViewSet
from gestion_usuarios_accesos.apis.user_viewset import CurrentUserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'account', CurrentUserViewSet, basename='account')

urlpatterns = [
    path('', include(router.urls)),
]
