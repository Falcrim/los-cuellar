from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from gestion_usuarios_accesos.models import User

admin.site.register(User, UserAdmin)
