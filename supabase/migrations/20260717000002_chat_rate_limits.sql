create table if not exists public.chat_rate_limits (
  identifier text primary key,
  request_count int not null default 1,
  window_start timestamptz not null default now(),
  last_message text,
  last_message_at timestamptz,
  last_message_count int not null default 0
);

-- No RLS needed: this table is only accessed via the service role from the chat API.
grant select, insert, update, delete on public.chat_rate_limits to service_role;
