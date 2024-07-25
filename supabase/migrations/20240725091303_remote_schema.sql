
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."Role" AS ENUM (
    'USER',
    'ADMIN',
    'HOLDER',
    'SUPER_ADMIN'
);

ALTER TYPE "public"."Role" OWNER TO "postgres";

CREATE TYPE "public"."Status" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

ALTER TYPE "public"."Status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_delete_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  delete from public.user where id = old.id;
  return old;
end;
$$;

ALTER FUNCTION "public"."handle_delete_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.user (id, email, password, title, first_name, last_name)
  values (new.id, new.email, new.encrypted_password, new.raw_user_meta_data ->> 'title', new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.status = 'APPROVED' THEN
    UPDATE public.account
    SET balance = balance + NEW.amount
    WHERE id = NEW.account_id;
  END IF;
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_balance"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."account" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "balance" numeric NOT NULL,
    "currency_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "remark" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "name" "text" NOT NULL
);

ALTER TABLE "public"."account" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."currency" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "symbol" "text" NOT NULL
);

ALTER TABLE "public"."currency" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."donator" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "title" "text" NOT NULL,
    "village" "text",
    "district" "text",
    "province" "text"
);

ALTER TABLE "public"."donator" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."expense" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "amount" numeric NOT NULL,
    "remark" "text",
    "status" "public"."Status" DEFAULT 'PENDING'::"public"."Status" NOT NULL,
    "image" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "category_id" "uuid" NOT NULL,
    "currency_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "account_id" "uuid" NOT NULL,
    "drawer_id" "uuid" NOT NULL
);

ALTER TABLE "public"."expense" OWNER TO "postgres";

COMMENT ON COLUMN "public"."expense"."drawer_id" IS 'ຜູ້ເບີກຈ່າຍ';

CREATE TABLE IF NOT EXISTS "public"."expense_category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."expense_category" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."income" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "amount" numeric NOT NULL,
    "category_id" "uuid" NOT NULL,
    "donator_id" "uuid",
    "remark" "text",
    "status" "public"."Status" DEFAULT 'PENDING'::"public"."Status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "currency_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "account_id" "uuid" NOT NULL
);

ALTER TABLE "public"."income" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."income_category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."income_category" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "public"."Role" DEFAULT 'USER'::"public"."Role" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "password" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "image" "text",
    "updated_at" timestamp with time zone,
    "title" "text" NOT NULL
);

ALTER TABLE "public"."user" OWNER TO "postgres";

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."currency"
    ADD CONSTRAINT "currency_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."donator"
    ADD CONSTRAINT "donator_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."expense_category"
    ADD CONSTRAINT "expense_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "expense_pkey1" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."income_category"
    ADD CONSTRAINT "income_category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "income_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "update_expense_trigger" AFTER UPDATE ON "public"."expense" FOR EACH ROW EXECUTE FUNCTION "public"."update_balance"();

CREATE OR REPLACE TRIGGER "update_income_trigger" AFTER UPDATE ON "public"."income" FOR EACH ROW EXECUTE FUNCTION "public"."update_balance"();

ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "public_account_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "public_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "public_expense_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "public_expense_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."expense_category"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "public_expense_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "public_expense_drawer_id_fkey" FOREIGN KEY ("drawer_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "public_expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "public_income_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "public_income_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."income_category"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "public_income_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currency"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "public_income_donator_id_fkey" FOREIGN KEY ("donator_id") REFERENCES "public"."donator"("id");

ALTER TABLE ONLY "public"."income"
    ADD CONSTRAINT "public_income_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE POLICY "Enable read access for all users" ON "public"."user" FOR SELECT USING (true);

ALTER TABLE "public"."account" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."currency" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."donator" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."expense" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."expense_category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."income" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."income_category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."account";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_balance"() TO "service_role";

GRANT ALL ON TABLE "public"."account" TO "anon";
GRANT ALL ON TABLE "public"."account" TO "authenticated";
GRANT ALL ON TABLE "public"."account" TO "service_role";

GRANT ALL ON TABLE "public"."currency" TO "anon";
GRANT ALL ON TABLE "public"."currency" TO "authenticated";
GRANT ALL ON TABLE "public"."currency" TO "service_role";

GRANT ALL ON TABLE "public"."donator" TO "anon";
GRANT ALL ON TABLE "public"."donator" TO "authenticated";
GRANT ALL ON TABLE "public"."donator" TO "service_role";

GRANT ALL ON TABLE "public"."expense" TO "anon";
GRANT ALL ON TABLE "public"."expense" TO "authenticated";
GRANT ALL ON TABLE "public"."expense" TO "service_role";

GRANT ALL ON TABLE "public"."expense_category" TO "anon";
GRANT ALL ON TABLE "public"."expense_category" TO "authenticated";
GRANT ALL ON TABLE "public"."expense_category" TO "service_role";

GRANT ALL ON TABLE "public"."income" TO "anon";
GRANT ALL ON TABLE "public"."income" TO "authenticated";
GRANT ALL ON TABLE "public"."income" TO "service_role";

GRANT ALL ON TABLE "public"."income_category" TO "anon";
GRANT ALL ON TABLE "public"."income_category" TO "authenticated";
GRANT ALL ON TABLE "public"."income_category" TO "service_role";

GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
