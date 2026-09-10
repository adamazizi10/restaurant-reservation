# Roadmap

## Table 1: Overall Development Process

| Part | Stage | Goal | Status |
|---|---|---|---|
| 1 | Plan the whole product | Product, architecture, business rules, database design and roadmap are documented | DONE |
| 2 | Build foundation | Working Next.js + Supabase project foundation | DONE |
| 3 | Implement V1 features | Build all V1 functionality one feature at a time | IN_PROGRESS |
| 4 | Harden, optimize, production and Post-V1 | Production hardening, measured optimization, deployment/maintenance, then selected later features | PLANNED |

## Table 2: Part 3 V1 Feature Implementation

| ID | Feature | Main UI / Result | Status |
|---|---|---|---|
| F01 | Authentication experience | Sign up, email verification, login, logout, password reset/recovery and session handling | DONE |
| F02 | Restaurant account + trial creation | Create restaurant tenant, Owner membership, restaurant details and 14-day trial state | PLANNED |
| F03 | Restaurant authorization | Protected restaurant area with Owner/Admin/Staff server-side authorization | PLANNED |
| F04 | Restaurant profile and branding | Restaurant details, contact information, logo/image, primary color and public slug settings | PLANNED |
| F05 | Opening hours | Friendly weekly opening-hours editor including closed days | PLANNED |
| F06 | Dining areas | Create/edit/disable areas such as Main Dining, Patio or Bar and control online availability | PLANNED |
| F07 | Restaurant tables | Simple table list with table name/number, capacity, online-bookable and disabled state | PLANNED |
| F08 | Table combinations | Enable combinations and configure valid groups of physical tables | PLANNED |
| F09 | Reservation settings | Booking interval, duration rules, minimum notice, booking horizon, max online guest count, online enabled and confirmation mode | PLANNED |
| F10 | Card and cancellation-policy settings | Require-card toggle, optional fee policy, fixed/per-guest fee configuration and cutoff policy UI/data | PLANNED |
| F11 | Restaurant onboarding wizard | Resumable setup flow using restaurant details, hours, areas/tables, reservation settings, card policy, preview and go-live | PLANNED |
| F12 | Availability engine | Server-side calculation of valid reservation times from hours, tables, settings, duration and existing reservations | PLANNED |
| F13 | Automatic table assignment | Select suitable table/table combination while allowing valid staff override | PLANNED |
| F14 | Hosted public restaurant page | Public branded reservation-focused restaurant page | PLANNED |
| F15 | Guest reservation booking flow | Guest count -> date -> available time -> contact details -> optional notes -> create reservation -> confirmation/request result | PLANNED |
| F16 | Manual confirmation requests | Restaurant queue/UI to accept or reject reservation requests for restaurants using manual confirmation | PLANNED |
| F17 | Embeddable booking entry point | Simple widget/button restaurants can add to their own website using the same booking system | PLANNED |
| F18 | Restaurant operations dashboard | Host-stand friendly daily/upcoming reservation view with useful filters and actions | PLANNED |
| F19 | Reservation detail and lifecycle | Reservation detail UI and Confirmed/Arrived/Seated/Completed/Cancelled/No-show operations | PLANNED |
| F20 | Phone/manual reservations | Staff can create reservations received by phone or entered manually using the same availability system | PLANNED |
| F21 | Walk-ins | Staff can add walk-ins, guest count and table assignment so availability updates immediately | PLANNED |
| F22 | Lightweight customer history | Restaurant-specific customer history using normalized phone identity and past reservation activity | PLANNED |
| F23 | Internal notes | Private reservation/customer notes that never appear in guest-facing UI | PLANNED |
| F24 | Guest manage-reservation flow | Secure link to view, cancel and reschedule a reservation according to policies and availability | PLANNED |
| F25 | Staff management | Owner/Admin staff list, invitations/access management and Owner/Admin/Staff roles | PLANNED |
| F26 | Email notifications | Resend confirmation, reminder, cancellation, reschedule and useful restaurant notification emails | PLANNED |
| F27 | Guest card collection | Stripe card collection only when restaurant requires a card; never store raw card details | PLANNED |
| F28 | Manual cancellation/no-show fees | Show eligible charge and allow authorized staff to manually initiate configured Stripe fee | PLANNED |
| F29 | Restaurant SaaS subscription billing | Stripe monthly billing, early trial conversion, payment state and application access behavior | PLANNED |
| F30 | Platform admin | Platform-only restaurant management, suspicious trial review, activation/suspension, trial/subscription state, basic usage and support notes | PLANNED |
| F31 | Responsive/PWA-ready UI completion | Ensure full restaurant and guest experience works cleanly on desktop, tablet and phone and has a simple installable-web-app foundation where appropriate | PLANNED |

## Future Feature Workflow

When a future feature is implemented:

1. Change that feature to `IN_PROGRESS`.
2. Read all relevant project docs.
3. Define that feature's detailed requirements.
4. Design only the database/API/UI needed for that feature.
5. Implement frontend and backend together.
6. Add reasonable unit, integration, or e2e tests where they provide value.
7. Test and fix it.
8. Mark it `DONE` only when complete.
9. Do not implement the next feature.

When every F01-F31 row is `DONE`, mark Part 3 `DONE` and declare V1 feature-complete. Do not automatically begin Part 4.

## Part 4 Outline

After Part 3 is complete, perform a dedicated software-engineering and production pass.

### Harden

- Full tenant-isolation audit.
- Supabase RLS/security audit.
- Authorization audit.
- Input validation audit.
- Concurrency/race-condition audit.
- Ensure simultaneous reservation attempts cannot double book tables.
- Database constraints.
- Transaction/atomicity review.
- Idempotency where required.
- Stripe webhook safety/idempotency.
- Error handling.
- Edge cases.
- Complete automated-test pass.
- Security review.

### Optimize

Optimize only based on evidence:

- Query optimization.
- PostgreSQL indexes.
- Remove N+1 or inefficient data access.
- Pagination where required.
- Frontend performance.
- Bundle/image optimization.
- Caching only if actually useful.
- Redis only if actually justified.
- Queues/workers only if actual workloads justify them.
- Load testing where valuable.
- Scaling review.

### Production

- Production environment variables.
- Supabase production configuration.
- Stripe production configuration.
- Resend production configuration.
- Domain setup.
- CI/CD.
- Build checks.
- Database migrations/deployment procedure.
- Backups.
- Restore strategy.
- Logs/monitoring appropriate to actual needs.
- Production smoke tests.
- Launch checklist.
- Maintenance/update process.

### Post-V1

Only after the core system is complete and stable should items from `docs/LATER.md` be selected and implemented one at a time.
