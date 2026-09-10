# F02 Restaurant Account + Trial Creation

## Status

DONE.

The application code, migration, validation, local tests, and live Supabase smoke test are complete.

## Scope

F02 adds the first real restaurant account state after authentication:

- Authenticated, email-verified users without a restaurant can create one restaurant account.
- The creator receives an Owner membership.
- A free trial starts at restaurant creation.
- `/app` routes users without a restaurant to `/app/create-restaurant`.
- `/app` shows a minimal restaurant and trial summary for users with a restaurant.

F02 does not implement restaurant profile editing, branding, public slugs, opening hours, dining areas, tables, reservation settings, billing, Stripe, Resend application emails, staff invitations, or the broader F03 authorization system.

## Routes

- `/app`
  - Logged-out users redirect to `/login`.
  - Logged-in users without a restaurant redirect to `/app/create-restaurant`.
  - Logged-in users with a restaurant see a minimal restaurant/trial summary.
- `/app/create-restaurant`
  - Logged-out users redirect to `/login`.
  - Logged-in users whose email is not verified redirect to `/verify-email`.
  - Logged-in verified users without a restaurant see the create form.
  - Logged-in verified users with a restaurant redirect to `/app`.

## Create Form

Required fields:

- Restaurant name.
- Business phone.
- Address line 1.
- City.
- Province/state/region.
- Postal/ZIP.
- Country.

Optional fields:

- Address line 2.
- Website.

The browser never submits trial duration. Trial duration is read on the server.

## Database Changes

Migration:

- `supabase/migrations/20260910120000_create_restaurant_accounts.sql`

Tables:

- `public.restaurants`
  - UUID primary key.
  - Minimum restaurant contact/address fields required for F02.
  - Stored `trial_started_at` and `trial_ends_at` timestamps.
  - `created_at` and `updated_at`.
  - Constraint that trial end must be after trial start.
- `public.restaurant_memberships`
  - UUID primary key.
  - `restaurant_id` references `public.restaurants`.
  - `user_id` references `auth.users`.
  - `role` uses the `public.restaurant_role` enum.
  - `created_at` and `updated_at`.
  - Unique `(restaurant_id, user_id)`.
  - Unique `user_id` to enforce one restaurant per user in V1.

RPC:

- `public.create_restaurant_account(...)`
  - Creates restaurant and Owner membership atomically.
  - Uses `statement_timestamp()` for the stored trial timestamps.
  - Validates the target auth user exists and has a verified email.
  - Validates positive trial duration with a maximum of 365 days.
  - Is `security definer` with a fixed `search_path`.
  - Is revoked from `public`, `anon`, and `authenticated`.
  - Is granted only to `service_role`.

## Trial Configuration

Server-side configuration:

```text
TRIAL_DURATION_DAYS=14
```

The central helper is `lib/trial/config.ts`.

Changing `TRIAL_DURATION_DAYS` affects only new restaurant accounts. Existing restaurant accounts keep their stored `trial_started_at` and `trial_ends_at` values.

The app fails clearly if the value is not a positive integer.

## Trial State

Trial state is derived from stored timestamps:

- `now < trial_ends_at` means `trialing`.
- `now >= trial_ends_at` means `expired`.

No worker, cron job, or mutable daily status update is required for F02.

## Security

Server action:

- Re-authenticates the user inside `createRestaurantAction`.
- Requires email verification from Supabase Auth user data.
- Validates all form input server-side.
- Reads trial duration only from server configuration.
- Calls the restricted RPC with a server-only service role client.

RLS:

- `public.restaurants` has RLS enabled.
- `public.restaurant_memberships` has RLS enabled.
- Authenticated users can read only restaurants where they have a membership.
- Authenticated users can read only their own membership rows.
- No direct client insert/update/delete policies are provided for F02.

## Testing

Local automated coverage:

- Restaurant create-form validation and optional-field normalization.
- Trial configuration parsing, including 7-day and 30-day values.
- Trial active/expired state, remaining-days helper, and date formatting.
- Static integration checks for F02 migration shape.
- E2E checks that logged-out users are redirected from `/app` and `/app/create-restaurant`.

Live account creation was verified against the configured self-hosted Supabase instance with a disposable verified auth user. The smoke test created a restaurant, verified Owner membership, verified the configured trial duration, verified duplicate prevention, and cleaned up the test data.

## Completion Notes

Completed:

- The migration has been applied to the active Supabase database.
- `SUPABASE_SERVICE_ROLE_KEY` is configured only on the server.
- A verified user can create a restaurant, receive Owner membership, and land on the `/app` summary.
