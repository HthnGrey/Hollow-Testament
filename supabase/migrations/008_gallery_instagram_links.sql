-- Allow gallery entries to be either uploaded images or Instagram post links.
alter table public.gallery_images
  add column if not exists instagram_url text;

alter table public.gallery_images
  alter column image_url drop not null;

alter table public.gallery_images
  drop constraint if exists gallery_images_has_media;

alter table public.gallery_images
  add constraint gallery_images_has_media
  check (
    nullif(btrim(coalesce(image_url, '')), '') is not null
    or nullif(btrim(coalesce(instagram_url, '')), '') is not null
  );
