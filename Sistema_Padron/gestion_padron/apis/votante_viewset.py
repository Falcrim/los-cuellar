from rest_framework import serializers
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

class VotanteViewSet(viewsets.ModelViewSet):
    queryset = Votante.objects.all()
    serializer_class = VotanteSerializer
    permission_classes = [IsPadronAdmin]