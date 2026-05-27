DO $$ BEGIN

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres SUPERUSER LOGIN PASSWORD 'C0sm0dexSecurePass2026';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'C0sm0dexSecurePass2026';
  ELSE
    ALTER ROLE authenticator WITH PASSWORD 'C0sm0dexSecurePass2026';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin NOINHERIT CREATEROLE LOGIN PASSWORD 'C0sm0dexSecurePass2026';
  ELSE
    ALTER ROLE supabase_auth_admin WITH PASSWORD 'C0sm0dexSecurePass2026';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_storage_admin') THEN
    CREATE ROLE supabase_storage_admin NOINHERIT CREATEROLE LOGIN PASSWORD 'C0sm0dexSecurePass2026';
  ELSE
    ALTER ROLE supabase_storage_admin WITH PASSWORD 'C0sm0dexSecurePass2026';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_realtime_admin') THEN
    CREATE ROLE supabase_realtime_admin NOINHERIT LOGIN PASSWORD 'C0sm0dexSecurePass2026';
  END IF;

END $$;

GRANT anon              TO authenticator;
GRANT authenticated     TO authenticator;
GRANT service_role      TO authenticator;
GRANT supabase_admin    TO authenticator;
GRANT supabase_admin    TO postgres;
GRANT supabase_auth_admin    TO supabase_admin;
GRANT supabase_storage_admin TO supabase_admin;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS _realtime;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE SCHEMA IF NOT EXISTS graphql_public;
CREATE SCHEMA IF NOT EXISTS pgbouncer;

ALTER SCHEMA auth    OWNER TO supabase_auth_admin;
ALTER SCHEMA storage OWNER TO supabase_storage_admin;

GRANT ALL PRIVILEGES ON SCHEMA public     TO postgres, supabase_admin, supabase_auth_admin, supabase_storage_admin, authenticator, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON SCHEMA auth       TO supabase_auth_admin, supabase_admin, postgres;
GRANT ALL PRIVILEGES ON SCHEMA storage    TO supabase_storage_admin, supabase_admin, postgres;
GRANT ALL PRIVILEGES ON SCHEMA _realtime  TO supabase_admin, postgres;
GRANT ALL PRIVILEGES ON SCHEMA extensions TO supabase_admin, postgres;
GRANT USAGE          ON SCHEMA public     TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public    GRANT ALL ON TABLES    TO postgres, supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public    GRANT ALL ON SEQUENCES  TO postgres, supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth      GRANT ALL ON TABLES    TO supabase_auth_admin, supabase_admin, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA storage   GRANT ALL ON TABLES    TO supabase_storage_admin, supabase_admin, postgres;