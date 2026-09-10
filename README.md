# Restaurant Reservation

A Next.js and Supabase foundation for an independent restaurant reservation SaaS.

## Architecture

- Next.js App Router for UI and server-side code.
- Supabase for PostgreSQL, Auth, and Storage when needed.
- No separate Express backend.
- No ORM.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` using `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

These values come from the Supabase project dashboard. Do not commit real secrets.

Run the development server:

```bash
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:e2e
```

## Documentation

Project source-of-truth docs live in `docs/`. Start with `AGENTS.md`, then read the product, business, architecture, database, engineering, roadmap, and later-work docs before changing behavior.

F01 authentication behavior is documented in `docs/F01_AUTHENTICATION.md`.
