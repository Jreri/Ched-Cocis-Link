
## ChedLink cleanup + completion plan

Five clusters, done in this order so each phase leaves the app in a working state.

### 1. Rebrand & visual bug cleanup

- `src/pages/Dashboard.tsx`: title → "Dashboard — ChedLink"; drop the 👋 to match editorial tone.
- `src/pages/Auth.tsx`: title → "Sign in — ChedLink"; heading + copy → ChedLink / CCL wording.
- `src/pages/Placements.tsx`: replace `font-serif` classes with `font-display` used across the rebrand.
- `src/components/Header.tsx`: when the signed-in user has the `admin` role (checked via `has_role` RPC), show a subtle `Admin` link in the desktop nav + drawer. Also register a global `Ctrl+Shift+A` shortcut that navigates to `/admin` (works for anyone; the page itself is already role-gated).

### 2. Register — department dropdown fix

Current bug: on `/register`, the department Select is populated by a `.then` on a Supabase promise that Supabase JS actually returns as a thenable but not a real Promise — combined with Radix Select mounting inside a portal, users have reported the list looks empty or the selected value doesn't stick.

Fix in `src/pages/Auth.tsx`:
- Rewrite the fetch as `useEffect(() => { (async () => { const { data } = await supabase.from("departments")…; setDepartments(data ?? []) })() }, [])`.
- Add a loading state so the trigger shows "Loading departments…" until the list arrives, and a fallback message if the list is empty (with a link to Contact).
- Ensure `SelectContent` has `className="z-[70] bg-popover"` so it renders above the auth card on mobile.
- Confirm the selected `departmentId` survives tab switch between Sign in / Create account.

### 3. Applications on Dashboard + Admin

**Dashboard** (`src/pages/Dashboard.tsx`)
- Add a "Your applications" section below unlocked locations.
- Query: `applications` joined to `companies` for name/city/state; ordered by `created_at desc`, limited to 10.
- Show company, position (from snapshot), sent-to email, status badge, submitted date.

**Admin** (new route + page)
- Add `/admin/applications` route in `src/App.tsx`.
- New file `src/pages/AdminApplications.tsx` with the same admin gate as `Admin.tsx`.
- Table: applicant name/email, company, state/city, status, submitted date, expandable row with the snapshot info + document links (generated via signed URLs from an existing or new edge function).
- Status dropdown to update `applications.status` between `sent`, `reviewed`, `accepted`, `rejected`.
- Add a link to `/admin/applications` from the main `/admin` header.

Schema/DB:
- Add `UPDATE` policy on `applications` for admins only.
- Add a small edge function `application-docs` that admins call with an application id and it returns signed URLs for that application's documents (7-day). Avoids exposing storage paths directly.

### 4. Email deliverability

`submit-application` currently uses `from: "ChedLink <onboarding@resend.dev>"`, which only delivers to the Resend account owner. Two paths:

- **Recommended**: switch to Lovable Emails. Run `email_domain--check_email_domain_status`, then if no domain is set up, present the email setup dialog. Rewrite `submit-application` to call `send-transactional-email` with a new `intern-application` React Email template that renders the same content (applicant info table + signed doc links). Registered subject "Ched-COCIS Link: Intern Application".
- **Alternative** (only if the user prefers Resend): request they add a verified domain in Resend, then swap the `from` to `applications@<their-domain>`.

Will do Lovable Emails by default; user can override in-thread.

### 5. Admin completeness

- **Departments CRUD** — new tab/section in `/admin`: list existing departments, add, rename, toggle `is_active`. All admin-only via existing `has_role` policies.
- **Slots** — expose `companies.slots` in the Admin dialog (`Field label="Slots"`, numeric).
- **Logo upload** — replace the freeform `logo_url` with a file input that uploads to a new public `company-logos` bucket via `storage_create_bucket`, stores the resulting public URL.
- **Password reset** — add `Forgot password?` link on Auth page → new `/forgot-password` page (`resetPasswordForEmail` with `redirectTo: /reset-password`) + `/reset-password` page that calls `updateUser({ password })`.
- **Delete document** in `Profile.tsx` — trash icon next to each uploaded doc; removes from storage and from `profiles.documents`.

### Technical notes

- All new SQL goes through the migration tool; grants + RLS included per house rules.
- No changes to `src/integrations/supabase/client.ts` or `types.ts`.
- Ship in the order above; after each cluster the app remains fully functional.
- Not touching design tokens or the Midnight Indigo palette.

### Not in scope (call out for later)

- Admin "resend application" button.
- Duplicate-submission prevention (would need a unique index on `(user_id, company_id)` — needs a product call because users may legitimately reapply).
- Breadcrumbs and skeleton loaders — polish pass after the above lands.
