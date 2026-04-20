# ClipCash MVP

A minimal, deploy-anywhere MVP of the ClipCash PRD: brands launch per-view campaigns, creators submit clips, views accrue, brands approve, creators see earnings.

Built as a **Next.js 14** app with Tailwind. All state is stored in browser `localStorage` — no database, no env vars. Ships to Vercel in one click.

## What's in the MVP

- **Landing page** — pick Brand or Creator.
- **Brand flow** — create a campaign (name, brief, budget, CPV, dates, platforms, min followers), review submissions, approve or dispute, see live spend / effective CPV.
- **Creator flow** — set handle + followers + connected platforms, see only campaigns you're eligible for, submit one post URL per campaign.
- **Earnings** — per-post view count, state, earnings, expected net-15 payout date.
- **Simulated 6h polling** — click "Simulate 6h poll" on the campaign or earnings page to add verified views to pending posts (replaces the real TikTok/IG OAuth polling job from the PRD).

Two demo campaigns are seeded on first load so the app isn't empty.

## What's stubbed vs. the PRD

To keep the MVP tiny, the following are simulated (not implemented): real auth, Stripe escrow + Connect payouts, TikTok / Instagram OAuth and view polling, fraud scoring, email notifications, admin console, Datadog/PagerDuty. All state lives in the browser — clearing localStorage resets everything.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com/new](https://vercel.com/new), import the repo.
3. Accept the defaults (framework is auto-detected as Next.js). No env vars needed.
4. Click **Deploy**.

Or from the CLI:

```bash
npm i -g vercel
vercel
```

## File tour

```
app/
  page.tsx              landing
  brand/page.tsx        campaign list
  brand/new/page.tsx    campaign builder
  brand/[id]/page.tsx   campaign detail + moderation queue
  creator/page.tsx      eligibility-filtered campaign feed + submit
  creator/earnings/page.tsx  per-post earnings + payout dates
lib/
  types.ts              Campaign, Submission types
  storage.ts            localStorage helpers, seed data, simulated poll
```
