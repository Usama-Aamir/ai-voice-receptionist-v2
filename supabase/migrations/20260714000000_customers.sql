create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  notes text,
  interested_service text,
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'completed', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;

do $$
begin
  create policy "customers_select_members"
    on public.customers
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "customers_insert_members"
    on public.customers
    for insert
    to authenticated
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "customers_update_members"
    on public.customers
    for update
    to authenticated
    using (business_id = any(public.user_business_ids()))
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "customers_delete_members"
    on public.customers
    for delete
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

grant select, insert, update, delete on public.customers to authenticated, service_role;
