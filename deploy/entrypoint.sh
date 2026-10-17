#!/bin/sh
set -eu
mkdir -p /app/data
printf 'ADMIN_USERNAME=%s\nADMIN_PASSWORD_HASH=%s\nADMIN_SESSION_SECRET=%s\n' "$ADMIN_USERNAME" "$ADMIN_PASSWORD_HASH" "$ADMIN_SESSION_SECRET" > /app/dist/server/.dev.vars
chmod 600 /app/dist/server/.dev.vars
if [ ! -f /app/data/.migrated ]; then
  for file in /app/drizzle/[0-9]*.sql; do
    node /app/node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config /app/dist/server/wrangler.json --persist-to /app/data --file "$file"
  done
  touch /app/data/.migrated
fi
exec node /app/node_modules/wrangler/bin/wrangler.js dev --config /app/dist/server/wrangler.json --local --persist-to /app/data --ip 0.0.0.0 --port 8787 --inspector-port 0
