# ─── Stage 1: Build frontend assets ───────────────────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Production image ────────────────────────────────────────────────
FROM serversideup/php:8.3-fpm-nginx

USER root

# Copy application files
COPY --chown=www-data:www-data . /var/www/html

# Copy compiled frontend assets from stage 1
COPY --from=frontend --chown=www-data:www-data /app/public/build /var/www/html/public/build

WORKDIR /var/www/html

# Install PHP dependencies (no dev packages in production)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Storage & cache directories
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Create the storage symlink (public/storage -> storage/app/public)
RUN php artisan storage:link

# Startup script (runs migrations + caching at container start with real env vars)
COPY start.sh /start.sh
RUN chmod +x /start.sh

ENV APP_ENV=production
ENV LOG_CHANNEL=stderr

CMD ["/start.sh"]
