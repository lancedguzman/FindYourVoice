import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_voice_token(request):
    """Endpoint to get a token for Hume API."""
    api_key = os.getenv('HUME_API_KEY')
    secret_key = os.getenv('HUME_SECRET_KEY')

    if not api_key or not secret_key:
        return Response({"error": "API key and secret key must be set in environment variables."}, status=500)
    
    url = "https://api.hume.ai/v0/auth/token"

    # Hume requires x-www-form-urlencoded format for this endpoint
    payload = {
        "client_id": api_key,
        "client_secret": secret_key,
        "grant_type": "client_credentials"
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=payload, headers=headers)
        response.raise_for_status()  # Catch any 4xx or 5xx errors
        token_data = response.json()
        
        return Response({
            "token": token_data.get("access_token"),
            "message": "Token generated successfully!"
        })
    
    except requests.exceptions.RequestException as e:
        print(f"Hume API Error: {e}")
        return Response({"error": "Failed to authenticate with Hume"}, status=500)
