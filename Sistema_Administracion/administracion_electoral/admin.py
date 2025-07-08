from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Eleccion, Seccion, Cargo

admin.site.register(Eleccion)
admin.site.register(Seccion)
admin.site.register(Cargo)
