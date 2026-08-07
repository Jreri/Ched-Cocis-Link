# 07 — Payments

Provider: **Paystack** (Nigerian cards, bank transfer, USSD). Currency NGN.

## Pricing

₦3,000 per state + city, charged once. Access is permanent and covers every eligible company in that location. The amount is defined server-side in `paystack-init` as `PRICE_KOBO = 3000 * 100`; the client never sends an amount.

## Flow

```text
Placements.tsx
  └─ invoke paystack-init { state, city, callback_url }
        ├─ already paid? → { already_paid: true } and the UI unlocks immediately
        └─ Paystack initialize → { authorization_url, reference }
  └─ redirect to Paystack checkout
  └─ Paystack redirects back to callback_url?reference=…
  └─ invoke paystack-verify { reference }
        ├─ existing row for this reference → idempotent success
        ├─ verify with retry/defensive JSON parsing
        ├─ metadata.user_id must equal the caller
        └─ service-role insert into placement_access
  └─ UI updates in place (no reload) and auto-scrolls to the revealed company list
```

## Guarantees

- **No double charging** — `paystack-init` short-circuits when access already exists.
- **Idempotent verification** — `placement_access.paystack_reference` is unique, and verify treats an already-present row as success, including in a concurrent race.
- **Ownership check** — a reference whose metadata belongs to another user is rejected with `403`.
- **Resilience** — Paystack HTML/5xx responses are parsed defensively and retried twice with backoff, surfacing a friendly "try again in a moment" message instead of a crash.
- **Client cannot grant access** — `placement_access` has no client insert/update/delete policy; only the service role in `paystack-verify` writes to it.

## After payment

`get_my_unlocked_locations()` powers the dashboard's unlocked-location cards (each deep-links to the filtered company list), and `get_unlocked_companies(state, city)` reveals full company details including address and contact information. `useLiveData` refetches on tab focus so access appears even if the user completed payment in another tab.
