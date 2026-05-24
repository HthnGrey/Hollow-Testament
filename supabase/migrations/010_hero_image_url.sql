-- Optional home page hero card image. When blank, the app uses /logo.jpg.
alter table public.site_settings
  add column if not exists hero_image_url text;
