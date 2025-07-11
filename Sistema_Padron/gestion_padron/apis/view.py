from rest_framework.views import APIView
from rest_framework.response import Response

from gestion_padron.models import Votante


class VerificarPadronPublico(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        ci = request.query_params.get('ci')
        if not ci:
            return Response({"error": "CI requerido."}, status=400)

        try:
            votante = Votante.objects.get(ci=ci)
            return Response({
                "nombre_completo": votante.nombre_completo,
                "recinto": votante.recinto_nombre,
                "recinto_id": votante.recinto_id,
            })
        except Votante.DoesNotExist:
            return Response({"error": "No encontrado en padrón."}, status=404)