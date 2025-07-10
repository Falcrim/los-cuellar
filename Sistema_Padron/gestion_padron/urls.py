from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from gestion_padron.apis import VotanteViewSet, VerificarPadronPublico, ListaRecintosDesdeAdminElectoral

router = DefaultRouter()
router.register(r'votantes', VotanteViewSet)

urlpatterns = router.urls + [
    path('verificar/', VerificarPadronPublico.as_view(), name='verificar-padron'),
    path('recintos/', ListaRecintosDesdeAdminElectoral.as_view(), name='recintos-desde-admin-electoral'),
]
