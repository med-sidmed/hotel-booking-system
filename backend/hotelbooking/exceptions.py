from django.http import JsonResponse
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Appeler l'exception handler par défaut de DRF pour obtenir la réponse standard
    response = exception_handler(exc, context)

    # Si DRF n'a pas pu gérer l'exception (ex: erreur Django classique),
    # nous pourrions vouloir retourner une réponse JSON personnalisée ici.
    if response is None:
        return JsonResponse({
            'detail': str(exc) or 'Une erreur serveur interne s\'est produite.'
        }, status=500)

    return response

def handler404(request, exception=None):
    return JsonResponse({
        'error': 'Not Found',
        'detail': 'L\'endpoint demandé n\'existe pas.'
    }, status=404)

def handler500(request):
    return JsonResponse({
        'error': 'Internal Server Error',
        'detail': 'Une erreur inattendue s\'est produite sur le serveur.'
    }, status=500)
