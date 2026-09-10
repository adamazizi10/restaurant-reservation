# F03 Restaurant Authorization

## Status

DONE.

The authorization helpers, `/app` integration, tests, live Supabase smoke test, lint, typecheck, and production build are complete.

## Scope

F03 adds restaurant-level authorization infrastructure:

- Server-side restaurant access resolution.
- Owner, Admin, and Staff permission checks.
- Controlled authorization errors for future server actions and route handlers.
- Tenant-safe `/app` access based on authenticated user membership.
- Focused authorization tests.

F03 does not implement restaurant profile editing, restaurant settings screens, reservations, staff invitations, staff management, billing, Stripe, platform administration, or an application dashboard.

## Role Model

Restaurant roles use the existing `public.restaurant_role` enum:

- `owner`
- `admin`
- `staff`

Platform administration remains separate and is not modeled as a restaurant role.

## Permission Model

The central permission model is in `lib/authorization/permissions.ts`.

Current permissions:

- `restaurant.account.manage`
- `restaurant.billing.manage`
- `restaurant.settings.manage`
- `restaurant.tables.manage`
- `restaurant.reservations.manage`
- `restaurant.staff.manage`

Owner receives all current restaurant permissions.

Admin receives restaurant settings, tables, reservations, and staff-management permissions, but not account ownership or billing permissions.

Staff receives reservation operational permission only.

`hasRestaurantPermission(...)` accepts unknown runtime input and fails closed for invalid roles or permissions.

## Server-Side Access Resolution

The canonical server-side access helper is `getCurrentRestaurantAccess()` in `lib/authorization/restaurant-access.ts`.

It derives access from:

1. The authenticated Supabase user.
2. The user's `restaurant_memberships` row.
3. A server-side check that the membership restaurant is accessible through RLS.

It returns:

```ts
{
  userId,
  restaurantId,
  membershipId,
  role
}
```

Future restaurant server actions should call `requireRestaurantMembership()` or `requireRestaurantPermission(...)` and then use `access.restaurantId` instead of trusting browser-submitted restaurant identifiers.

Browser-provided roles are never trusted.

## Tenant Isolation

Restaurant access is resolved from database membership state for the authenticated user. If a caller supplies a restaurant ID to `requireRestaurantPermission(...)`, the helper verifies that it matches the authenticated user's resolved membership restaurant before granting access.

Invalid membership states fail closed:

- Missing membership returns no restaurant access.
- Invalid role values return no restaurant access.
- A membership pointing at an inaccessible or missing restaurant returns no restaurant access.
- A mismatched requested restaurant ID throws a forbidden authorization error.

## Route Behavior

`/app` behavior is preserved:

- Logged-out users redirect to `/login`.
- Logged-in verified users without a restaurant membership redirect to `/app/create-restaurant`.
- Logged-in verified users with a valid restaurant membership reach `/app`.

`/app/create-restaurant` remains reachable for logged-in verified users without a restaurant membership.

`/app/forbidden` provides a minimal access-denied screen for future forbidden flows.

## RLS / Database Changes

No F03 database migration was required.

F03 preserves the F02 RLS policies:

- Authenticated users can read restaurants only where they have membership.
- Authenticated users can read only their own membership rows.
- No broad restaurant or membership read policy was added.

Normal restaurant authorization reads use the authenticated Supabase server client with RLS. Service role is not used for ordinary restaurant access.

## Testing

Automated tests added:

- Permission matrix unit tests for Owner, Admin, Staff, invalid roles, and invalid permissions.
- Access resolution integration tests for matching memberships, cross-user memberships, invalid roles, broken restaurant references, and external restaurant ID mismatch.
- Live Supabase authorization smoke test, gated by `RUN_LIVE_SUPABASE_E2E`.
- Live Playwright route tests for verified users with and without restaurant membership, gated by `RUN_LIVE_SUPABASE_E2E`.

## Completion Notes

Completed:

- `/app` now uses the canonical server-side restaurant access path.
- `/app/create-restaurant` remains available to verified users without membership.
- Role display comes from `restaurant_memberships.role`.
- Cross-restaurant reads were verified through normal authenticated RLS access in the live Supabase smoke test.
- No database migration was required.
- F04 was not started.
- Staff management was not implemented; that remains F25.
