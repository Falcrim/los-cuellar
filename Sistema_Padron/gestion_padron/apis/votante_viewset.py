from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from gestion_padron.models import Votante
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class VotanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votante
        fields = '__all__'


class IsPadronAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'AdminPadron'


class IsAdminElectoral(permissions.BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'AdminElectoral'
        )

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


# permissions.py
class IsAdminElectoralOrPadron(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['AdminPadron', 'AdminElectoral']


class VotanteViewSet(viewsets.ModelViewSet):
    queryset = Votante.objects.all()
    serializer_class = VotanteSerializer
    permission_classes = [IsAdminElectoralOrPadron]  # Permite ambos roles

    def get_queryset(self):
        queryset = super().get_queryset()


        recinto_id = self.request.query_params.get('recinto_id')
        if recinto_id:
            queryset = queryset.filter(recinto_id=recinto_id)


        sin_mesa = self.request.query_params.get('sin_mesa')
        if sin_mesa and sin_mesa.lower() == 'true':
            queryset = queryset.filter(mesa_id__isnull=True)


        return queryset.order_by('nombre_completo')


class AsignarMesaVotante(APIView):
    permission_classes = [IsAuthenticated, IsAdminElectoralOrPadron]

    def post(self, request):
        asignaciones = request.data.get('asignaciones', [])

        if not asignaciones:
            return Response({"error": "Lista de asignaciones requerida"}, status=400)

        resultados = []
        errores = []

        for asignacion in asignaciones:
            ci = asignacion.get('ci')
            mesa_id = asignacion.get('mesa_id')

            if not ci or not mesa_id:
                errores.append({"error": "CI y mesa_id requeridos", "asignacion": asignacion})
                continue

            try:
                votante = Votante.objects.get(ci=ci)
                votante.mesa_id = mesa_id
                votante.save()
                resultados.append({
                    "ci": ci,
                    "mesa_id": mesa_id,
                    "status": "asignado"
                })
            except Votante.DoesNotExist:
                errores.append({
                    "error": "Votante no encontrado",
                    "ci": ci
                })

        return Response({
            "asignaciones_exitosas": len(resultados),
            "asignaciones_fallidas": len(errores),
            "resultados": resultados,
            "errores": errores
        }, status=207 if errores else 200)
