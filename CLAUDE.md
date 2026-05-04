# Project context for Claude Code

This is **BYO Beach**, an interactive pin-drop map for Brian Kelley's "BYO Beach" single launch.

## What you should know

- **Stack**: React + Vite, Tailwind CSS, Leaflet (via react-leaflet), Supabase (Postgres), deployed on Vercel.
- **The user is non-technical to mid-technical** — explain commands clearly, walk through steps, and confirm before running anything destructive.
- **The MP3 file is owned by Brian Kelley's team** — no licensing concerns.
- **Target launch** is tied to a single song release, US-only audience.

## Architecture at a glance

- `src/App.jsx` — top-level state machine for the landing → map transition and global audio state.
- `src/components/LandingScreen.jsx` — hero with play button. Tap triggers song + transition.
- `src/components/MapScreen.jsx` — orchestrates player bar, stats bar, map, and pin modal.
- `src/components/PinMap.jsx` — Leaflet map with custom pin markers.
- `src/components/PinModal.jsx` — submission form with validation.
- `src/lib/supabase.js` — database client and queries.
- `supabase/schema.sql` — one-time database setup, run in Supabase SQL editor.

## Common tasks the user will ask about

1. **Initial setup** — guide them through Supabase project creation, environment variables, and running `npm install`.
2. **Deployment** — Vercel via GitHub, then DNS for a subdomain.
3. **WordPress embed** — final step is an iframe on their existing WordPress site.
4. **Moderation** — currently pins auto-approve. If they want a queue, change the schema default and build a simple admin view.
5. **Brand customization** — colors live in `tailwind.config.js`, fonts in `index.html`.

## Things to flag proactively

- If the user hasn't added the MP3 to `public/audio/byo-beach.mp3`, the play button will fail silently. Check this early.
- The default `status` for new pins is `'approved'` — pins appear instantly. This is a deliberate launch-day choice. If the user wants moderation, change the schema default.
- Test on a real phone before launch — mobile Safari has quirks with autoplay and viewport sizing.

## What's intentionally not built (Phase 2+)

- Moderation queue and admin dashboard
- BK's TikTok-friendly heatmap dashboard
- Email capture and tour-routing integration
- Share-to-social mechanics

If the user asks for any of these, scope it as a Phase 2 conversation rather than scope creep on launch.
