
import requests
from django.conf import settings

def obtener_jurados():
    url = f"{settings.API_ACCESOS_URL}?role=Jurado"
    headers = {
        "Authorization": f"Bearer {settings.API_ACCESOS_TOKEN}"
    }
    params = {
        "role": "Jurado"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error al obtener jurados: {response.status_code} - {response.text}")
