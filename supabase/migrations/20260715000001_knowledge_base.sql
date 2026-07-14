create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  content text not null,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.knowledge_base enable row level security;

do $$
begin
  create policy "knowledge_base_select_members"
    on public.knowledge_base
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "knowledge_base_insert_members"
    on public.knowledge_base
    for insert
    to authenticated
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "knowledge_base_update_members"
    on public.knowledge_base
    for update
    to authenticated
    using (business_id = any(public.user_business_ids()))
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "knowledge_base_delete_members"
    on public.knowledge_base
    for delete
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

grant select, insert, update, delete on public.knowledge_base to authenticated, service_role;
