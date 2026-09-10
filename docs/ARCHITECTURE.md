# Architecture

## System Shape

```text
Browser
  |
  v
Next.js
  - React UI
  - App Router
  - Server Components where useful
  - Server Actions where appropriate
  - Route Handlers where an HTTP endpoint is appropriate
  |
  v
Supabase
  - PostgreSQL
  - Auth
  - Storage when needed
```

Later feature-specific integrations:

```text
Next.js
  - Stripe
  - Resend
```

There is no separate Express API, no microservice split, no ORM, and no dedicated worker system in the initial architecture.

## Next.js Boundaries

Use the App Router. Prefer Server Components for server-rendered data access when useful. Use Client Components only for interactive browser behavior.

Use Server Actions for form-style mutations when they fit naturally. Use Route Handlers for public HTTP endpoints, webhooks, health checks, or integration endpoints.

Sensitive operations must run on the server.

## Supabase Boundaries

Supabase Auth owns authentication users. Application authorization is based on restaurant membership and platform-admin state.

Browser code may use only public Supabase configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only credentials must not be exposed to client code. Add a server secret only when a real server-only feature requires it.

Supabase SSR clients use cookies for auth session state. The Next.js proxy is responsible for refreshing auth cookies for server-rendered requests.

## Data Access

Use PostgreSQL/Supabase directly. Do not use Prisma or any ORM.

Tenant-owned queries must filter and authorize by restaurant context. Authorization must not depend merely on UI state.

## Project Structure

```text
app/                 Next.js routes, layouts, route handlers
components/          Reusable UI components
lib/                 Shared application utilities
lib/supabase/        Supabase browser/server utilities
types/               Shared TypeScript types
docs/                Project source of truth
tests/               Future e2e, unit, and integration tests
public/              Static assets
```

Keep this structure simple. Add folders only when they provide immediate organizational value.
