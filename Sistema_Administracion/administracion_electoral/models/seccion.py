from django.db import models


class Seccion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    area_geografica = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.nombre
