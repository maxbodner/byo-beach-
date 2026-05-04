# BYO Beach

Interactive pin-drop map for Brian Kelley's "BYO Beach" single launch. Fans drop a pin on their favorite beach while the song plays.

## What this is

A single-page React app with a Leaflet map and a custom audio player. Fans land on a hero screen, tap play, and are taken to a US map where they can click to drop a pin. All pins are stored in Supabase and rendered for everyone to see.

## Quick deploy guide

You'll need accounts at the following services. All have free tiers that cover this project:

1. **GitHub** (or any git host) — to store the code
2. **Supabase** — database for pins
3. **Vercel** — hosting

### Step 1: Get the code on your machine

If you received this as a zip:

```bash
unzip byo-beach.zip
cd byo-beach
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (pick any region close to your fans — `us-east-1` is a good default)
3. Wait for the project to provision (~2 minutes)
4. Go to **SQL Editor** in the left sidebar
5. Click **New query**, paste the entire contents of `supabase/schema.sql`, and click **Run**
6. Go to **Project Settings → API** and copy two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon / public key** (a long string starting with `eyJ...`)

### Step 4: Wire up your local environment

Create a file called `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Add the song

Drop the MP3 file into `public/audio/` and name it exactly:

```
byo-beach.mp3
```

Recommended encoding: 192 kbps, around 4-5 MB for a 3-minute track.

### Step 6: Test locally

```bash
npm run dev
```

Open `http://localhost:3000` and walk through the experience. Try dropping a few test pins. Open Supabase's **Table Editor** to confirm rows are appearing in the `pins` table.

### Step 7: Push to GitHub

```bash
git init
git add .
git commit -m "Initial BYO Beach build"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/byo-beach.git
git branch -M main
git push -u origin main
```

### Step 8: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `byo-beach` repo
4. Before clicking Deploy, expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy**

Vercel gives you a URL like `byo-beach.vercel.app`. Test it.

### Step 9: Set up the subdomain

In Vercel, go to your project's **Settings → Domains**. Add `byobeach.briankelley.com` (or whatever subdomain you want).

Vercel will show you a CNAME record to add. Go to wherever briankelley.com's DNS is managed (likely the WordPress host or a domain registrar like GoDaddy/Namecheap) and add the CNAME. SSL provisions automatically within 5-30 minutes.

### Step 10: Embed in WordPress

In WordPress, create a new page (e.g., `/byo-beach`). In a Custom HTML block, add:

```html
<iframe
  src="https://byobeach.briankelley.com"
  style="width: 100%; height: calc(100vh - 80px); border: 0;"
  allow="autoplay"
  title="BYO Beach"
></iframe>
```

The `calc(100vh - 80px)` accounts for the WordPress header. Adjust as needed.

---

## Working with Claude Code

This project is set up to work cleanly with Claude Code. From the project directory, run:

```bash
claude
```

Tell Claude what you need — for example:

- "Walk me through setting up Supabase"
- "Help me change the colors to match BK's brand kit"
- "Add a profanity filter to pin submissions"
- "Set up moderation so pins need approval before appearing"
- "Add an admin page to view and approve pending pins"

Claude Code can edit files, run commands, install packages, and test changes — all in your local environment.

---

## Project structure

```
byo-beach/
├── public/
│   ├── audio/
│   │   └── byo-beach.mp3       ← Add the song here
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── LandingScreen.jsx   ← Hero with play button
│   │   ├── MapScreen.jsx       ← Map view container
│   │   ├── PlayerBar.jsx       ← Persistent audio player
│   │   ├── PinMap.jsx          ← Leaflet map + pins
│   │   ├── PinModal.jsx        ← Pin submission form
│   │   └── SuccessToast.jsx    ← After-submit confirmation
│   ├── lib/
│   │   ├── supabase.js         ← Database client
│   │   ├── states.js           ← US states list
│   │   └── analytics.js        ← Event tracking wrapper
│   ├── App.jsx                 ← Top-level state
│   ├── main.jsx                ← Entry point
│   └── index.css               ← Global styles
├── supabase/
│   └── schema.sql              ← Database setup
├── .env.example                ← Env var template
├── vercel.json                 ← Hosting config
└── package.json
```

---

## Common modifications

### Change the colors

Edit `tailwind.config.js`. The brand colors are defined under `theme.extend.colors`.

### Enable moderation queue

In `supabase/schema.sql`, change the default status:

```sql
alter table pins alter column status set default 'pending';
```

Pins will then need manual approval. You can approve them in the Supabase Table Editor by changing the `status` column to `approved`, or via SQL:

```sql
update pins set status = 'approved' where id = 'pin-id-here';
```

### Add real analytics

Edit `src/lib/analytics.js`. Examples for Plausible and PostHog are commented in the file. Add the provider's script tag to `index.html`.

### Tweak the audio behavior

Audio logic lives in `src/App.jsx`. Currently the track loops on end. To stop after one play, remove the `onEnded` handler.

---

## Launch checklist

Before going live:

- [ ] MP3 uploaded and tested on iPhone Safari, Android Chrome, desktop browsers
- [ ] Tested submitting 5+ pins, confirmed they appear on the map
- [ ] Tested on mobile (iPhone + Android), tablet, and desktop
- [ ] Page loads in under 3 seconds on a 4G connection (test with Chrome DevTools throttling)
- [ ] Subdomain DNS propagated and SSL active
- [ ] WordPress iframe embed tested
- [ ] Someone has Supabase admin access for the first 48 hours of monitoring
- [ ] Soft launch tested with 50-100 trusted users before public announcement

---

## Cost expectations

At launch:
- **Supabase free tier**: 500 MB database, 50,000 monthly active users → $0
- **Vercel hobby tier**: 100 GB bandwidth → $0

If the campaign goes viral and you exceed free tiers, both services upgrade for ~$25/month each.

---

## Support

This was generated with Claude (claude.ai). For ongoing help, run `claude` from this directory and ask away.
