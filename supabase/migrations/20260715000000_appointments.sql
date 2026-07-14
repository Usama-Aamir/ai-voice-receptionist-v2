create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  service_name text,
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes int not null default 30,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

do $$
begin
  create policy "appointments_select_members"
    on public.appointments
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "appointments_insert_members"
    on public.appointments
    for insert
    to authenticated
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "appointments_update_members"
    on public.appointments
    for update
    to authenticated
    using (business_id = any(public.user_business_ids()))
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "appointments_delete_members"
    on public.appointments
    for delete
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

grant select, insert, update, delete on public.appointments to authenticated, service_role;
