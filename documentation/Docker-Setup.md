# 🐳 Local Development Setup Guide

Welcome to **Cosmodex**! This guide gets your local environment running in minutes.

> [!NOTE]
> The production database runs on **Neon PostgreSQL** (serverless). For local development you can either connect to the shared dev Neon branch, or spin up a local PostgreSQL instance via Docker.

---

## 📋 Prerequisites

- **Node.js** v20+ and **pnpm** installed
- **Docker Desktop** (only if running a local PostgreSQL container)

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy the env file and fill in your values
cp .env.example .env

# 3. Apply database migrations
pnpm prisma migrate dev

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Environment Configuration

Copy `.env.example` to `.env` and fill in the required values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon or local Docker) |
| `NEXTAUTH_URL` | Your app URL — `http://localhost:3000` for local dev |
| `NEXTAUTH_SECRET` | At least 32 random chars — generate with `openssl rand -base64 32` |
| `AUTH_SECRET` | Same as `NEXTAUTH_SECRET` (used by NextAuth v5 beta) |
| `AUTH_GITHUB_ID` | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |

> [!WARNING]
> Never commit your real `.env` file. It is already excluded by `.gitignore`. Only `.env.example` should be committed.

---

## 🐳 Running PostgreSQL Locally via Docker (Optional)

If you prefer a fully local database instead of connecting to Neon:

```bash
# Start a local PostgreSQL container
docker compose up -d

# Verify it's running
docker compose ps
```

Then set your `DATABASE_URL` in `.env` to:
```env
DATABASE_URL="postgresql://postgres:YourStrongLocalPassword2024@localhost:5432/postgres"
```

### Docker Commands

| Command | Purpose |
|---|---|
| `docker compose up -d` | Start PostgreSQL in the background |
| `docker compose down` | Stop (data is preserved) |
| `docker compose down -v` | ⚠️ Full reset — wipes all data |
| `docker compose ps` | View running containers |
| `docker logs cosmodex-db --tail 50` | View database logs |

> [!CAUTION]
> `docker compose down -v` permanently deletes your local database. Only use this when you want a completely clean slate.

---

## 🗄️ Database

**ORM:** Prisma with PostgreSQL

```bash
# Apply pending migrations
pnpm prisma migrate dev

# Open Prisma Studio (visual DB browser)
pnpm prisma studio

# Regenerate Prisma client after schema changes
pnpm prisma generate
```

---

## 🔧 Troubleshooting

### Database connection fails
- Check that `DATABASE_URL` in `.env` is correct
- If using Docker, make sure the container is running: `docker compose ps`

### OAuth login not working
- Ensure your GitHub / Google OAuth app callback URLs include `http://localhost:3000/api/auth/callback/github` (or `/google`)
- Verify `NEXTAUTH_URL=http://localhost:3000` in your `.env`

### Prisma client out of sync
```bash
pnpm prisma generate
```