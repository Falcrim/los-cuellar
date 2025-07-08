from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ROLE_CHOICES = [
        ('SuperAdmin', 'SuperAdmin'),
        ('AdminElectoral', 'AdminElectoral'),
        ('Jurado', 'Jurado'),
        ('AdminPadron', 'AdminPadron'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"
