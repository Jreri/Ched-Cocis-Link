# 06 — Auth & roles

## Provider

Email + password via Supabase Auth (GoTrue). No anonymous sign-ups. Sessions are persisted in localStorage by the generated client and auto-refreshed.

## Signup

`Auth.tsx` collects full name, department, level and institution and passes them as user metadata. The `on_auth_user_created` trigger runs `handle_new_user()`, which:

1. Inserts a `profiles` row with those metadata values.
2. Inserts a `user_roles` row — the very first user ever created becomes `admin`, everyone afterwards becomes `student`.

## Role model

Roles live in a dedicated `user_roles` table, never on `profiles`, to prevent privilege escalation. All checks go through the `has_role(_user_id, _role)` SECURITY DEFINER function, which is also used inside RLS policies without causing recursion.

## Access control

- **Database:** RLS policies on every table, plus SECURITY DEFINER gating functions for company data.
- **Routing:** `RequireRole` resolves the session and role, then routes anonymous users to `/login`, wrong-role users to the other role's home, and correct-role users to the page.
- **Navigation:** `Header` swaps between public, student and admin link sets based on the live session and `has_role`.
- **Login redirect:** after sign-in, `Auth.tsx` calls `has_role` and sends admins to `/admin`, students to `/dashboard`.

## Admin access

There is no public admin link. Admins reach the console via:

- `Ctrl + Shift + A` anywhere on the site (registered in `Header`), or
- five rapid clicks on the hidden trigger in the footer.

Both simply navigate to `/admin`, which is still role-gated — the shortcuts are convenience, not security.

## Password reset

1. `/forgot-password` calls `resetPasswordForEmail` with a redirect to `/reset-password`.
2. The emailed link establishes a recovery session.
3. `/reset-password` calls `updateUser({ password })` and redirects to sign-in.

## Profile lock

Personal and academic fields (name, phone, date of birth, address, university, institution, department, level, matric number) can be saved once. `Profile.tsx` shows a one-time-update confirmation dialog; afterwards `profile_locked` is true and the `enforce_profile_lock()` trigger raises an exception on any further change from a non-admin. Administrators can still edit these fields.
