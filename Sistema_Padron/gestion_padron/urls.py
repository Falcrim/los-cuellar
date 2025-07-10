from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from gestion_padron.apis import VotanteViewSet, VerificarPadronPublico, ListaRecintosDesdeAdminElectoral

router = DefaultRouter()
router.register(r'padron/votantes', VotanteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/padron/verificar/', VerificarPadronPublico.as_view()),
    path('api/padron/recintos/', ListaRecintosDesdeAdminElectoral.as_view()),
]
