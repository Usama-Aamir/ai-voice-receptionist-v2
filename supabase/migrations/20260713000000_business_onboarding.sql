create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Asia/Kuala_Lumpur',
  languages text[] not null default array['English']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

alter table public.businesses enable row level security;
alter table public.business_members enable row level security;

create or replace function public.user_business_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select business_id from public.business_members where user_id = auth.uid();
$$;

do $$
begin
  create policy "businesses_select_members"
    on public.businesses
    for select
    to authenticated
    using (id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "businesses_insert_first_owner"
    on public.businesses
    for insert
    to authenticated
    with check (true);
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_members_select_members"
    on public.business_members
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "business_members_insert_first_owner"
    on public.business_members
    for insert
    to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then
  null;
end $$;

grant select, insert, update, delete on public.businesses to authenticated, service_role;
grant select, insert, update, delete on public.business_members to authenticated, service_role;

grant usage on schema public to authenticated, service_role;
grant execute on function public.user_business_ids() to authenticated, service_role;
