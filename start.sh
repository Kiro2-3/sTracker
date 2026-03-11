#!/bin/sh
set -e

# Cache config, routes, views with the real env vars now available
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Start the server (php-fpm + nginx via s6)
exec /init
