create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text,
  messages jsonb not null default '[]'::jsonb,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

do $$
begin
  create policy "conversations_select_members"
    on public.conversations
    for select
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "conversations_insert_members"
    on public.conversations
    for insert
    to authenticated
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "conversations_update_members"
    on public.conversations
    for update
    to authenticated
    using (business_id = any(public.user_business_ids()))
    with check (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

do $$
begin
  create policy "conversations_delete_members"
    on public.conversations
    for delete
    to authenticated
    using (business_id = any(public.user_business_ids()));
exception when duplicate_object then
  null;
end $$;

grant select, insert, update, delete on public.conversations to authenticated, service_role;
