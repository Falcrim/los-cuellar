import uuid
from django.db import models

class Votante(models.Model):
    id = models.AutoField(primary_key=True)
    ci = models.CharField(max_length=15, unique=True)
    nombre_completo = models.CharField(max_length=200)
    direccion = models.TextField()
    foto_ci_anverso = models.ImageField(upload_to="ci/anverso/")
    foto_ci_reverso = models.ImageField(upload_to="ci/reverso/")
    foto_votante = models.ImageField(upload_to="votantes/")
    recinto_id = models.PositiveIntegerField()  # Sale del recinto Muajajaja
    recinto_nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre_completo
