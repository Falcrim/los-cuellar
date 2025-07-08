from django.urls import path, include
from rest_framework.routers import DefaultRouter

from administracion_electoral.apis import RecintoViewSet, MesaElectoralViewSet, CandidaturaViewSet, PapeletaViewSet
from administracion_electoral.apis.eleccion_viewset import EleccionViewSet
from administracion_electoral.apis.seccion_viewset import SeccionViewSet
from administracion_electoral.apis.cargo_viewset import CargoViewSet

router = DefaultRouter()
router.register(r'elecciones', EleccionViewSet)
router.register(r'secciones', SeccionViewSet)
router.register(r'cargos', CargoViewSet)
router.register(r'recintos', RecintoViewSet)
router.register(r'mesas', MesaElectoralViewSet)
router.register(r'candidaturas', CandidaturaViewSet)
router.register(r'papeletas', PapeletaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
