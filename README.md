# Hollow Testament — Website & Dashboard

Production-ready band website with a lightweight password-protected admin dashboard. Built with Next.js, Tailwind CSS, shadcn-style UI components, and Supabase.

## Public pages

- `/` — Home (hero, featured release, about snippet, video, social)
- `/music` — Spotify embed, featured release, video
- `/about` — Full bio
- `/updates` — Published announcements
- `/updates/[slug]` — Single update with shareable meta
- `/contact` — Contact form, email, phone, social links

## Admin (Supabase Auth)

- `/admin` — Login
- `/admin/dashboard` — Overview
- `/admin/settings` — Edit site content
- `/admin/updates` — CRUD for news posts

## Quick start (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase env vars, the public site uses built-in default copy. Admin login requires Supabase.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_initial.sql` in the SQL Editor.
3. Create a **public** Storage bucket named `media`.
4. In **Authentication → Users**, create an admin user (email + password).
5. Copy **Project URL** and **anon key** into `.env.local`.

### RLS summary

- `site_settings`: public read, authenticated write
- `updates`: public read when `is_published = true`, authenticated full CRUD
- `media` bucket: public read, authenticated upload

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (admin) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (admin) | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for SEO/sitemap |
| `RESEND_API_KEY` | Optional | Sends contact form email |
| `CONTACT_FROM_EMAIL` | Optional | Resend verified sender |

## Contact form

- With `RESEND_API_KEY`: emails `hollowtestament@gmail.com` (or `contact_email` in settings).
- Without Resend: API returns a mailto fallback message.

Includes honeypot field and minimum submit delay for basic spam protection.

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Add environment variables from `.env.example`.
4. Deploy.

## Domain

Purchase a domain (Namecheap, Cloudflare Domains, etc.) and point DNS to Vercel. Set `NEXT_PUBLIC_SITE_URL` to your production URL.

## Assets

- Logo: `public/logo.jpg` (from `Logo.jfif`)
- Layout reference: `wireframe.png`

## API routes

**Public**

- `GET /api/public/settings`
- `GET /api/public/updates`
- `GET /api/public/updates/[slug]`

**Admin** (requires Supabase session)

- `POST /api/admin/settings`
- `POST /api/admin/updates`
- `PUT /api/admin/updates/[id]`
- `DELETE /api/admin/updates/[id]`
- `POST /api/admin/upload`

## Scripts

```bash
npm run dev    # development
npm run build  # production build
npm run start  # production server
```
