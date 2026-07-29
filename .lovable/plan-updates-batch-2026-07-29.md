# Updates Batch

## 1. Authentication accounts
- Provision the two accounts via a migration using `auth.admin` is not possible from SQL; instead, use a one-off approach: create them by inserting into `auth.users` is disallowed. Correct approach: use `supabase.auth.admin.createUser` in an edge function OR ask the user to sign up once. Simplest: create a small admin-only bootstrap edge function `seed-accounts` invoked once via curl, that creates both users with service role and assigns admin role for ikoroeric2@gmail.com. Confirm emails automatically.
- Also delete/disable pre-existing users? "Remove all existing login credentials" — we will delete all existing auth users and their profile/role rows via a migration/SQL cleanup script.

## 2. Sidebar full-height fix
- Ensure the mobile sheet / sidebar overlay uses `position: fixed; inset: 0; height: 100dvh` and locks body scroll. Audit `Header.tsx` mobile menu and any Sheet usage.

## 3. Dashboard
- Remove `<NextStepsJourney />` usage from `Dashboard.tsx`.
- Unlocked City cards link to `/placements?state=X&city=Y` and Placements page auto-selects from URL params and scrolls to the companies list.

## 4. Application form
- In `Apply.tsx`, replace free-text `internship_duration` input with a dropdown (2–6 months + Custom) and add an `internship_type` dropdown (SIWES / NYSC / Other).
- Also update `Profile.tsx` similarly for consistency.
- Add `internship_type` column to `profiles` and store in application snapshot.

## 5. Placement flow after payment
- After Paystack verify success in `Placements.tsx`, auto-select the paid location, refetch unlocked companies, and smooth-scroll to the companies section with a highlight.

## 6. Mobile responsiveness pass
- Audit `Header`, `Hero`, `Dashboard`, `Placements`, `Admin`, `Apply`, `Profile` for overflow, duplicated sections, spacing. Fix container padding, grid breakpoints, and any `min-w` issues.

## 7. Admin CSV bulk upload
- In `Admin.tsx` add a "Bulk upload CSV" button opening a file picker.
- Parse CSV client-side (papaparse). Columns: `name,address,state,city,hr_email,requirements,internship_position,instructions,departments` (departments as comma-separated names).
- For each row: insert into `companies` with `internship_email = hr_email`; look up department IDs by name and insert `company_departments` rows.
- Existing `submit-application` already sends to `company.internship_email`, so HR routing works automatically.

## Out of scope / notes
- No changes to Paystack pricing or admin RLS.
- Existing `applications`, `placement_access` rows will be orphaned when we wipe users — we'll cascade-delete them in the cleanup migration.
