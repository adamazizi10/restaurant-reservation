# F01 Authentication Experience

## Scope

F01 implements restaurant-user authentication only:

- Email/password signup.
- Email verification screen and resend.
- Login.
- Logout.
- Forgot password.
- Password reset after a valid recovery callback.
- Supabase auth callback handling.
- Minimal authenticated `/app` destination.
- Server-side authenticated-route handling.

F01 does not create restaurants, memberships, roles, trials, staff invitations, dashboards, reservations, billing, Stripe, or Resend application notifications.

## Routes

- `/` provides simple product entry links.
- `/signup` creates an auth user with email and password.
- `/verify-email` asks the user to verify email and can resend verification.
- `/login` signs in with email and password.
- `/forgot-password` sends password reset instructions without disclosing whether an account exists.
- `/auth/callback` exchanges Supabase callback codes or token hashes and redirects safely.
- `/reset-password` allows password update only after a valid recovery callback.
- `/app` is a minimal authenticated placeholder with logout.

## Session Rules

Server-side protection uses Supabase auth claims through the SSR cookie client. Raw session objects are not trusted for server-side authorization checks.

The Next.js proxy refreshes Supabase auth cookies for SSR requests.

Redirect parameters are restricted to safe internal paths to prevent open redirects.

Auth emails use `NEXT_PUBLIC_APP_URL` when it is set. In local development, auth emails default to `http://localhost:3000` so Supabase redirect URLs stay consistent even if a browser opens `127.0.0.1`.

## Manual Checks

Email verification and password recovery email clicks require inbox access. Use `tests/e2e/MANUAL_AUTH_ACCEPTANCE.md` after configuring Supabase redirect URLs.
