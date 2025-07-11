# administracion_electoral/asignacion.py
import requests
from django.conf import settings
from django.db import transaction
from rest_framework import status

from administracion_electoral.models import Recinto, MesaElectoral
from collections import defaultdict


def asignar_votantes_a_mesas(recinto_id, auth_token):

    if not auth_token or not auth_token.startswith('Bearer '):
        return {
            "error": "Token de autenticación no proporcionado o formato incorrecto",
            "status": status.HTTP_401_UNAUTHORIZED
        }

    try:
        with transaction.atomic():
            recinto = Recinto.objects.select_for_update().get(id=recinto_id)
            mesas = MesaElectoral.objects.filter(recinto=recinto).order_by('numero')

            if not mesas.exists():
                return {
                    "error": "No hay mesas configuradas en este recinto",
                    "status": status.HTTP_400_BAD_REQUEST
                }

            headers = {
                "Authorization": auth_token,
                "Content-Type": "application/json",
                "X-Request-Source": "API2-Asignacion-Mesas"
            }

            api3_url = f"{settings.API3_BASE_URL}/api/gestionP/votantes/"
            params = {
                'recinto_id': recinto_id,
                'ordering': 'nombre_completo',
                'sin_mesa': 'true'
            }

            try:
                response = requests.get(
                    api3_url,
                    headers=headers,
                    params=params,
                    timeout=10
                )

                if response.status_code == 401:
                    return {
                        "error": "Token no autorizado en API 3",
                        "status": status.HTTP_401_UNAUTHORIZED
                    }

                if response.status_code != 200:
                    return {
                        "error": f"API3 respondió con error {response.status_code}: {response.text}",
                        "status": status.HTTP_502_BAD_GATEWAY
                    }

                votantes = response.json()

            except requests.Timeout:
                return {
                    "error": "Timeout al conectar con API 3",
                    "status": status.HTTP_504_GATEWAY_TIMEOUT
                }
            except requests.RequestException as e:
                return {
                    "error": f"Error de conexión con API 3: {str(e)}",
                    "status": status.HTTP_503_SERVICE_UNAVAILABLE
                }

            if not votantes:
                return {
                    "message": "No hay votantes sin asignar en este recinto",
                    "status": status.HTTP_200_OK
                }

            num_mesas = mesas.count()
            asignaciones = defaultdict(list)
            asignaciones_por_hacer = []

            for i, votante in enumerate(votantes):
                mesa_index = i % num_mesas
                mesa = mesas[mesa_index]

                asignaciones[mesa.id].append(votante['ci'])
                asignaciones_por_hacer.append({
                    "ci": votante['ci'],
                    "mesa_id": mesa.id
                })


            api3_asignar_url = f"{settings.API3_BASE_URL}/api/gestionP/asignar-mesa/"
            batch_size = 50
            errores = []

            for i in range(0, len(asignaciones_por_hacer), batch_size):
                batch = asignaciones_por_hacer[i:i + batch_size]

                try:
                    response = requests.post(
                        api3_asignar_url,
                        headers=headers,
                        json={"asignaciones": batch},
                        timeout=15
                    )

                    if response.status_code != 200:
                        errores.append({
                            "batch": i,
                            "error": response.text
                        })

                except requests.RequestException as e:
                    errores.append({
                        "batch": i,
                        "error": str(e)
                    })

            if errores:
                return {
                    "error": "Algunas asignaciones fallaron",
                    "detalles": errores,
                    "asignaciones_exitosas": len(asignaciones_por_hacer) - len(errores) * batch_size,
                    "status": status.HTTP_207_MULTI_STATUS
                }


            for mesa in mesas:
                mesa.num_votantes = len(asignaciones.get(mesa.id, []))
                mesa.save()


            return {
                "success": True,
                "recinto": recinto.nombre,
                "total_votantes": len(votantes),
                "total_asignados": len(asignaciones_por_hacer),
                "mesas": [
                    {
                        "mesa_id": mesa.id,
                        "numero": mesa.numero,
                        "votantes_asignados": len(asignaciones.get(mesa.id, []))
                    }
                    for mesa in mesas
                ],
                "status": status.HTTP_200_OK
            }

    except Recinto.DoesNotExist:
        return {
            "error": "Recinto no encontrado",
            "status": status.HTTP_404_NOT_FOUND
        }
    except Exception as e:
        return {
            "error": f"Error inesperado: {str(e)}",
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR
        }