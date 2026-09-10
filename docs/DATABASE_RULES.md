# Database Rules

This document is high-level database design only. Do not create the complete production schema until features require it.

## Principles

- Supabase Auth remains responsible for authentication users.
- Application user/restaurant access comes through restaurant membership.
- Tenant-owned records should include `restaurant_id`.
- Restaurant data must never leak between tenants.
- Use PostgreSQL directly; no ORM.
- Use UUIDs where appropriate.
- Use `timestamptz`-style timestamps where appropriate.
- Important records should generally include `created_at` and `updated_at`.
- Store restaurant timezone explicitly.
- Normalize phone numbers for customer identity.
- Money values must not use floating-point arithmetic.
- Never store raw payment-card information.
- Public restaurant slugs should be unique.
- Foreign keys and meaningful constraints should protect important invariants.
- RLS should protect tenant-owned Supabase-accessed data when application tables exist.
- Server-side authorization is still required where appropriate.
- Do not create database structures for speculative later features.

## Conceptual V1 Entity Shape

```text
Supabase Auth users
  -> restaurant memberships
  -> restaurants

restaurants
  -> opening hours
  -> dining areas
      -> restaurant tables
          -> table combinations
          -> table combination members
  -> reservation settings
  -> reservation duration rules
  -> customers
  -> reservations
      -> table assignments
      -> reservation events/history
      -> internal notes
  -> staff invitations/memberships
  -> notification records when that feature exists
  -> guest-card/payment references when Stripe is implemented
  -> cancellation/no-show charge records
  -> subscription records
  -> suspicious-account/review flags
```

Names may be refined when each feature is implemented, but the relationships should stay simple and tenant-aware.

## Membership

Restaurant membership connects an authenticated Supabase user to a restaurant and role. V1 supports one restaurant/location per restaurant account.

## Reservation State

Normal reservation lifecycle statuses are:

- Confirmed
- Arrived
- Seated
- Completed
- Cancelled
- No-show

Manual confirmation should be modeled as a separate internal request state before a reservation becomes confirmed. Do not overload lifecycle status to represent pending requests.

## Availability And Concurrency

Reservation creation and rescheduling must ultimately be safe against double booking. Do not prematurely solve every concurrency issue in the high-level design, but feature implementation and Part 4 must address atomicity, locking, constraints, or transaction behavior where needed.

## Payments

Store Stripe identifiers and payment references only when Stripe features are implemented. Never store raw card numbers, CVCs, or equivalent sensitive card data.
