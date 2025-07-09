from django.db import models

from administracion_electoral.models import Seccion


class Recinto(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    seccion = models.ForeignKey(Seccion, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
