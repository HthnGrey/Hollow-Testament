-- Hollow Testament — initial schema
-- Run in Supabase SQL Editor or via Supabase CLI

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_headline text,
  hero_subheadline text,
  about_short text,
  about_long text,
  featured_release_title text,
  featured_release_cover_url text,
  featured_release_spotify_url text,
  featured_release_youtube_url text,
  featured_youtube_url text,
  spotify_embed_url text,
  youtube_channel_url text,
  instagram_url text,
  tumblr_url text,
  x_url text,
  contact_email text default 'hollowtestament@gmail.com',
  updated_at timestamptz default now()
);

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

-- Seed default settings row
insert into site_settings (
  hero_headline,
  hero_subheadline,
  about_short,
  about_long,
  featured_release_title,
  instagram_url,
  tumblr_url,
  x_url,
  contact_email
) values (
  'Hollow Testament',
  'Music that feels like a conversation, not a performance.',
  'Indie alt rock built on raw emotion, movement, and honesty — songs for anyone trying to make it through another day.',
  'Hollow Testament is a band built around connection, the kind that happens when a song says the thing you''ve been carrying but never knew how to put into words. Through raw emotion, movement, and honesty, we''re trying to create music that feels like a conversation instead of a performance. For anyone struggling, stuck in cycles, grieving, healing, or just trying to make it through another day, these songs are meant to remind you that you are not alone.',
  'Latest Release',
  'https://www.instagram.com/hollow.testament/',
  'https://www.tumblr.com/hollowtestament',
  'https://x.com/hollowtestament',
  'hollowtestament@gmail.com'
) on conflict do nothing;

alter table site_settings enable row level security;
alter table events enable row level security;

create policy "Public read site_settings"
  on site_settings for select
  using (true);

create policy "Authenticated write site_settings"
  on site_settings for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated insert site_settings"
  on site_settings for insert
  to authenticated
  with check (true);

create policy "Public read published events"
  on events for select
  using (is_published = true);

create policy "Authenticated full access events"
  on events for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for media (run in Storage UI or):
-- insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Authenticated update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "Authenticated delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
