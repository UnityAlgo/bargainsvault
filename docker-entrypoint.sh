#!/bin/sh
set -e

echo "==> Running database migrations..."
node migrate.mjs

echo "==> Starting Next.js server..."
exec node_modules/.bin/next start
