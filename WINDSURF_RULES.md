# Project rules — AI Voice Receptionist

These rules exist because we hit these exact bugs before. Follow them on every new table/migration without exception.

## Database / Supabase rules

1. **Never write `auth.<function_name>()` for custom helper functions.** The `auth` schema is locked down by Supabase — `CREATE FUNCTION` inside it fails with `permission denied for schema auth`. All custom RLS helper functions (e.g. `user_business_ids()`, `user_role_in_business()`) must live in the `public` schema and be called as `public.function_name()`.

2. **Every new table needs explicit GRANT statements, in addition to RLS policies.** RLS policies alone are not enough — Postgres checks table-level privileges BEFORE it evaluates any RLS policy. Without a GRANT, queries either fail with `permission denied for table X`, or (worse) silently return zero rows with no error at all, which looks like a bug in the app code instead of the database.

   Every migration that creates a table must end with:
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON public.<table_name> TO authenticated, service_role;
   ```

3. **Multi-tenant tables must scope RLS by `business_id`** using `business_id = ANY(public.user_business_ids())`, matching the pattern already used in `businesses`, `business_members`, and `customers`.

4. **New user-owned resources need an insert policy that handles the "first row" case** if applicable (see `business_members_insert_first_owner` for the pattern) — don't assume the user is already a member/owner of something when they're creating it for the first time.

5. **Server actions that need to bypass RLS** (e.g. system-level operations) use `createAdminClient()` from `@/lib/supabase/admin` — but this does NOT replace the GRANT requirement above. Even the admin/service_role client is blocked by missing table grants.

6. **Regular user-facing reads/writes** use `createClient()` from `@/lib/supabase/server` — this respects RLS and cookies, and is the default choice unless there's a specific reason to bypass RLS.

## Environment / setup rules

7. `.env.local` must be named exactly that — no `.txt` extension. Verify with `dir` in cmd, not File Explorer (which can hide extensions).

8. `NEXT_PUBLIC_SUPABASE_URL` must be the bare project URL only: `https://xxxxx.supabase.co` — no `/rest/v1/` or other path suffix.

## Debugging rules

9. When any server action silently fails, always `console.error()` the actual error object before redirecting — never redirect on error without logging first. Silent failures waste debugging time.

10. Before running any new migration, check what's already in the database (Table Editor + `pg_policies`) rather than assuming — partial previous runs can leave tables/policies in an inconsistent state.
