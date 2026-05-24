-- Repair migration for projects where public.site_settings was not created.
-- Safe to run more than once in the Supabase SQL Editor.

create table if not exists public.site_settings (
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
  featured_youtube_embeds jsonb not null default '[]'::jsonb,
  spotify_embed_url text,
  youtube_channel_url text,
  instagram_url text,
  tumblr_url text,
  x_url text,
  contact_email text default 'hollowtestament@gmail.com',
  updated_at timestamptz default now()
);

alter table public.site_settings
  add column if not exists featured_youtube_embeds jsonb not null default '[]'::jsonb;

alter table public.site_settings
  drop column if exists contact_phone;

insert into public.site_settings (
  hero_headline,
  hero_subheadline,
  about_short,
  about_long,
  featured_release_title,
  instagram_url,
  tumblr_url,
  x_url,
  contact_email
)
select
  'Hollow Testament',
  'Music that feels like a conversation, not a performance.',
  'Indie alt rock built on raw emotion, movement, and honesty - songs for anyone trying to make it through another day.',
  'Hollow Testament is a band built around connection, the kind that happens when a song says the thing you''ve been carrying but never knew how to put into words. Through raw emotion, movement, and honesty, we''re trying to create music that feels like a conversation instead of a performance. For anyone struggling, stuck in cycles, grieving, healing, or just trying to make it through another day, these songs are meant to remind you that you are not alone.',
  'Latest Release',
  'https://www.instagram.com/hollow.testament/',
  'https://www.tumblr.com/hollowtestament',
  'https://x.com/hollowtestament',
  'hollowtestament@gmail.com'
where not exists (select 1 from public.site_settings);

alter table public.site_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_settings'
      and policyname = 'Public read site_settings'
  ) then
    create policy "Public read site_settings"
      on public.site_settings for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_settings'
      and policyname = 'Authenticated write site_settings'
  ) then
    create policy "Authenticated write site_settings"
      on public.site_settings for update
      to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_settings'
      and policyname = 'Authenticated insert site_settings'
  ) then
    create policy "Authenticated insert site_settings"
      on public.site_settings for insert
      to authenticated
      with check (true);
  end if;
end $$;
