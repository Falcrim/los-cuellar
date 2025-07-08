from .eleccion_viewset import EleccionViewSet, EleccionSerializer
from .seccion_viewset import SeccionViewSet, SeccionSerializer
from .cargo_viewset import CargoViewSet, CargoSerializer
from .recinto_viewset import RecintoViewSet, RecintoSerializer
from .mesa_viewset import MesaElectoralViewSet, MesaElectoralSerializer
from .candidatura_viewset import CandidaturaViewSet, CandidaturaSerializer
from .papeleta_viewset import PapeletaViewSet, PapeletaSerializer
from .jurado_proxy import JuradosExternosAPIView