create table if not exists public.business_closures (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  closure_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (business_id, closure_date)
);

alter table public.business_closures enable row level security;

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
  create policy "business_closures_update_members"
    on public.business_closures
    for update
    to authenticated
    using (business_id = any(public.user_business_ids()))
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

grant select, insert, update, delete on public.business_closures to authenticated, service_role;
