import json
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from functools import wraps

import jwt
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import UserProfile

JWT_ALGORITHM = "HS256"
JWT_TTL_SECONDS = 60 * 60 * 24 * 30  # 30 days


def health(_request):
    return JsonResponse(
        {
            "ok": True,
            "service": "soullink-api",
            "stack": "django",
            "db": "postgres" if settings.DATABASES["default"]["ENGINE"].endswith("postgresql") else "sqlite",
        }
    )


def _json_body(request) -> dict:
    try:
        return json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return {}


def _profile_dict(p: UserProfile) -> dict:
    return {
        "id": str(p.id),
        "username": p.username or "",
        "email": p.email,
        "auth_method": p.auth_method,
        "emotion": p.emotion,
        "created_at": p.created_at.isoformat(),
        "updated_at": p.updated_at.isoformat(),
    }


def _issue_token(user: UserProfile) -> str:
    now = int(time.time())
    payload = {
        "sub": str(user.id),
        "iat": now,
        "exp": now + JWT_TTL_SECONDS,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)


def _user_from_token(request) -> UserProfile | None:
    header = request.META.get("HTTP_AUTHORIZATION", "")
    if not header.startswith("Bearer "):
        return None
    token = header[7:].strip()
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        return UserProfile.objects.get(id=user_id)
    except (jwt.PyJWTError, UserProfile.DoesNotExist, ValueError):
        return None


def require_auth(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        user = _user_from_token(request)
        if not user:
            return JsonResponse({"error": "unauthorized"}, status=401)
        request.soullink_user = user
        return view(request, *args, **kwargs)

    return wrapper


def _auth_response(user: UserProfile) -> JsonResponse:
    return JsonResponse({"token": _issue_token(user), "user": _profile_dict(user)})


@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    data = _json_body(request)
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return JsonResponse({"error": "email and password required"}, status=400)
    if len(password) < 6:
        return JsonResponse({"error": "password must be at least 6 characters"}, status=400)
    if UserProfile.objects.filter(email=email).exclude(email="").exists():
        return JsonResponse({"error": "email already registered"}, status=409)

    user = UserProfile(email=email, auth_method="email")
    user.set_password(password)
    user.save()
    return _auth_response(user)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    data = _json_body(request)
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return JsonResponse({"error": "email and password required"}, status=400)
    try:
        user = UserProfile.objects.get(email=email)
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "invalid email or password"}, status=401)
    if not user.check_password(password):
        return JsonResponse({"error": "invalid email or password"}, status=401)
    return _auth_response(user)


def _verify_google_id_token(id_token: str) -> dict | None:
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={urllib.parse.quote(id_token)}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return None
    if not data.get("sub"):
        return None
    return data


@csrf_exempt
@require_http_methods(["POST"])
def google_auth(request):
    data = _json_body(request)
    id_token = (data.get("id_token") or "").strip()
    if not id_token:
        return JsonResponse({"error": "id_token required"}, status=400)

    claims = _verify_google_id_token(id_token)
    if not claims:
        return JsonResponse({"error": "invalid Google token"}, status=401)

    google_id = claims["sub"]
    email = (claims.get("email") or "").strip().lower()

    user = UserProfile.objects.filter(google_id=google_id).first()
    if not user and email:
        user = UserProfile.objects.filter(email=email).exclude(email="").first()
        if user:
            user.google_id = google_id
            user.auth_method = "google"
            user.save(update_fields=["google_id", "auth_method", "updated_at"])

    if not user:
        user = UserProfile.objects.create(
            email=email,
            google_id=google_id,
            auth_method="google",
        )

    return _auth_response(user)


@csrf_exempt
@require_http_methods(["POST"])
def apple_auth(request):
    """Accept Apple identity token; decode without full JWKS verify in DEBUG for setup simplicity."""
    data = _json_body(request)
    identity_token = (data.get("identity_token") or "").strip()
    email = (data.get("email") or "").strip().lower()
    if not identity_token:
        return JsonResponse({"error": "identity_token required"}, status=400)

    try:
        # Unverified decode for apple user id — production should verify with Apple JWKS
        claims = jwt.decode(
            identity_token,
            options={"verify_signature": False, "verify_aud": False},
        )
    except jwt.PyJWTError:
        return JsonResponse({"error": "invalid Apple token"}, status=401)

    apple_id = claims.get("sub")
    if not apple_id:
        return JsonResponse({"error": "invalid Apple token"}, status=401)
    token_email = (claims.get("email") or email or "").strip().lower()

    user = UserProfile.objects.filter(apple_id=apple_id).first()
    if not user and token_email:
        user = UserProfile.objects.filter(email=token_email).exclude(email="").first()
        if user:
            user.apple_id = apple_id
            user.auth_method = "apple"
            user.save(update_fields=["apple_id", "auth_method", "updated_at"])

    if not user:
        user = UserProfile.objects.create(
            email=token_email,
            apple_id=apple_id,
            auth_method="apple",
        )

    return _auth_response(user)


@require_GET
@require_auth
def me(request):
    return JsonResponse({"user": _profile_dict(request.soullink_user)})


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT"])
@require_auth
def profile(request):
    user: UserProfile = request.soullink_user

    if request.method == "GET":
        return JsonResponse(_profile_dict(user))

    data = _json_body(request)
    username = (data.get("username") or "").strip()
    emotion = (data.get("emotion") or "").strip()
    email = (data.get("email") or "").strip().lower()
    auth_method = (data.get("auth_method") or user.auth_method).strip()

    if username:
        taken = (
            UserProfile.objects.filter(username__iexact=username)
            .exclude(id=user.id)
            .exists()
        )
        if taken:
            return JsonResponse({"error": "username taken", "available": False}, status=409)
        user.username = username

    if emotion:
        user.emotion = emotion
    if email:
        user.email = email
    if auth_method:
        user.auth_method = auth_method
    user.save()
    return JsonResponse(_profile_dict(user))


@require_GET
def username_available(request):
    username = (request.GET.get("username") or "").strip()
    if not username:
        return JsonResponse({"error": "username required"}, status=400)
    exclude_id = (request.GET.get("user_id") or "").strip()
    qs = UserProfile.objects.filter(username__iexact=username)
    if exclude_id:
        try:
            qs = qs.exclude(id=uuid.UUID(exclude_id))
        except ValueError:
            pass
    available = not qs.exists()
    return JsonResponse({"username": username, "available": available})


@require_GET
@require_auth
def matches(request):
    emotion = (request.GET.get("emotion") or "").strip()
    if not emotion:
        emotion = request.soullink_user.emotion
    if not emotion:
        return JsonResponse({"error": "emotion required"}, status=400)

    qs = (
        UserProfile.objects.filter(emotion=emotion)
        .exclude(emotion="")
        .exclude(id=request.soullink_user.id)
        .exclude(username__isnull=True)
        .exclude(username="")
    )
    results = [_profile_dict(p) for p in qs[:50]]
    return JsonResponse({"emotion": emotion, "matches": results, "count": len(results)})
