-- Phone numbers are not collected or stored for site settings.
alter table site_settings
  drop column if exists contact_phone;
