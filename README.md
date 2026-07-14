# Trinity

Social/community platform built with **Vite + React + TypeScript + Tailwind**, packaged for **Android and iOS** with **Capacitor**, and backed by **Supabase**.

## Features

- Email/password auth plus Google and Apple OAuth
- Profiles with avatar upload
- Public feed: posts, likes, comments
- Groups/communities with membership and group feeds
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

3. In the Supabase SQL editor, run the migration:

[`supabase/migrations/20260711000000_init.sql`](supabase/migrations/20260711000000_init.sql)

4. In Supabase Auth settings, enable Email, and optionally Google / Apple providers. Add your site URL (e.g. `http://localhost:5173`) and Capacitor redirect URLs as needed.

5. Start the web app:

```bash
npm run dev
```

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
