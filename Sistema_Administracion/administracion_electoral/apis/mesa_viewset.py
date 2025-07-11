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

    def validate_jurado_ids(self, value):
        if isinstance(value, int):
            value = [value]
        elif not isinstance(value, list):
            raise serializers.ValidationError("El campo 'jurado_ids' debe ser un entero o una lista de enteros.")

        if not all(isinstance(j, int) for j in value):
            raise serializers.ValidationError("Todos los IDs de jurado deben ser enteros.")

        current_instance_id = self.instance.id if self.instance else None

        mesas = MesaElectoral.objects.all()
        if current_instance_id:
            mesas = mesas.exclude(id=current_instance_id)

        jurados_usados = set()
        for mesa in mesas:
            jurado_ids = mesa.jurado_ids
            if isinstance(jurado_ids, int):
                jurado_ids = [jurado_ids]
            elif not isinstance(jurado_ids, list):
                jurado_ids = []
            jurados_usados.update(jurado_ids)

        for jurado_id in value:
            if jurado_id in jurados_usados:
                raise serializers.ValidationError(
                    f"El jurado con ID {jurado_id} ya está asignado a otra mesa."
                )

        return value


class MesaElectoralViewSet(viewsets.ModelViewSet):
    queryset = MesaElectoral.objects.all()
    serializer_class = MesaElectoralSerializer
    permission_classes = [IsAuthenticated, IsAdminElectoral]
