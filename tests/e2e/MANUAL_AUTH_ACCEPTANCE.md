# Manual Auth Acceptance Checklist

These checks require a configured Supabase project and access to the email inbox used during testing.

## Supabase Auth Configuration

Before running the email-link checks, confirm Supabase Auth is configured to use the browser-facing app and API URLs.

For the app:

- `NEXT_PUBLIC_APP_URL` should match the app origin used in the browser, usually `http://localhost:3000`.
- `NEXT_PUBLIC_SUPABASE_URL` should be the browser-facing Supabase API origin, not an internal Docker hostname.

For Supabase Auth:

- Site URL should be `http://localhost:3000` for local manual testing.
- Redirect URLs should allow `http://localhost:3000/auth/callback`.
- Self-hosted Supabase must use a public Auth API external URL in email links. Recent self-hosted Supabase configs expect `API_EXTERNAL_URL` to include the auth path, for example `https://your-supabase-domain.example/auth/v1`.

If a verification email opens `http://supabase-kong:8000/auth/v1/verify?...`, Supabase is generating links with its internal container-network URL. Update the self-hosted Supabase `API_EXTERNAL_URL` or equivalent Auth external URL setting, restart the Supabase auth service, then request a fresh verification email.

## Signup And Verification

1. Open `/signup`.
2. Enter a valid email and password.
3. Submit the form.
4. Confirm the app shows `/verify-email`.
5. Confirm the Supabase verification email arrives.
6. Click the verification link.
7. Confirm the browser lands on `/app`.

## Session

1. While signed in, refresh the browser.
2. Confirm `/app` still loads.
3. Open `/app` directly in the address bar.
4. Confirm it still loads.

## Logout

1. Click `Log out`.
2. Confirm redirect to `/login`.
3. Refresh the browser.
4. Confirm the user remains logged out.
5. Open `/app`.
6. Confirm redirect to `/login`.

## Login

1. Open `/login`.
2. Enter valid credentials.
3. Confirm login succeeds and lands on `/app`.
4. Try a wrong password and confirm a clean inline error appears.

## Password Reset

1. Open `/forgot-password`.
2. Submit the account email.
3. Confirm the reset email arrives.
4. Click the reset link.
5. Confirm `/reset-password` loads with the password form.
6. Enter matching new passwords.
7. Confirm the user lands on `/app`.
8. Log out and confirm the new password works on `/login`.

## Failure States

1. Visit `/auth/callback` without query parameters and confirm a clean login error.
2. Visit `/reset-password` without a recovery session and confirm it offers another reset email.
3. Submit mismatched passwords on `/signup` and `/reset-password`.
