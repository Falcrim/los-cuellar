from django.db import models

from administracion_electoral.models import Seccion


class Eleccion(models.Model):
    TIPO_CHOICES = [
        ('Presidencial', 'Presidencial'),
        ('Municipal', 'Municipal'),
        ('Universitaria', 'Universitaria'),
    ]
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    fecha = models.DateField()
    secciones = models.ManyToManyField(Seccion)

    def __str__(self):
        return f"{self.tipo} - {self.fecha}"