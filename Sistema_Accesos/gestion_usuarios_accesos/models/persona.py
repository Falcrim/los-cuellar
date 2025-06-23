from django.contrib.auth.models import User
from django.db import models
import uuid


class Persona (models.Model):
    codigo_unico = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=100)
    carnet = models.CharField(max_length=20, unique=True)
    foto = models.ImageField()
    foto_carnet_1 = models.ImageField()
    foto_carnet_2 = models.ImageField()
