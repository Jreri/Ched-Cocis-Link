## ChedLink (CCL) — Implementation Plan

Big rebrand + new application flow. Breaking into phases so we can ship and verify each safely.

### Phase 1 — Branding & Sidebar/Nav Fix
- Rename to **ChedLink** (CCL) — "In collaboration with COCIS" across Header, Footer, Hero, About, index.html title/meta, auth pages.
- Replace mobile menu with a proper opaque drawer: solid `bg-background`, shadow, dark backdrop overlay, `body` scroll lock while open, close on backdrop click / route change.
- Hide "Admin" link from header entirely (see Phase 5).

### Phase 2 — Database schema for applications
Migration adds:
- `companies`: `internship_email text`, `internship_position text`, `instructions text`, `slots int`, `applications_enabled bool default true`.
- `company_requirements(company_id, field_key, kind [document|info|custom], label, requirement [required|optional|hidden], sort_order)` with admin-only RLS + `authenticated SELECT` so applicants can read the config for companies they've unlocked.
- Extend `profiles`: `phone, address, date_of_birth, matric_number, university, internship_duration, preferred_start_date, expected_end_date` (keep existing `institution`/`level`).
- `applications(id, user_id, company_id, snapshot jsonb, status, created_at)` — RLS: user owns their rows, admin sees all.
- Private storage bucket `applicant-documents` with RLS keyed to `auth.uid()` folder prefix.
- Seed a canonical set of `field_key`s (passport, gov_id, siwes_letter, student_id, waec, birth_cert, cv, full_name, phone, email, address, dob, university, department, level, matric_number, duration, start_date, end_date) so admin UI can toggle per company.

### Phase 3 — Profile (auto-fill source of truth)
- Expand `/profile` with all Personal / Academic / Internship fields + document uploads to Storage. Store paths on profile so future applications reuse them.

### Phase 4 — Apply flow
- In `Placements`, each company card gets **Apply for Internship** → `/apply/:companyId`.
- `/apply/:companyId` page:
  - Loads company + its `company_requirements` (only fields not `hidden`).
  - Prefills every info field from `profiles`; user can edit before submit.
  - Shows only the document slots the company requires/allows; reuses profile documents if already uploaded, else lets user upload now (writes back to profile too).
  - Client + server validation of `required` fields.
  - On submit → edge function `submit-application`:
    - Re-validates against requirements.
    - Generates signed URLs (7-day) for each attached document.
    - Sends email via Resend to `companies.internship_email` with subject **"Ched-COCIS Link: Intern Application"**, HTML body with applicant details + document links.
    - Inserts row into `applications`.
  - Dashboard shows submitted applications list.

Requires `RESEND_API_KEY` — I'll request it when we reach this phase. Attachments go as signed links (Resend attachment size + our storage make direct attach unreliable at scale; links are professional and standard).

### Phase 5 — Admin
- Hide `/admin` from all nav. Add secret access: 5 clicks on the footer "CCL" mark within 2s opens a modal login (uses normal `supabase.auth.signInWithPassword`, then checks `has_role(admin)`); also keyboard combo `Ctrl+Shift+A`.
- Extend `/admin` company dialog:
  - New fields: `internship_email`, `internship_position`, `instructions`, `slots`, `applications_enabled`, `logo_url`.
  - Requirements editor: table of all canonical fields with a Required / Optional / Hidden radio per field + "Add custom requirement" rows.
- Seed the specified admin account: since we can't set a password server-side without the user creating it, I'll create the auth user via a one-off `supabase.auth.admin` call inside a temporary edge function, then grant `admin` role. (Alternative: user signs up with that email themselves and the first-user-becomes-admin trigger already handles it — that trigger currently exists, so if no admin has signed up yet, signing up with `ikoroeric2@gmail.com / Nwabueze1#` auto-promotes. I'll confirm state and pick the right path.)

### Phase 6 — Polish
- Loading/empty states across new pages, mobile spacing pass, breadcrumbs on Apply/Profile.

### Technical notes
- Email provider: **Resend** via connector (no domain setup pain, matches spec's professional email). Alternative if you'd rather use Lovable Emails: I can swap — same edge function, different transport.
- Documents: private bucket + signed URLs in the email (not raw attachments) so files stay auth-gated and email size stays small.
- The existing `has_role`/`user_roles` pattern stays — no role storage on profiles.

### Confirmations needed before I start
1. **Email provider**: Resend (recommended) or Lovable Emails?
2. **Documents in email**: signed download links (recommended) or actual attached files?
3. **Admin seeding**: OK for me to create the auth user server-side with the given password, or would you prefer to sign up with that email yourself (auto-promoted to admin since none exists)?
