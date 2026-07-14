alter table public.businesses
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists address text,
  add column if not exists website text;
