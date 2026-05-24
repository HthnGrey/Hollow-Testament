-- Multiple featured YouTube embeds (url + optional title per card)
alter table site_settings
  add column if not exists featured_youtube_embeds jsonb not null default '[]'::jsonb;

update site_settings
set featured_youtube_embeds = jsonb_build_array(
  jsonb_build_object('url', featured_youtube_url, 'title', null)
)
where featured_youtube_url is not null
  and featured_youtube_url <> ''
  and (featured_youtube_embeds is null or featured_youtube_embeds = '[]'::jsonb);
