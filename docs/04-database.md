# 04 — Database

Postgres, managed by Lovable Cloud. Every schema change is an ordered SQL migration in `supabase/migrations/`. Row Level Security is enabled on every table in `public`, and every table also carries explicit `GRANT`s (RLS alone is not enough for the Data API).

## Enums

| Type | Values |
| --- | --- |
| `app_role` | `admin`, `student` |
| `field_kind` | `document`, `info`, `custom` |
| `field_requirement` | `required`, `optional`, `hidden` |

## Tables

### `departments`

Academic departments a student can belong to and a company can accept.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK, `gen_random_uuid()` |
| `name` | text | NOT NULL, UNIQUE |
| `slug` | text | NOT NULL, UNIQUE |
| `is_active` | boolean | default `true` |
| `created_at` | timestamptz | default `now()` |

Grants: `SELECT` to `anon`, `authenticated`; `ALL` to `service_role`.
Policies: `departments_read_all` (SELECT, everyone), `departments_admin_write` (ALL, admins).

### `companies`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `name` | text | NOT NULL, unique-constrained to prevent duplicate imports |
| `address` | text | NOT NULL |
| `state` | text | NOT NULL |
| `city`, `lga`, `business_district` | text | Location breakdown; `city` falls back to `'Other'` in all functions |
| `description` | text | Public-facing blurb |
| `contact_email`, `contact_phone` | text | General contact |
| `logo_url` | text | Optional logo |
| `internship_email` | text | Where applications are sent; required for a company to accept applications |
| `internship_position` | text | Role title shown in the directory |
| `instructions` | text | Company-specific applicant instructions |
| `slots` | integer | Available intern slots |
| `applications_enabled` | boolean | NOT NULL default `true` |
| `is_active` | boolean | NOT NULL default `true` |
| `created_at`, `updated_at` | timestamptz | `updated_at` maintained by `trg_companies_updated` |

Indexes: `idx_companies_state`, `idx_companies_city`.
Grants: `SELECT, INSERT, UPDATE, DELETE` to `authenticated`; `ALL` to `service_role`.
Policy: `companies_admin_all` (ALL, admins only). Students never read this table directly — they go through the SECURITY DEFINER functions below.

### `company_departments`

Join table controlling which departments may see a company.

| Column | Type |
| --- | --- |
| `company_id` | uuid → `companies.id` |
| `department_id` | uuid → `departments.id` |

Index: `idx_cd_department`. Policy: `company_departments_admin_all` (admins).

### `company_requirements`

Per-company overrides of the canonical application fields.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `company_id` | uuid | → `companies.id` |
| `field_key` | text | Canonical or generated key |
| `kind` | `field_kind` | |
| `label` | text | Display label |
| `requirement` | `field_requirement` | default `optional`; `hidden` removes the field |
| `sort_order` | integer | default 0 |
| `created_at` | timestamptz | |

Policies: `req_read_authed` (SELECT, any authenticated user), `req_admin_all` (ALL, admins).

### `requirement_library`

Reusable named requirements used when resolving CSV import tokens.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `name` | text | NOT NULL; unique on `lower(btrim(name))` |
| `field_key` | text | Stable key |
| `kind` | `field_kind` | default `document` |
| `created_at` | timestamptz | |

Grants: `SELECT, INSERT, UPDATE, DELETE` to `authenticated`; `ALL` to `service_role`.
Policies: `reqlib_read_authed` (SELECT), `reqlib_admin_write` (ALL, admins).

### `profiles`

One row per user, created automatically on signup.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK → `auth.users.id` |
| `full_name` | text | |
| `phone`, `address`, `date_of_birth` | text / text / date | Personal details |
| `university`, `institution`, `department_id`, `level`, `matric_number` | text / text / uuid / text / text | Academic details |
| `internship_type` | text | SIWES / NYSC / other |
| `internship_duration` | text | Dropdown value or custom text |
| `preferred_start_date`, `expected_end_date` | date | |
| `documents` | jsonb | NOT NULL default `{}` — map of field key → storage path |
| `profile_locked` | boolean | NOT NULL default `false` — set after the one-time update |
| `created_at`, `updated_at` | timestamptz | `updated_at` maintained by `trg_profiles_updated` |

Grants: `SELECT, INSERT, UPDATE` to `authenticated`; `ALL` to `service_role`.
Policies: own select (or admin), own insert, own update, `profiles_admin_update`. No delete.

### `user_roles`

Roles are deliberately stored separately from `profiles` to prevent privilege escalation.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `user_id` | uuid | → `auth.users.id` |
| `role` | `app_role` | NOT NULL; UNIQUE `(user_id, role)` |
| `created_at` | timestamptz | |

Grants: `SELECT` to `authenticated`; `ALL` to `service_role`.
Policy: `user_roles_own_select` (own rows, or admin). Insert/update/delete are denied to clients — only the signup trigger and service-role code write here.

### `placement_access`

Proof of payment for a state + city.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `user_id` | uuid | → `auth.users.id` |
| `state`, `city` | text | NOT NULL; UNIQUE `(user_id, state, city)` |
| `amount_naira` | integer | NOT NULL |
| `paystack_reference` | text | NOT NULL, UNIQUE — enforces idempotent verification |
| `paid_at` | timestamptz | default `now()` |

Index: `idx_pa_user`. Grants: `SELECT` to `authenticated`; `ALL` to `service_role`.
Policy: own select (or admin). Insert/update/delete denied to clients — only `paystack-verify` writes here, using the service role.

### `applications`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | PK |
| `user_id` | uuid | → `auth.users.id` |
| `company_id` | uuid | → `companies.id` |
| `snapshot` | jsonb | NOT NULL — the exact info submitted, frozen at submission time |
| `documents` | jsonb | NOT NULL default `{}` — field key → storage path |
| `status` | text | NOT NULL default `'sent'` |
| `sent_to_email` | text | The company address the package went to |
| `created_at` | timestamptz | default `now()` |

Policies: `app_own_insert`, `app_own_select` (own rows or admin), `app_admin_update`. No delete.

## Database functions

All are `SECURITY DEFINER` with `SET search_path = public`, which lets them read `companies` while the table itself stays admin-only under RLS.

| Function | Returns | Purpose |
| --- | --- | --- |
| `has_role(_user_id, _role)` | boolean | Role check used by policies, guards and the header |
| `has_paid_for(_state, _city)` | boolean | Whether the caller has unlocked a location |
| `company_visible(_company_id)` | boolean | Whether the caller's department is on the company's eligible list |
| `get_available_states()` | state + count | States with at least one department-eligible active company |
| `get_available_cities(_state)` | city + count | Cities within a state, same filtering |
| `get_location_count(_state, _city)` | bigint | Eligible company count for one location |
| `browse_companies()` | directory rows | All eligible companies with an `is_unlocked` flag; hides address, contact details and internship email |
| `get_unlocked_companies(_state, _city)` | full rows | Full company details, only for a paid location |
| `get_unlocked_company(_company_id)` | full row | Single company incl. `internship_email`, `instructions`, `applications_enabled`; requires department eligibility *and* payment |
| `get_company_requirements(_company_id)` | requirement rows | Non-hidden requirement overrides for a company |
| `get_my_unlocked_locations()` | locations | Caller's paid locations with live eligible-company counts |
| `handle_new_user()` | trigger | On signup: inserts `profiles` from user metadata and assigns a role — the very first user becomes `admin`, everyone after is `student` |
| `enforce_profile_lock()` | trigger | Blocks changes to personal/academic fields once `profile_locked` is true; admins bypass |
| `set_updated_at()` | trigger | Maintains `updated_at` |

## Triggers

| Trigger | Table | Timing | Function |
| --- | --- | --- | --- |
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `handle_new_user()` |
| `trg_companies_updated` | `companies` | BEFORE UPDATE | `set_updated_at()` |
| `trg_profiles_updated` | `profiles` | BEFORE UPDATE | `set_updated_at()` |
| `trg_profiles_lock` | `profiles` | BEFORE UPDATE | `enforce_profile_lock()` |

## Storage

| Bucket | Public | Contents |
| --- | --- | --- |
| `applicant-documents` | No | Applicant uploads under `{user_id}/{field_key}-{timestamp}.{ext}` |

Documents are never served directly. `submit-application` mints 7-day signed URLs with the service role and embeds them in the outgoing email.
