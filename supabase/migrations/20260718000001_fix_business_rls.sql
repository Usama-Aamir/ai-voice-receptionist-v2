-- Fix missing RLS policies and columns so business profile and hours save correctly.

-- Ensure businesses has all columns the app reads/writes
alter table public.businesses
  add column if not exists slug text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists address text,
  add column if not exists website text;

-- Businesses: members may update/delete businesses they belong to
do $$
begin
  create policy "businesses_update_members"
    on public.businesses
    for update
    to authenticated
    using (id = any(public.user_business_ids()))
    with check (id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "businesses_delete_members"
    on public.businesses
    for delete
    to authenticated
    using (id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

-- Business closures: members may manage closures for their businesses
-- (Some deployments may be missing these policies entirely.)
do $$
begin
  create policy "business_closures_select_members"
    on public.business_closures
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_closures_insert_members"
    on public.business_closures
    for insert
    to authenticated
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_closures_delete_members"
    on public.business_closures
    for delete
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

grant select, insert, delete on public.business_closures to authenticated, service_role;
