from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from administracion_electoral.models.papeleta import Papeleta
from administracion_electoral.permissions import IsAdminElectoral

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from administracion_electoral.models.eleccion import Eleccion
from administracion_electoral.models.seccion import Seccion
from administracion_electoral.models.cargo import Cargo
from administracion_electoral.models.candidatura import Candidatura


class PapeletaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Papeleta
        fields = '__all__'


class PapeletaViewSet(viewsets.ModelViewSet):
    queryset = Papeleta.objects.all()
    serializer_class = PapeletaSerializer
    permission_classes = [IsAuthenticated, IsAdminElectoral]

    @action(detail=False, methods=['post'], url_path='generar')
    def generar_papeletas(self, request):
        eleccion_id = request.data.get("eleccion_id")
        if not eleccion_id:
            return Response({"error": "eleccion_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            eleccion = Eleccion.objects.get(id=eleccion_id)
        except Eleccion.DoesNotExist:
            return Response({"error": "Elección no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        creadas = 0
        for seccion in eleccion.secciones.all():
            if Papeleta.objects.filter(eleccion=eleccion, seccion=seccion).exists():
                continue


            cargos = Cargo.objects.filter(secciones=seccion)


            candidaturas = Candidatura.objects.filter(cargo__in=cargos)

            if candidaturas.exists():
                papeleta = Papeleta.objects.create(
                    eleccion=eleccion,
                    seccion=seccion,
                    generada=True
                )
                papeleta.candidaturas.set(candidaturas)
                creadas += 1

        return Response(
            {"mensaje": f"Se generaron {creadas} papeletas para la elección '{eleccion}'."},
            status=status.HTTP_201_CREATED
        )
