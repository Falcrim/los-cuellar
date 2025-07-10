
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from administracion_electoral.external_services import obtener_jurados

class JuradosExternosAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_token = request.auth
            jurados = obtener_jurados(user_token)
            return Response(jurados)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
