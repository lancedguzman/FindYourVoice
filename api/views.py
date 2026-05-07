from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_voice_token(request):
    # TODO: We will replace this with the actual Hume SDK token generation later
    dummy_payload = {
        "token": "hume_dummy_token_12345",
        "message": "Connection successful! Django is talking to Vite."
    }
    return Response(dummy_payload)
