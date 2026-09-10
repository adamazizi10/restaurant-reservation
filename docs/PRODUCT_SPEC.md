# Product Spec

## Product

This project is a restaurant reservation SaaS for independent restaurants. The business goal is a simple, polished, friendly, reliable alternative to larger reservation platforms at roughly $50-$99 per month.

The V1 goal is everything an independent restaurant reasonably needs for day-to-day reservations without unnecessary complexity.

## Locked Scope

- One application.
- One repository.
- One shared PostgreSQL database.
- Multi-tenant architecture.
- Restaurant private data must remain isolated.
- V1 supports one restaurant/location per restaurant account.
- Guests do not create customer accounts.
- Guests can reserve without logging in.
- Restaurant roles are Owner, Admin, and Staff.
- Platform administration is separate from restaurant roles.

## V1 Restaurant Requirements

- Signup and login.
- Restaurant setup and onboarding.
- Restaurant details.
- Limited logo and branding.
- Opening hours.
- Dining areas.
- Tables and table capacities.
- Table combinations.
- Reservation settings.
- Booking intervals.
- Reservation duration rules.
- Booking lead-time rules.
- Booking-ahead limits.
- Maximum online guest count.
- Instant or manual reservation confirmation.
- Card and cancellation settings.
- Reservations dashboard.
- Reservation details.
- Reservation status management.
- Automatic table assignment.
- Staff ability to change valid table assignments.
- Phone/manual reservations.
- Walk-ins.
- Lightweight customer history.
- Internal notes.
- Staff management.
- SaaS subscription management.

## V1 Guest Requirements

- Public restaurant reservation page.
- Hosted booking experience.
- Embeddable booking entry point.
- Date selection.
- Time selection.
- Guest count.
- Name, phone, and email.
- Optional notes or special requests.
- Reservation confirmation.
- Secure manage-reservation link.
- Cancellation.
- Rescheduling.

## Reservation Statuses

Normal reservation lifecycle statuses:

- Confirmed
- Arrived
- Seated
- Completed
- Cancelled
- No-show

Restaurants using manual confirmation also need a separate internal request state before confirmation. That request state must not be confused with the normal reservation lifecycle.

All reservation sources feed the same reservation system:

- Online
- Widget
- Phone/manual
- Walk-in
- Staff-created

There must never be separate calendars for different reservation sources.

## Reservation Behavior

Availability eventually depends on opening hours, booking settings, guest count, reservation duration, existing reservations, dining areas, physical tables, table capacities, table availability, table combinations, and online-bookable settings.

Default reservation duration is 90 minutes. Restaurants may configure durations by guest-count ranges.

Restaurants may configure booking intervals, minimum booking notice, booking horizon, maximum online guest count, whether online booking is enabled, and instant versus manual confirmation.

## Tables

V1 uses a simple table management UI. Dining areas may include Main Dining, Patio, Bar, or Upstairs. Areas can be enabled or disabled for online reservations.

Tables support name or number, capacity, online-bookable state, and temporarily disabled state.

Restaurants may enable table combinations. V1 does not include a visual drag-and-drop floor plan. The table and area data model should remain clean enough for a future visual layout to use existing IDs.

## Public Restaurant Page

Each restaurant receives a hosted page such as `/restaurants/joes-grill`.

The page may show restaurant name, logo, restaurant image, address, contact details, opening hours, basic information, reservation interface, cancellation/no-show policy when applicable, and primary brand color.

This is not a restaurant website builder. Branding remains intentionally limited.

## Customer History

Customer history is lightweight and restaurant-specific. Conceptual identity is `restaurant_id` plus normalized phone number.

Possible information includes previous reservations, completed reservations, cancellations, no-shows, internal notes, and manually entered preferences.

This is not a CRM.

## Cards, Cancellation, And No-Show Fees

Each restaurant controls whether a card is required.

If card collection is off, there is no card-entry UI.

If card collection is on, Stripe handles card entry and this application never stores raw card information. Requiring a card does not automatically mean fees are enabled.

If fees are enabled, V1 supports either a fixed amount per reservation or an amount per guest. Restaurant staff manually initiate eligible cancellation or no-show charges. Automatic charging is Post-V1.

## Email

V1 eventually uses Resend for guest confirmation, reminder, cancellation, and reschedule/update emails, plus useful restaurant notifications.

SMS is not V1.

## SaaS Billing

Restaurants eventually pay using Stripe. V1 supports a 14-day trial, monthly subscription, early trial conversion, recurring billing, payment-state synchronization, failed-payment handling, and platform assistance for checkout.

Guest card handling and restaurant subscription billing are separate concerns.

## Responsive UI

The application must work well on desktop, tablet, and phone. Tablet usability is especially important for host-stand use.

The UI should be clean, friendly, modern, simple, fast to understand, and operationally practical.

## Explicit Non-Goals For V1

- Matching every feature of larger reservation platforms.
- Visual drag-and-drop floor plan.
- Full CRM.
- Restaurant website builder.
- SMS.
- Automatic cancellation/no-show charging.
- Multi-location accounts.
- Native mobile apps.

## Post-V1

Post-V1 work is listed in `docs/LATER.md` and must be selected only after V1 is feature-complete and stable.
