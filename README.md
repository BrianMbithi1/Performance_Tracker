# CODM Performance Tracker

Log your Call of Duty: Mobile matches and see how you are improving.

**Live app:** [performance-tracker-khaki.vercel.app](https://performance-tracker-khaki.vercel.app)
**Github Pages:** https://brianmbithi1.github.io/Performance_Tracker/

## Features

- Sign up and log in with email or Google
- Log, edit and delete matches (mode, map, weapon, kills, deaths, assists, date)
- Dashboard with K/D, average kills and best match
- K/D over time and K/D by mode, map or weapon charts
- Filters by mode, weapon and date
- Look up a CODM player by nickname or UID

## Built with

React, Vite, Tailwind CSS, React Router, Recharts, Supabase and Vitest. Hosted on Vercel.

## Run it locally

You need Node.js 22.19 or newer.

1. Install the packages:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and add your Supabase URL and anon key (Supabase → Project Settings → API).
3. In the Supabase SQL Editor, run `supabase/schema.sql`.
4. Start the app:
   ```bash
   npm run dev
   ```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app locally |
| `npm run build` | Build for production |
| `npm test` | Run the tests |
| `npm run coverage` | Run the tests with a coverage report |
