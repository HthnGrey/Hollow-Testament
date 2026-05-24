-- Gallery uploads managed from the admin dashboard.
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.gallery_images enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'gallery_images'
      and policyname = 'Public read published gallery images'
  ) then
    create policy "Public read published gallery images"
      on public.gallery_images for select
      using (is_published = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'gallery_images'
      and policyname = 'Authenticated full access gallery images'
  ) then
    create policy "Authenticated full access gallery images"
      on public.gallery_images for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;
