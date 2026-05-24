-- Migration: replace updates with events (for existing projects)
-- Run in Supabase SQL Editor after 001_initial.sql

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  venue text not null,
  location text not null,
  event_date timestamptz not null,
  ticket_url text,
  body text,
  image_url text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table events enable row level security;

create policy "Public read published events"
  on events for select
  using (is_published = true);

create policy "Authenticated full access events"
  on events for all
  to authenticated
  using (true)
  with check (true);

-- Optional: drop old updates table if you no longer need it
-- drop table if exists updates cascade;
