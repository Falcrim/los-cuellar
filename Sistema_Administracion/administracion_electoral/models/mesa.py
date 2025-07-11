from django.db import models
from administracion_electoral.models.recinto import Recinto

class MesaElectoral(models.Model):
    numero = models.PositiveIntegerField()
    recinto = models.ForeignKey(Recinto, on_delete=models.CASCADE, related_name='mesas')
    jurado_ids = models.JSONField(default=list, blank=True)
    num_votantes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Mesa {self.numero} - {self.recinto.nombre} ({self.num_votantes} votantes)"



