# Business Rules

## Tenant Isolation

Restaurant private data must remain isolated by tenant. Tenant-owned records belong to exactly one restaurant unless explicitly documented otherwise.

Restaurant authorization must be enforced by server-side checks and database protections where applicable. Hiding UI controls is never sufficient authorization.

## Restaurant Lifecycle

The locked signup/trial behavior is:

1. Create account.
2. Verify email.
3. Enter restaurant information.
4. Start 14-day trial.
5. Check for suspicious or duplicate trial usage.
6. Normal restaurants continue.
7. Suspicious restaurants are flagged for platform review.

Manual platform approval is not required for every restaurant.

Platform owners must eventually be able to review suspicious accounts, activate or suspend restaurants, and manage trial/subscription state.

## Roles

Restaurant roles are limited to:

- Owner
- Admin
- Staff

Platform administration is separate from restaurant roles.

## Reservation Sources

Online, widget, phone/manual, walk-in, and staff-created reservations all feed the same reservation system. Different sources must not create separate calendars or incompatible reservation records.

## Reservation Lifecycle

Normal lifecycle statuses are:

- Confirmed
- Arrived
- Seated
- Completed
- Cancelled
- No-show

Manual-confirmation restaurants require a separate internal request state before confirmation. That request state is not part of the normal lifecycle.

## Availability

Availability is determined by restaurant opening hours, reservation settings, guest count, reservation duration, existing reservations, dining areas, tables, table capacities, table availability, table combinations, and online-bookable settings.

Reservation creation and rescheduling must ultimately be safe against double booking.

## Tables

Dining areas contain tables. Dining areas and tables may be unavailable for online reservations without being deleted.

Tables have a capacity and can be temporarily disabled. Table combinations represent valid groups of physical tables and must not replace the underlying table records.

V1 does not include a visual floor plan.

## Customer History

Customer history is scoped to one restaurant. A practical customer identity is restaurant plus normalized phone number.

Internal notes and manually entered preferences are private restaurant data and must not appear in guest-facing UI unless a future explicit requirement says otherwise.

## Card And Fee Behavior

A restaurant may require a card without enabling cancellation or no-show fees.

Stripe handles card entry. This application never stores raw payment-card information.

V1 cancellation and no-show fee charging is manual. Automatic charging is deferred.

Money values must be represented safely and not with floating-point arithmetic.

## Subscription Behavior

Restaurants receive a 14-day trial. Restaurants may subscribe before trial expiry. SaaS billing and guest card handling are separate business concerns.

Failed subscription payment handling must be represented as subscription/access state rather than ad hoc UI assumptions.
