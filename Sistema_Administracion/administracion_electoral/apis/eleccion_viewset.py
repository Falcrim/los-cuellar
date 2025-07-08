from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from administracion_electoral.models.eleccion import Eleccion
from administracion_electoral.permissions import IsAdminElectoral


class EleccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eleccion
        fields = '__all__'


class EleccionViewSet(viewsets.ModelViewSet):
    queryset = Eleccion.objects.all()
    serializer_class = EleccionSerializer
    permission_classes = [IsAuthenticated, IsAdminElectoral]
