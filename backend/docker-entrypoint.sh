#!/bin/sh
set -e

# Wait for Postgres when configured (compose healthcheck covers most cases)
if [ -n "$POSTGRES_HOST" ]; then
  echo "Waiting for Postgres at $POSTGRES_HOST:${POSTGRES_PORT:-5432}..."
  i=0
  while [ "$i" -lt 30 ]; do
    if python -c "
import os, socket
s = socket.socket()
s.settimeout(1)
try:
    s.connect((os.environ['POSTGRES_HOST'], int(os.environ.get('POSTGRES_PORT', '5432'))))
    s.close()
    raise SystemExit(0)
except OSError:
    raise SystemExit(1)
" 2>/dev/null; then
      break
    fi
    i=$((i + 1))
    sleep 1
  done
fi

python manage.py migrate --noinput
exec python manage.py runserver 0.0.0.0:8000
