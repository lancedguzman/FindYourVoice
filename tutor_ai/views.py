from django.shortcuts import render, HttpResponse

def index(request):
    """A simple view to test if the app is working."""
    return HttpResponse("Hello, world! This is the Tutor AI app.")
