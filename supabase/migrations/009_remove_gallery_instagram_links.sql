-- Gallery is upload-only; remove Instagram-link support.
delete from public.gallery_images
where nullif(btrim(coalesce(image_url, '')), '') is null;

alter table public.gallery_images
  drop constraint if exists gallery_images_has_media;

alter table public.gallery_images
  alter column image_url set not null;

alter table public.gallery_images
  drop column if exists instagram_url;
