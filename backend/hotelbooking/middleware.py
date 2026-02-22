import json
from django.http import JsonResponse
from django.conf import settings

class JsonErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if request.path.startswith('/api/'):
            if response.status_code in [404, 500] and 'text/html' in response.get('Content-Type', ''):
                data = {
                    'status': response.status_code,
                    'error': 'Not Found' if response.status_code == 404 else 'Internal Server Error',
                    'detail': 'L\'endpoint demandé n\'existe pas.' if response.status_code == 404 else 'Une erreur serveur s\'est produite.'
                }
                
                if settings.DEBUG and response.status_code == 404:
                    data['path'] = request.path
                
                return JsonResponse(data, status=response.status_code)
                
        return response
