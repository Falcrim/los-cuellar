import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions


class IsPadronAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user, 'role', '') == 'AdminPadron'

class ListaRecintosDesdeAdminElectoral(APIView):
    permission_classes = [IsAuthenticated, IsPadronAdmin]

    def get(self, request):
        API_URL = "http://localhost:8001/api/admin-electoral/recintos/"
        API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyMTkwNTQ3LCJpYXQiOjE3NTIxNzk3NDcsImp0aSI6IjBmNmY4ODFlY2M2ZjRkNjFhMTg2M2M0MGIzY2FiMTA3IiwidXNlcl9pZCI6Miwicm9sZSI6IkFkbWluRWxlY3RvcmFsIiwidXNlcm5hbWUiOiJhZG1pbmVsZWN0b3JhbCJ9.0nz0nLNzM7lPJS3yjXExofECnzM20MtcwYEavz9zyVA"


        headers = {"Authorization": f"Bearer {API_TOKEN}"}

        try:
            response = requests.get(API_URL, headers=headers)
            if response.status_code == 200:
                return Response(response.json())
            return Response({"error": "Fallo al obtener recintos."}, status=response.status_code)
        except requests.RequestException:
            return Response({"error": "No se pudo conectar con API2."}, status=500)
