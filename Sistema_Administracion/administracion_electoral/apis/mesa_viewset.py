from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from administracion_electoral.models.mesa import MesaElectoral
from administracion_electoral.models.recinto import Recinto
from administracion_electoral.permissions import IsAdminElectoral


class MesaElectoralSerializer(serializers.ModelSerializer):
    recinto_nombre = serializers.CharField(source='recinto.nombre', read_only=True)

    class Meta:
        model = MesaElectoral
        fields = ['id', 'numero', 'recinto', 'recinto_nombre', 'jurado_ids']


class MesaElectoralViewSet(viewsets.ModelViewSet):
    queryset = MesaElectoral.objects.all()
    serializer_class = MesaElectoralSerializer
    permission_classes = [IsAuthenticated, IsAdminElectoral]
