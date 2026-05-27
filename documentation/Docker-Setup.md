# 🐳 Local Infrastructure Setup Guide

Welcome to **Cosmodex**! This guide will get your local development infrastructure running in minutes. We use a fully containerized **Supabase + Redis** stack so every developer has the exact same environment.

**No manual database installation required.** Everything runs inside Docker.

---

## 📋 Prerequisites

You only need **one** tool installed before you begin:

- **Mac/Windows:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux:** [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose Plugin](https://docs.docker.com/compose/install/)

> [!IMPORTANT]
> Make sure Docker Desktop is **open and running** in the background before running any commands below.

---

## ⚡ Quick Start (3 steps)

**Mac / Linux:**
```bash
# 1. Copy the example environment file
cp .env.example .env

# 2. Start all services in the background
docker compose up -d

# 3. Wait ~30 seconds, then verify everything is running
docker compose ps
```

**Windows (PowerShell):**
```powershell
# 1. Copy the example environment file
Copy-Item .env.example .env

# 2. Start all services in the background
docker compose up -d

# 3. Wait ~30 seconds, then verify everything is running
docker compose ps
```

That's it. All services will be running automatically.

---

## 🔐 Environment Configuration

The entire stack is configured via a single `.env` file in the project root.

`.env.example` is committed to the repository and contains **pre-filled safe local defaults** — you do not need to change anything to get started locally.

### Key variables explained:

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_PASSWORD` | Database password | `YourStrongLocalPassword2024` |
| `JWT_SECRET` | Secret used to sign all JWT tokens | `super-secret-jwt-token...` |
| `ANON_KEY` | Public API key for browser clients | Pre-filled local JWT |
| `SERVICE_ROLE_KEY` | Private key for server-side code only | Pre-filled local JWT |
| `DASHBOARD_USERNAME` | Kong dashboard login username | `supabase` |
| `DASHBOARD_PASSWORD` | Kong dashboard login password | `supabase` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `NEXT_PUBLIC_SUPABASE_URL` | API URL for use in your app | `http://localhost:8000` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key for use in your app | Same as `ANON_KEY` |

> [!WARNING]
> Never commit your real `.env` file. It is already excluded by `.gitignore`. Only `.env.example` should be committed.

---

## 🚀 Managing the Stack

### Start services
```bash
docker compose up -d
```

### Stop services (data is preserved)
```bash
docker compose down
```

### View running containers
```bash
docker compose ps
```

### View logs for a specific service
```bash
docker logs supabase-auth --tail 50
docker logs supabase-db --tail 50
```

### Full reset (wipes ALL data and starts fresh)
```bash
docker compose down -v
docker compose up -d
```

> [!CAUTION]
> `docker compose down -v` permanently deletes your local database. Only use this when you want a completely clean slate.

---

## 🌐 Service Access Endpoints

Once containers are running, the following are available:

### 📊 Supabase Studio Dashboard
Visual interface to manage tables, run SQL queries, inspect auth users, and browse storage.

| Access Method | URL | Credentials |
|---|---|---|
| **Via API Gateway** (recommended) | [http://localhost:8000](http://localhost:8000) | `supabase` / `supabase` |
| **Direct** (no login required) | [http://localhost:3000](http://localhost:3000) | — |

> The API Gateway link (`localhost:8000`) shows a browser login prompt — enter `supabase` / `supabase`.

### 🔌 API Gateway (Kong)
All application API calls go through Kong on port `8000`. Use these values in your code:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=<value from your .env>
```

### 🗄️ PostgreSQL Database
Direct database access (e.g. for GUI tools like TablePlus or DBeaver):

| Setting | Value |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `postgres` |
| Username | `supabase_admin` |
| Password | Value of `POSTGRES_PASSWORD` in your `.env` |

### ⚡ Redis Cache
```env
REDIS_URL=redis://localhost:6379
```

**Test it from your terminal:**
```bash
docker exec local-redis redis-cli ping
# Expected output: PONG
```

---

## 🧱 Services Overview

| Container | Image | Port | Purpose |
|---|---|---|---|
| `supabase-db` | `supabase/postgres` | `5432` | PostgreSQL database |
| `supabase-auth` | `supabase/gotrue` | `9999` (internal) | Authentication (sign up, login, JWT) |
| `supabase-rest` | `postgrest/postgrest` | `3000` (internal) | Auto-generated REST API from DB schema |
| `supabase-realtime` | `supabase/realtime` | `4000` (internal) | WebSocket subscriptions |
| `supabase-storage` | `supabase/storage-api` | `5000` (internal) | File storage API |
| `supabase-meta` | `supabase/postgres-meta` | `8080` (internal) | DB introspection |
| `supabase-kong` | `kong/kong` | `8000`, `8443` | API Gateway — single entry point |
| `supabase-studio` | `supabase/studio` | `3000` | Dashboard UI |
| `local-redis` | `redis:7-alpine` | `6379` | Cache / session store |

---

## 🔧 Troubleshooting

### A container keeps restarting
Check its logs to find the error:
```bash
docker logs <container-name> --tail 30
```

### I need a completely fresh database
```bash
docker compose down -v   # wipes all volumes
docker compose up -d     # re-initializes from scratch
```

### Port conflict (something already uses port 8000 or 5432)
Edit the port mappings in `.env`:
```env
KONG_HTTP_PORT=8100    # change from 8000
POSTGRES_PORT=5433     # change from 5432
```

### Check all container statuses at once
```bash
docker compose ps
```
All containers should show `Up` or `Up (healthy)`.