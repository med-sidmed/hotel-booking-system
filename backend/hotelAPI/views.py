from django.http import HttpResponse

def health(request):
    return HttpResponse("Application is running")

