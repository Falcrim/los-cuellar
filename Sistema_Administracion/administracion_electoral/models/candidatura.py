from django.db import models
from administracion_electoral.models.cargo import Cargo

class Candidatura(models.Model):
    sigla = models.CharField(max_length=10)
    partido = models.CharField(max_length=100)
    color = models.CharField(max_length=7)  # Ej: #FF0000
    candidato = models.CharField(max_length=100)
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.partido} - {self.candidato}"
