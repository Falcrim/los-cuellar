
import requests
from django.conf import settings

def obtener_jurados(user_token):
    url = f"{settings.API_ACCESOS_URL}?role=Jurado"
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error al obtener jurados: {response.status_code} - {response.text}")

