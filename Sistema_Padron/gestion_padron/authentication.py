from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from django.contrib.auth.models import AnonymousUser

class ExternalUser:
    def __init__(self, user_id, username, role):
        self.id = user_id
        self.username = username
        self.role = role
        self.is_authenticated = True

    def __str__(self):
        return self.username

class ExternalJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token["user_id"]
            username = validated_token["username"]
            role = validated_token["role"]
        except KeyError:
            raise exceptions.AuthenticationFailed("Token inválido. Faltan campos requeridos.")

        return ExternalUser(user_id, username, role)
