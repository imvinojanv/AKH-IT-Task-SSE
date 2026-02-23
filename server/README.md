# Product Explorer — Server

The robust backend API for the Product Explorer application built with **Laravel 12**. Features PostgreSQL optimization, advanced search aggregation facet computing, automated data seeding, and idempotent collection endpoints.

## Features

- Scalable, lightweight `GET /api/products` paginated filtering backend specifically configured for large database querying across Neon Postgres.
- Dedicated custom facet generators leveraging PostgreSQL aggregation to eliminate any N+1 loops.
- Integrated deterministic database data seeder: `php artisan products:generate`.
- Idempotent relational Saves endpoints processing (`/api/saved`), managed explicitly by tokenized payloads.

## Prerequisites

- PHP (v8.2+)
- Composer
- PostgreSQL DB Provider (e.g. Neon, AWS, locally running instance)

## Setup Instructions

1. **Install Dependencies:**

    ```bash
    composer install
    ```

2. **Configure Environment:**
   Copy the example environment securely.

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3. **Provide Database Credentials (.env):**
   Within your constructed `.env`, input a Postgres string:
    ```env
    DB_CONNECTION=pgsql
    DB_HOST=your-endpoint.aws.neon.tech
    DB_PORT=5432
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

## Database Migration & Seeding

The application ships natively with a highly advanced custom artisan data generator utilizing Laravel's `Faker` to establish accurate products including realistic SKU maps, accurate sizes mapping, and dynamic pricing algorithms.

```bash
# Formats migrations natively for PostgreSQL schemas, including unique constraints
php artisan migrate

# Seed directly via Laravel's system mapping calling our custom command explicitly
php artisan db:seed

# Equivalently, you can execute the command dynamically configuring varying sizes:
php artisan products:generate 300
```

## Running the Server

If utilizing Herd, Valet, or Sail, your domains map transparently (e.g., `http://server.test`). Alternatively, spawn PHP's native development command explicitly handling networking.

```bash
php artisan serve
# Ensure you configure your Frontend `vite.config.js` pointing towards `http://localhost:8000` or equivalent proxy binding paths if necessary.
```

## Core Endpoints

- **[GET] `/api/products`**: Extensible product catalog retrieval.
    - Queries: `search`, `brand[]`, `category[]`, `colour[]`, `in_stock`, `sort`, `page`, `per_page`
- **[GET] `/api/saved`**: Access saved lists via `X-User-Token` Headers.
- **[POST] `/api/saved`**: Save product (idempotency built-in)
- **[DELETE] `/api/saved/{product_id}`**: Discard product instances efficiently bypassing 404 Model Not Found exceptions natively.
