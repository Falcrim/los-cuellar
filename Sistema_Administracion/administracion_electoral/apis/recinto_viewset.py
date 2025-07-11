from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from administracion_electoral.models.recinto import Recinto
from administracion_electoral.permissions import IsAdminElectoral


class RecintoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recinto
        fields = '__all__'


class RecintoViewSet(viewsets.ModelViewSet):
    queryset = Recinto.objects.all()
    serializer_class = RecintoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['seccion']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminElectoral()]

    def list(self, request, *args, **kwargs):
        user = request.user

        if not hasattr(user, "role") or user.role not in ["AdminElectoral", "AdminPadron"]:
            return Response({"detail": "No tienes permiso para ver los recintos."}, status=status.HTTP_403_FORBIDDEN)

        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def asignar_mesas(self, request, pk=None):
        from .asignacion import asignar_votantes_a_mesas

        if not request.user.role == "AdminElectoral":
            return Response(
                {"error": "Solo administradores electorales pueden ejecutar esta acción"},
                status=status.HTTP_403_FORBIDDEN
            )

        auth_token = request.headers.get('Authorization', '')
        result = asignar_votantes_a_mesas(pk, auth_token)


        status_code = result.get('status', status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status_code)
