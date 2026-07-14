import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.db import models
from django.db.models import Q


class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(blank=True, default="", db_index=True)
    password = models.CharField(max_length=128, blank=True, default="")
    google_id = models.CharField(max_length=128, blank=True, default="", db_index=True)
    apple_id = models.CharField(max_length=128, blank=True, default="", db_index=True)
    username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    auth_method = models.CharField(max_length=20, default="email")
    emotion = models.CharField(max_length=30, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                condition=~Q(email=""),
                name="unique_nonempty_email",
            ),
            models.UniqueConstraint(
                fields=["google_id"],
                condition=~Q(google_id=""),
                name="unique_nonempty_google_id",
            ),
            models.UniqueConstraint(
                fields=["apple_id"],
                condition=~Q(apple_id=""),
                name="unique_nonempty_apple_id",
            ),
        ]

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        if not self.password:
            return False
        return check_password(raw_password, self.password)

    def __str__(self) -> str:
        return self.username or self.email or str(self.id)
