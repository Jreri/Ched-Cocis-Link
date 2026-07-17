# Placement Finder — Gated Access Build

## 1. Backend (Lovable Cloud)

**Tables** (all in `public`, RLS on, grants set):

- `departments` — `id, name, slug`
- `companies` — `id, name, address, city, state, lga, business_district, description, contact_email, contact_phone, logo_url, is_active, created_at`
- `company_departments` — `company_id, department_id` (many-to-many)
- `profiles` — `id (auth uid), full_name, department_id, created_at`
- `user_roles` — `user_id, role` (`admin` | `student`) via `has_role()` security-definer fn
- `placement_access` — `user_id, state, city, paid_at, amount, paystack_reference` (one row per paid location unlock)

**Auto-provision**: trigger creates `profiles` row on signup.

**Security-definer RPCs** used by the frontend (so companies remain hidden pre-payment):

- `get_available_states()` → `[{ state, count }]` filtered by caller's department
- `get_available_cities(state)` → `[{ city, count }]`
- `get_unlocked_companies()` → full company rows only for `(state, city)` pairs the user has paid for
- `has_paid_for(state, city)` → boolean

Direct SELECT on `companies` is blocked by RLS except for admins; students only ever read through the RPCs above, which strip company data unless payment exists.

## 2. Payments (Paystack)

Two edge functions:

- `paystack-init` — auth-required. Body: `{ state, city }`. Verifies placements exist for user's department, calls Paystack `/transaction/initialize` with ₦3,000 and metadata `{user_id, state, city}`, returns `authorization_url`.
- `paystack-verify` — public. Body: `{ reference }`. Calls Paystack `/transaction/verify/:ref`. On success, inserts into `placement_access` (idempotent on reference).

`PAYSTACK_SECRET_KEY` stored via `add_secret`. Frontend redirects to Paystack, callback returns to `/payment/callback?reference=...` which calls verify then routes to unlocked view.

## 3. Frontend flow

- `/auth` — sign up collects `full_name` + `department` (only CS + Cybersecurity in dropdown for now, driven from DB).
- `/finder` — after login: shows department, list of states with counts (from RPC). Click → cities with counts. Click city → summary card ("N placements available") + Pay ₦3,000 button (or "Unlocked — view companies" if already paid).
- `/finder/:state/:city` — unlocked view listing companies (name, address, contact, description). 403-style locked screen if not paid.
- `/dashboard` — shows unlocked locations + link back to finder.
- `/admin` — admin-only. CRUD for companies (name, address auto-parsed into state/city/LGA, department multi-select), departments, and a table of paid access records.

Old mock pages (`SearchResults`, `CompanyProfile`, `AdvancedSearch`, `BrowseByLocation`, `CompanyComparison`, `ApplicationStatus`) get either removed from nav or redirected to `/finder` since they conflict with the gated model. I'll keep static pages (About, Help, Terms, Privacy, HowToApply, SuccessStories, Contact).

## 4. Seed data

Parse the ~200-line list you pasted. For each entry extract `name` and `address`, then derive:
- `state` — regex on trailing "…, X State" / "Abuja" / "FCT"
- `city` — token before state (Ikeja, Yaba, Victoria Island, Ikorodu, etc.)
- `lga` / `business_district` — best-effort from known Lagos LGAs; null when unclear

All seeded companies tagged with both **Computer Science** and **Cyber Security**. Duplicate names at different addresses are kept as separate rows (they're different branches).

First user to sign up gets promoted to `admin` automatically (via seed check), then admin management is manual.

## 5. Build order

1. Enable Lovable Cloud + create schema migration + grants + RLS + RPCs.
2. Seed departments + parse and insert companies + tag all with CS/Cyber.
3. Request `PAYSTACK_SECRET_KEY` (test key is fine to start).
4. Auth page with department selection + profile trigger.
5. `/finder` states → cities → location summary → pay button.
6. Paystack init + verify edge functions + `/payment/callback` route.
7. Unlocked company view with RLS-safe RPC.
8. Admin CRUD page.
9. Redirect / clean up legacy mock pages.

## Notes / trade-offs

- I'll ask for your Paystack test secret key in a later turn (after the DB and UI shell exist, so you're not blocked waiting on it).
- Address parsing is heuristic; some rows may need admin cleanup afterward. That's what the admin UI is for.
- The ₦3,000 fee unlocks one `(state, city)` pair, matching your spec ("the location they paid to access").
- This is multiple turns of work. I'll ship it in the order above, checking in after the DB + seed and again after payments are wired.

Approve this and I'll start with enabling Cloud and the schema migration.
