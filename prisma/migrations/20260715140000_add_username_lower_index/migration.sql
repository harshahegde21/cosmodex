-- Migration: Add case-insensitive username index for performant ILIKE lookups
-- This powers the Prisma `mode: 'insensitive'` queries used in:
--   - check-username route
--   - register route (duplicate username check)
--   - user/profile PATCH (username conflict check)
--
-- Without this index, every username availability check performs a full
-- sequential scan (O(n)) on the users table. This index converts it to O(log n).

CREATE INDEX CONCURRENTLY IF NOT EXISTS users_username_lower_idx
ON users (lower(username));
