# Generated by Django 5.2.4 on 2025-07-11 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('administracion_electoral', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mesaelectoral',
            name='num_votantes',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
