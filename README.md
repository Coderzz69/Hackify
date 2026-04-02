# Hackify

**Hackify** is a real-time skill verification platform for developers.
It combines GitHub activity signals and AI-evaluated coding challenges into a living **SkillGraph** and a shareable public profile.

Tagline: **"Your skills, verified. Your reputation, unbeatable."**

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- PostgreSQL + Prisma ORM
- NextAuth.js (GitHub OAuth + recruiter credentials)
- OpenAI GPT-4o API for evaluation
- Stripe subscriptions
- Vercel Cron Jobs for daily GitHub sync

## Local Setup
1. Install dependencies.
2. Create a `.env` file from `.env.example`.
3. Set up the database and seed tasks.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Core Architecture
- **Auth**: GitHub OAuth for developers and credentials for recruiters via NextAuth + Prisma adapter.
- **GitHub Sync**: `/api/github/sync` pulls repos, languages, stars, README quality, and recent activity with a 24h cache.
- **SkillGraph Engine**: `lib/skill-graph.ts` computes scores and trends per skill.
- **AI Evaluation**: `/api/evaluate` sends tasks + code to GPT-4o, validates JSON with zod, and updates SkillGraph (GitHub 40% + AI 60%).
- **Dashboards**:
  - `/dashboard` shows radar chart + skill cards.
  - `/profile/[slug]` is public and shareable (ISR enabled).
- **Recruiter Portal**: `/recruiter` includes search, saved candidates, and Stripe upgrade flow.

## API Routes
- `GET /api/github/sync` - Fetch + update GitHub data for user
- `POST /api/evaluate` - Submit code for AI evaluation
- `GET /api/skill-graph/[userId]` - Return SkillGraph JSON
- `GET /api/profile/[slug]` - Authenticated profile data
- `GET /api/recruiter/search` - Search developers by skill + score
- `POST /api/recruiter/save` - Save/unsave candidate
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Stripe subscription updates
- `GET /api/cron/github-sync` - Daily GitHub sync (Bearer auth)

## Vercel Cron
Create a daily cron targeting `/api/cron/github-sync` with the `CRON_SECRET` bearer token.

## Branding
- Primary: `#6C3AFF`
- Accent: `#00F5A0`
- Font: Inter + JetBrains Mono
- Labels: **Hackify Score**, **Hackify Verified**

## Notes
- Public profiles are server-rendered and cached for 1 hour (`revalidate = 3600`).
- The Stripe webhook and cron routes use signature/secret validation instead of user sessions.
- Recruiter accounts are invite-only in the MVP and can be seeded directly in the database with a bcrypt hash.
