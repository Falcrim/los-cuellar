from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
import requests


class IsPadronAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user, 'role', '') == 'AdminPadron'


class ListaRecintosDesdeAdminElectoral(APIView):
    permission_classes = [IsAuthenticated, IsPadronAdmin]

    def get(self, request):
        # 1. Obtener token del usuario autenticado en API3
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return Response(
                {"error": "Token de autorización no proporcionado"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # 2. Usar el mismo token para llamar a API2
        headers = {"Authorization": auth_header}

        try:
            # 3. URL debería venir de configuración (mejor práctica)
            API_URL = "http://localhost:8001/api/admin-electoral/recintos/"

            response = requests.get(API_URL, headers=headers)

            # 4. Manejar posibles errores
            if response.status_code == 200:
                return Response(response.json())
            else:
                return Response(
                    {
                        "error": f"API2 respondió con error {response.status_code}",
                        "detail": response.text
                    },
                    status=response.status_code
                )

        except requests.ConnectionError:
            return Response(
                {"error": "No se pudo conectar con API2"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except requests.Timeout:
            return Response(
                {"error": "Timeout al conectar con API2"},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except Exception as e:
            return Response(
                {"error": f"Error inesperado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )