from django.db import models
from administracion_electoral.models.eleccion import Eleccion
from administracion_electoral.models.seccion import Seccion
from administracion_electoral.models.candidatura import Candidatura

class Papeleta(models.Model):
    eleccion = models.ForeignKey(Eleccion, on_delete=models.CASCADE)
    seccion = models.ForeignKey(Seccion, on_delete=models.CASCADE)
    candidaturas = models.ManyToManyField(Candidatura)

    generada = models.BooleanField(default=False)

    def __str__(self):
        return f"Papeleta {self.eleccion.tipo} - {self.seccion.nombre}"
