# Reception RSVP Website (Brandon & Ashley)

This is a simple RSVP site for the send-off reception:

- **Date:** Saturday, September 26, 2026
- **Time:** 3:00 PM – 8:00 PM
- **Location:** Tewksbury Lodge, 249 Ohio St, Buffalo, NY 14204

It includes an RSVP form (accept/decline, name required, email optional) and a backend API route that saves RSVPs to **Supabase Postgres**.

## Prerequisites

- Node.js **20+** (recommended for local dev and required for deployment)
- A Supabase project (free tier is fine)

## 1) Supabase setup (database)

1. Create a new Supabase project.
2. In Supabase, open **SQL Editor** and run:

```sql
create extension if not exists pgcrypto;

create table if not exists public.rsvps (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	email text null,
	status text not null check (status in ('accept', 'decline')),
	party_size integer null,
	notes text null,
	created_at timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
```

If you already created the table earlier, run this instead:

```sql
alter table public.rsvps
	add column if not exists party_size integer null,
  add column if not exists notes text null;
```

## 2) Environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Fill in:

- `SUPABASE_URL` — from Supabase **Project Settings → API**
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase **Project Settings → API** (keep this secret)

## 3) Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Optional health check:

- `GET /api/rsvp/health`

## 4) Deploy (Vercel)

1. Push this repo to GitHub.
2. Create a new project in Vercel and import the repo.
3. In Vercel, set Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Deploy.

## Viewing RSVPs

Option A (in Supabase):

- Go to **Table Editor → rsvps**
- Or run:

```sql
select * from public.rsvps order by created_at desc;
```

Option B (in this app):

- Visit `/rsvps` to view the list.
- If you set `RSVP_ADMIN_TOKEN`, open `/rsvps?token=YOUR_TOKEN`.

## Updating photos

Placeholder images live in:

- `public/placeholders/hero.svg`
- `public/placeholders/couple.svg`
- `public/placeholders/venue.svg`

Hero photos (the two big images at the top of the page) should be placed here:

- `public/photos/hero-1.jpg`
- `public/photos/hero-2.jpg`

You can use `.jpg`, `.jpeg`, `.png`, or `.webp` — just update the filenames referenced in `src/app/page.tsx` if you change extensions.

You can also replace the placeholder SVGs (same filenames) or update references in `src/app/page.tsx`.

## Note about Next.js version

If you’re on Node 20+ (recommended), you can upgrade dependencies any time:

```bash
npm install next@latest eslint-config-next@latest
```
