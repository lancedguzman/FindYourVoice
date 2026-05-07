from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('get-voice-token/', views.get_voice_token, name='get_voice_token'),
]
