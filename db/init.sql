-- Active: 1779401998655@@127.0.0.1@5432@nca_cargo
DO $$
BEGIN
	IF current_database() <> 'nca_cargo' THEN
		RAISE EXCEPTION 'This script must run on nca_cargo, current db is %', current_database();
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nca_cargo_user') THEN
		CREATE ROLE nca_cargo_user LOGIN PASSWORD '{{DB_PASSWORD}}';
	END IF;
END $$;

GRANT CONNECT ON DATABASE nca_cargo TO nca_cargo_user;
GRANT TEMPORARY ON DATABASE nca_cargo TO nca_cargo_user;
GRANT USAGE ON SCHEMA public TO nca_cargo_user;
GRANT CREATE ON SCHEMA public TO nca_cargo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nca_cargo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nca_cargo_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO nca_cargo_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO nca_cargo_user;

SELECT usename, usesuper, usecreatedb, valuntil
FROM pg_user;
