from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from administracion_electoral.models.seccion import Seccion
from administracion_electoral.permissions import IsAdminElectoral


class SeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seccion
        fields = '__all__'


class SeccionViewSet(viewsets.ModelViewSet):
    queryset = Seccion.objects.all()
    serializer_class = SeccionSerializer
    permission_classes = [IsAuthenticated, IsAdminElectoral]