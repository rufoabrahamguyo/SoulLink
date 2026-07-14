import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("email", models.EmailField(blank=True, db_index=True, default="", max_length=254)),
                ("password", models.CharField(blank=True, default="", max_length=128)),
                (
                    "google_id",
                    models.CharField(blank=True, db_index=True, default="", max_length=128),
                ),
                (
                    "apple_id",
                    models.CharField(blank=True, db_index=True, default="", max_length=128),
                ),
                (
                    "username",
                    models.CharField(blank=True, max_length=50, null=True, unique=True),
                ),
                ("auth_method", models.CharField(default="email", max_length=20)),
                ("emotion", models.CharField(blank=True, default="", max_length=30)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="userprofile",
            constraint=models.UniqueConstraint(
                condition=models.Q(("email", ""), _negated=True),
                fields=("email",),
                name="unique_nonempty_email",
            ),
        ),
        migrations.AddConstraint(
            model_name="userprofile",
            constraint=models.UniqueConstraint(
                condition=models.Q(("google_id", ""), _negated=True),
                fields=("google_id",),
                name="unique_nonempty_google_id",
            ),
        ),
        migrations.AddConstraint(
            model_name="userprofile",
            constraint=models.UniqueConstraint(
                condition=models.Q(("apple_id", ""), _negated=True),
                fields=("apple_id",),
                name="unique_nonempty_apple_id",
            ),
        ),
    ]
