# 05 — Edge functions

Deno functions in `supabase/functions/`. All are JWT-authenticated (except `seed-accounts`, a one-shot bootstrap), return JSON, and handle CORS preflight.

## `paystack-init`

Starts a Paystack checkout for one state + city.

- **Input:** `{ state, city, callback_url }` with a `Bearer` access token.
- **Behaviour:** verifies the token via `auth.getClaims`; short-circuits with `{ already_paid: true }` if a `placement_access` row exists; otherwise calls `POST https://api.paystack.co/transaction/initialize` for `300000` kobo (₦3,000) in NGN, attaching `metadata: { user_id, state, city }`.
- **Output:** `{ authorization_url, reference }`, or `401 / 400 / 502 / 500` with `{ error }`.
- **Secrets:** `PAYSTACK_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## `paystack-verify`

Confirms a payment and grants access.

- **Input:** `{ reference }` with a `Bearer` token.
- **Behaviour:**
  1. Idempotency — if a `placement_access` row already exists for this user + reference, returns success immediately (`already_recorded: true`).
  2. Calls Paystack verify through `paystackGet`, which reads the body as text and parses defensively (Paystack sometimes returns HTML on bad keys, 5xx or WAF blocks), retrying up to twice with 600ms/1200ms backoff.
  3. Rejects if `metadata.user_id` does not match the caller (`403`).
  4. Inserts `placement_access` with the service role, since the table has no client insert policy. If a concurrent verify won the race, the existing row is treated as success.
- **Output:** `{ success: true, state, city }`, `{ success: false, status }` for unsuccessful charges, or an error.
- **Secrets:** `PAYSTACK_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## `submit-application`

Validates, emails and records an internship application.

- **Input:** `{ company_id, info, document_paths }` with a `Bearer` token.
- **Validation chain (never trusts the client):**
  1. Duplicate check — one application per user per company, else `409`.
  2. `company_visible(company_id)` as the caller — department eligibility, else `403`.
  3. Company must exist and be active, else `404`; `has_paid_for(state, city)` must be true, else `402`.
  4. Final gated `get_unlocked_company(company_id)` re-read, else `403`; applications must be enabled and `internship_email` configured, else `400`.
- **Documents:** each stored path is turned into a 7-day signed URL with the service role.
- **Emails (Resend):** a grouped HR package (Personal / Academic / Internship / Additional Information plus a documents block) to the company's `internship_email` with subject `Ched-COCIS Link: Intern Application`, and a branded confirmation receipt to the student.
- **Record:** inserts `applications` with the info snapshot, document map, `status`, and `sent_to_email`.
- **Secrets:** `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## `seed-accounts`

One-shot bootstrap that provisions the fixed admin and demo student accounts with confirmed emails, upserts their profiles and sets their `user_roles` entry. Safe to re-run — existing users are looked up rather than recreated. Uses the service role only.
