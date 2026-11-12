# Tiketux Go - Backend (Laravel + Filament)

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan make:filament-user
php artisan serve
```

Admin panel: http://127.0.0.1:8000/admin
API base: http://127.0.0.1:8000/api

Default admin after `make:filament-user`: use your created credentials.
Seeded users password: `password`.

## Database
SQLite (database/database.sqlite). No MySQL required.
