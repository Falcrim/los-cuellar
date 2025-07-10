from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import action
from rest_framework.response import Response

from gestion_usuarios_accesos.models import User
from rest_framework import viewsets, permissions
from gestion_usuarios_accesos.models import User


class IsSuperAdminOrReadOnlyForAdminElectoral(permissions.BasePermission):
    """
    - Permite acceso total al rol SuperAdmin.
    - Permite solo lectura al rol AdminElectoral.
    - Deniega acceso a otros roles.
    """
    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        if user.role == 'SuperAdmin':
            return True

        if user.role == 'AdminElectoral' and request.method in permissions.SAFE_METHODS:
            return True

        return False

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SuperAdmin'


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdminOrReadOnlyForAdminElectoral]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get("role")
        if role:
            queryset = queryset.filter(role=role)
        return queryset
