from django.contrib import admin

from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "emotion", "auth_method", "created_at")
    search_fields = ("username", "email", "google_id", "apple_id")
