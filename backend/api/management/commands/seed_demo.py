from django.core.management.base import BaseCommand

from api.models import UserProfile

# Presentation seed users — password for all: demo1234
DEMO_PASSWORD = "demo1234"

SEED_USERS = [
    # Presenter account (complete profile, calm — good for showing matches)
    {
        "email": "demo@soullink.app",
        "username": "SoulGuide",
        "emotion": "calm",
        "auth_method": "email",
    },
    # Happy
    {"email": "luna@demo.soullink", "username": "LunaWave", "emotion": "happy"},
    {"email": "jay@demo.soullink", "username": "Jaylight", "emotion": "happy"},
    {"email": "mira@demo.soullink", "username": "Mirathis", "emotion": "happy"},
    # Sad
    {"email": "noah@demo.soullink", "username": "QuietNoah", "emotion": "sad"},
    {"email": "erin@demo.soullink", "username": "SoftErin", "emotion": "sad"},
    # Anxious
    {"email": "kai@demo.soullink", "username": "KaiPulse", "emotion": "anxious"},
    {"email": "sage@demo.soullink", "username": "SageOver", "emotion": "anxious"},
    {"email": "rio@demo.soullink", "username": "RioStill", "emotion": "anxious"},
    # Calm
    {"email": "ava@demo.soullink", "username": "AvaBloom", "emotion": "calm"},
    {"email": "zen@demo.soullink", "username": "ZenNest", "emotion": "calm"},
    {"email": "ivy@demo.soullink", "username": "IvyQuiet", "emotion": "calm"},
    # Excited
    {"email": "leo@demo.soullink", "username": "LeoSpark", "emotion": "excited"},
    {"email": "nia@demo.soullink", "username": "NiaLift", "emotion": "excited"},
    # Lonely
    {"email": "ash@demo.soullink", "username": "AshAlone", "emotion": "lonely"},
    {"email": "bee@demo.soullink", "username": "BeeHaven", "emotion": "lonely"},
    {"email": "sky@demo.soullink", "username": "SkyDrift", "emotion": "lonely"},
    # Grateful
    {"email": "oma@demo.soullink", "username": "OmaThanks", "emotion": "grateful"},
    {"email": "fin@demo.soullink", "username": "FinGrace", "emotion": "grateful"},
    # Overwhelmed
    {"email": "max@demo.soullink", "username": "MaxTide", "emotion": "overwhelmed"},
    {"email": "rue@demo.soullink", "username": "RueCloud", "emotion": "overwhelmed"},
    {"email": "dot@demo.soullink", "username": "DotPause", "emotion": "overwhelmed"},
]


class Command(BaseCommand):
    help = "Seed demo users for presentations (password: demo1234)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush-demo",
            action="store_true",
            help="Remove existing @demo.soullink / demo@soullink.app users before seeding",
        )

    def handle(self, *args, **options):
        if options["flush_demo"]:
            deleted, _ = UserProfile.objects.filter(
                email__iendswith="@demo.soullink"
            ).delete()
            deleted2, _ = UserProfile.objects.filter(email="demo@soullink.app").delete()
            self.stdout.write(f"Removed {deleted + deleted2} previous demo users.")

        created = 0
        updated = 0
        for row in SEED_USERS:
            email = row["email"].lower()
            user, was_created = UserProfile.objects.get_or_create(
                email=email,
                defaults={
                    "username": row["username"],
                    "emotion": row["emotion"],
                    "auth_method": row.get("auth_method", "email"),
                },
            )
            user.username = row["username"]
            user.emotion = row["emotion"]
            user.auth_method = row.get("auth_method", "email")
            user.set_password(DEMO_PASSWORD)
            user.save()
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"Seed complete: {created} created, {updated} updated "
            f"({len(SEED_USERS)} total). Password for all: {DEMO_PASSWORD}"
        ))
        self.stdout.write(
            "Presenter login → email: demo@soullink.app  password: demo1234  "
            "(emotion: calm — open Connect to see calm matches)"
        )
