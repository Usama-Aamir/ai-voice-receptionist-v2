create table if not exists public.business_invites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'staff')),
  invited_by uuid not null references auth.users(id) on delete cascade,
  accepted boolean not null default false,
  created_at timestamptz not null default now(),
  unique (business_id, email)
);

alter table public.business_invites enable row level security;

do $$
begin
  create policy "business_invites_select_members"
    on public.business_invites
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_invites_insert_members"
    on public.business_invites
    for insert
    to authenticated
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_invites_update_members"
    on public.business_invites
    for update
    to authenticated
    using (business_id = any(public.user_business_ids()))
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_invites_delete_members"
    on public.business_invites
    for delete
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

grant select, insert, update, delete on public.business_invites to authenticated, service_role;
