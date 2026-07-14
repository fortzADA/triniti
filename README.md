# Trinity

Social/community platform built with **Vite + React + TypeScript + Tailwind**, packaged for **Android and iOS** with **Capacitor**, and backed by **Supabase**.

## Features

- Public church marketplace: browse and open parish portals
- Self-serve church creation for priests/admins
- Public portal pages + private per-church member communities
- Email/password auth plus Google and Apple OAuth
- Profiles with avatar upload
- Church-scoped feed: posts, likes, comments
- Groups within each church
- Direct messages with Supabase Realtime
- In-app notifications (likes, comments, messages)

## Prerequisites

- Node.js 20+
- JDK 21 (required by Capacitor 8 / Android Gradle)
- A [Supabase](https://supabase.com) project
- Android Studio (for Android builds)
- Xcode on macOS (for iOS builds)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env and fill in your Supabase project values:

```bash
cp .env.example .env
```

3. In the Supabase SQL editor, run both migrations in order:

[`supabase/migrations/20260711000000_init.sql`](supabase/migrations/20260711000000_init.sql)

[`supabase/migrations/20260715000000_churches.sql`](supabase/migrations/20260715000000_churches.sql)

[`supabase/migrations/20260716000000_church_coords.sql`](supabase/migrations/20260716000000_church_coords.sql) (optional lat/lng for live globe pins)

4. In Supabase Auth settings, enable Email, and optionally Google / Apple providers. Add your site URL (e.g. `http://localhost:5173`) and Capacitor redirect URLs as needed.

5. Start the web app:

```bash
npm run dev
```

Key routes:

- `/` — Trinity presentation
- `/churches` — marketplace globe (Romanian parish pins + directory)
- `/churches/new` — create a church portal
- `/churches/:slug` — public parish portal
- `/c/:slug/feed` — private church community

## Capacitor (Android / iOS)

Build the web app and sync native projects:

```bash
npm run cap:sync
```

Open native IDEs:

```bash
npm run cap:android   # opens Android Studio
npm run cap:ios       # opens Xcode (macOS only)
```

After web changes, always run `npm run cap:sync` before rebuilding the native app.

App ID: `com.trinity.app`

## Project structure

```
src/
  components/   UI building blocks
  contexts/     Auth session
  lib/          Supabase client, types, native init
  pages/        Route screens
  services/     API layer (auth, posts, groups, messages, notifications)
supabase/
  migrations/   Schema + RLS
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run cap:sync` | Build + sync Capacitor |
| `npm run cap:android` | Sync and open Android Studio |
| `npm run cap:ios` | Sync and open Xcode |
| `npm run android:build` | Sync and build a debug APK |

## Notes

- Device push (FCM/APNs) is out of scope for this first build; notifications are in-app only.
- OAuth on device requires configuring redirect URLs / deep links for `com.trinity.app`.
