#!/bin/bash
set -e

# Fail early with a clearer message when MySQL host resolution is broken.
php <<'PHP'
<?php
$connection = getenv('DB_CONNECTION') ?: 'sqlite';
$host = getenv('DB_HOST') ?: '';
$dbUrl = getenv('DB_URL') ?: getenv('DATABASE_URL') ?: '';

if ($connection !== 'mysql' && $connection !== 'mariadb') {
	exit(0);
}

if ($dbUrl !== '') {
	$parts = parse_url($dbUrl);
	if (is_array($parts) && ! empty($parts['host'])) {
		$host = $parts['host'];
	}
}

if ($host === '') {
	fwrite(STDERR, "Database startup check failed: no MySQL host was provided. Set DB_HOST or DATABASE_URL/DB_URL.\n");
	exit(1);
}

$resolved = gethostbyname($host);

if ($resolved === $host && filter_var($host, FILTER_VALIDATE_IP) === false) {
	fwrite(STDERR, "Database startup check failed: unable to resolve MySQL host '{$host}'. Verify your Render env vars and Aiven hostname.\n");
	exit(1);
}
PHP

# Run Laravel setup
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Create supervisor log directory
mkdir -p /var/log/supervisor

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
