from django.http import JsonResponse


def health(_request):
    return JsonResponse({"ok": True, "service": "soullink-api", "stack": "django"})
