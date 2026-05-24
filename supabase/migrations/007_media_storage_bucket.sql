-- Storage bucket used by admin image uploads.
-- Safe to run more than once in the Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update
set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read media'
  ) then
    create policy "Public read media"
      on storage.objects for select
      using (bucket_id = 'media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated upload media'
  ) then
    create policy "Authenticated upload media"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated update media'
  ) then
    create policy "Authenticated update media"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated delete media'
  ) then
    create policy "Authenticated delete media"
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'media');
  end if;
end $$;
