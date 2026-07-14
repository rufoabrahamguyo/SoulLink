from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("auth/register/", views.register, name="auth_register"),
    path("auth/login/", views.login, name="auth_login"),
    path("auth/google/", views.google_auth, name="auth_google"),
    path("auth/apple/", views.apple_auth, name="auth_apple"),
    path("auth/me/", views.me, name="auth_me"),
    path("profile/", views.profile, name="profile"),
    path("username/available/", views.username_available, name="username_available"),
    path("matches/", views.matches, name="matches"),
]
