# 10 — Operations

## Secrets

Configured in the backend secret store (names only — values are never in the repo):

| Secret | Used by |
| --- | --- |
| `PAYSTACK_SECRET_KEY` | `paystack-init`, `paystack-verify` |
| `RESEND_API_KEY` | `submit-application` |
| `LOVABLE_API_KEY` | Lovable AI Gateway (available to the project) |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEYS` | All edge functions (caller-scoped client) |
| `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEYS` | Privileged writes in `paystack-verify`, `submit-application`, `seed-accounts` |
| `SUPABASE_DB_URL`, `SUPABASE_JWKS` | Platform-managed |

Frontend environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) are auto-generated and publishable.

## Deployment

- Frontend: built with Vite and published from Lovable; the published URL serves the SPA.
- Edge functions: deployed with the project — no manual CLI step.
- Migrations: every schema change is a new file in `supabase/migrations/`, applied in filename order.

## Seeding

- `seed-accounts` provisions the fixed admin and demo student accounts and is safe to re-run.
- Companies and their department links are seeded via migrations and topped up through the admin CSV import.

## Known limits

- Email deliverability depends on the Resend sending domain; until a custom domain is verified, delivery to some providers may be restricted.
- Document signed URLs expire after 7 days — recipients should download attachments promptly.
- Paystack is the only payment provider; there is no refund or manual-grant UI, so access issues must be resolved by inserting `placement_access` server-side.

## Open security-scan warnings (reviewed, accepted)

| Warning | Assessment |
| --- | --- |
| `companies` has no non-admin SELECT policy | Intended. Students read company data only through SECURITY DEFINER functions that enforce department eligibility and payment. |
| `company_requirements` readable by any authenticated user | Intended. Requirements are non-sensitive form metadata needed to render application forms. |
| SECURITY DEFINER functions executable by `anon` / `authenticated` | Intended. Every such function scopes its result to `auth.uid()` internally; anonymous callers get empty results. |
| Function search path mutable | Applies only to `set_updated_at()`, a trivial trigger that touches no tables. All gating functions set `search_path = public`. |

## Health checklist

1. Sign up a student, confirm a profile and role row are created.
2. Browse `/placements` and confirm counts reflect the student's department only.
3. Complete a ₦3,000 unlock and confirm details reveal without a reload.
4. Submit an application and confirm both the HR email and the student receipt arrive, and the row appears under `/applications` and `/admin/applications`.
5. Attempt a second application to the same company and confirm it is rejected.
