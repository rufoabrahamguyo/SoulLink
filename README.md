# SoulLink

SoulLink is a mobile app for connecting with others through **emotions**, not identity. Choose how you feel, pick a username, and match with people who share the same emotional state — privately and anonymously.

**Tagline:** *Connect Through Emotions, Not Identity*

## Features

- Email sign-up / sign-in (stored in Postgres)
- Optional Google and Apple Sign-In (identity verified, user stored in Postgres)
- Anonymous usernames (identity stays private)
- Emotion selection (happy, calm, lonely, and more)
- Match with others who share your current emotion

## Stack

| Layer | Tech |
|--------|------|
| Mobile | React Native / Expo (SDK 55) |
| Auth + data | Django API + PostgreSQL (JWT sessions) |
| Local API fallback | Django + SQLite |
| Workspace | npm workspaces (`frontend/` + `backend/`) |

## Prerequisites

- **Node.js** (with npm)
- **Docker** (recommended for the API + Postgres)
- **Python 3** (only if you run the API without Docker)
- **Xcode** (iOS) and/or **Android Studio** (Android)
- Optional: **Google OAuth** clients if you use Continue with Google

> **Important:** Google Sign-In needs a **development build**. Expo Go will not work for this app.

## Setup

From the repo root:

```bash
npm install
```

If you run the API **without** Docker:

```bash
python3 -m pip install -r backend/requirements.txt
npm run api:migrate
```

### Environment variables

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | Django API base URL (Docker: `http://localhost:8003`) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth web client (optional) |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS client (optional) |

## Run

Use two terminals.

### 1. Backend API

**Docker (recommended) — Django + PostgreSQL:**

```bash
npm run api:docker
# or: docker compose up --build
```

Starts:
- **Postgres** on host port `5432` (user/db/password: `soullink`)
- **Django API** on host port `8003`

Stop with `Ctrl+C`, or `npm run api:docker:down`. Logs: `npm run api:docker:logs`.

Health check: [http://localhost:8003/api/health/](http://localhost:8003/api/health/)

### Demo seed data (presentations)

With Docker API running:

```bash
npm run api:seed
```

Creates ~20 users across all emotions. **Presenter account:**

| Field | Value |
|-------|-------|
| Email | `demo@soullink.app` |
| Password | `demo1234` |
| Username | `SoulGuide` |
| Emotion | `calm` |

### Presenter walkthrough

1. `npm run api:docker` then `npm run api:seed`
2. Sign in as `demo@soullink.app` / `demo1234`
3. Tabs: **Emotion** · **Spaces** (try Collective Healing) · **Matches** (tap a calm user for chat) · **Capsules** · **Profile** (bell → Notifications)

If you change the database schema, reset volumes once:

```bash
docker compose down -v
npm run api:docker
```

**Local Python (alternative — SQLite):**

```bash
npm run api
```

Serves at `http://0.0.0.0:8000` using a local `backend/db.sqlite3` file.

### 2. Mobile app (first time — build the native app)

```bash
# Android emulator
npm run android

# iOS simulator
npm run ios
```

### 3. Metro (later sessions)

```bash
npm run start
```

Open the **SoulLink** app — not Expo Go.

## Auth API

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register/` | Email + password → JWT |
| `POST /api/auth/login/` | Email + password → JWT |
| `POST /api/auth/google/` | Google `id_token` → JWT |
| `POST /api/auth/apple/` | Apple `identity_token` → JWT |
| `GET /api/auth/me/` | Current user (Bearer token) |

## API URL by platform

Set `EXPO_PUBLIC_API_URL` to `http://localhost:8003` when using Docker. On Android, the app rewrites `localhost` → `10.0.2.2` automatically.

| Platform | Example |
|----------|---------|
| iOS simulator / web | `http://localhost:8003` |
| Android emulator | `http://10.0.2.2:8003` (auto from localhost) |
| Physical device | Your Mac’s LAN IP, e.g. `http://192.168.1.42:8003` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run api:docker` | Start Django + Postgres (API on port 8003) |
| `npm run api:docker:down` | Stop Docker services |
| `npm run api:docker:logs` | Follow API + DB logs |
| `npm run api` | Start Django locally with SQLite (port 8000) |
| `npm run api:seed` | Seed demo users for presentations |
| `npm run api:seed:reset` | Wipe prior demo users, then re-seed |
| `npm run start` | Start Expo Metro (dev client) |
| `npm run android` | Build & run Android |
| `npm run ios` | Build & run iOS |
| `npm run web` | Start web (limited; no native Google Sign-In) |
| `npm run android:signing` | Print Android SHA-1 for Google Cloud OAuth |

## Project layout

```
SoulLink/
├── frontend/              # Expo / React Native app
├── backend/               # Django API (auth + profiles)
│   ├── Dockerfile
│   └── docker-entrypoint.sh
├── docker-compose.yml     # api + Postgres
├── patches/               # patch-package fixes (Gradle)
├── package.json           # Workspace scripts
└── README.md
```

## Google Sign-In notes

- Optional; email auth works without Google.
- Build with `npm run android` / `npm run ios` so `RNGoogleSignin` is in the native binary.
- **Android `DEVELOPER_ERROR`:** add package `com.rufoabrahamguyo.soullink` + debug SHA-1 (`npm run android:signing`) in Google Cloud.
- Google returns an ID token; Django verifies it and creates/updates the Postgres user.

## Store release

See [`frontend/LAUNCH_CHECKLIST.md`](frontend/LAUNCH_CHECKLIST.md) for Google Play / App Store and EAS steps.
