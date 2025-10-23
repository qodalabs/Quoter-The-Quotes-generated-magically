-- Quotes table and RLS for Quoter

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quote_text text not null,
  author text not null,
  topic text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

-- Allow users to view their own quotes
create policy if not exists "Users can view own quotes or published"
on public.quotes for select
using (auth.uid() = user_id or published = true);

-- Allow users to insert their own quotes
create policy if not exists "Users can insert own quotes"
on public.quotes for insert
with check (auth.uid() = user_id);

-- Allow users to update their own quotes (for publishing)
create policy if not exists "Users can update own quotes"
on public.quotes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Helpful index for listing
create index if not exists quotes_user_created_idx on public.quotes(user_id, created_at desc);

-- Basic profiles table for user display names and bios
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table public.profiles enable row level security;

-- Everyone can read profiles (for showing names on public items)
create policy if not exists "Profiles are readable by all"
on public.profiles for select
using (true);

-- Users can insert their own profile
create policy if not exists "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = user_id);

-- Users can update their own profile
create policy if not exists "Users can update own profile"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
