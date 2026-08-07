# 01 — Architecture

## System overview

```text
                          ┌────────────────────────────┐
                          │   Browser (React 18 SPA)   │
                          │  Vite • Tailwind • shadcn  │
                          └─────────────┬──────────────┘
                                        │ supabase-js (HTTPS)
                                        │ JWT in Authorization header
        ┌───────────────────────────────┼────────────────────────────────┐
        │                               │                                │
        ▼                               ▼                                ▼
┌───────────────┐            ┌──────────────────────┐        ┌────────────────────┐
│  Auth (GoTrue)│            │ Postgres + PostgREST │        │  Storage (private) │
│ email+password│            │  RLS on every table  │        │ applicant-documents│
└───────┬───────┘            │  SECURITY DEFINER    │        └─────────┬──────────┘
        │ on signup trigger  │  gating functions    │                  │ signed URLs
        ▼                    └──────────┬───────────┘                  │
┌────────────────┐                      │                              │
│ profiles +     │                      │                              │
│ user_roles     │                      ▼                              │
└────────────────┘        ┌──────────────────────────────┐             │
                          │   Edge Functions (Deno)      │◄────────────┘
                          │  paystack-init               │
                          │  paystack-verify             │
                          │  submit-application          │
                          │  seed-accounts               │
                          └──────┬─────────────────┬─────┘
                                 │                 │
                                 ▼                 ▼
                          ┌─────────────┐   ┌─────────────┐
                          │  Paystack   │   │   Resend    │
                          │  payments   │   │   email     │
                          └─────────────┘   └─────────────┘
```

## The three gates

Every student-facing read of company data passes through three independent gates, all enforced in the database rather than in the browser:

1. **Active** — `companies.is_active = true`.
2. **Department** — `company_visible(company_id)` requires a row in `company_departments` matching the caller's `profiles.department_id`.
3. **Payment** — `has_paid_for(state, city)` requires a `placement_access` row for the caller.

Browsing functions apply gates 1 and 2 (and return a boolean `is_unlocked`). Detail functions apply all three.

## Primary flows

### Registration → dashboard

```text
Auth.tsx signUp ──► GoTrue creates auth.users row
                     └─► trigger on_auth_user_created → handle_new_user()
                          ├─ INSERT profiles (full_name, department_id, level, institution)
                          └─ INSERT user_roles (first ever user = admin, else student)
Auth.tsx then calls has_role() and redirects: admin → /admin, student → /dashboard
```

### Unlock a location

```text
Placements.tsx ─► get_available_states()  (counts filtered by department)
              ─► get_available_cities(state)
              ─► invoke paystack-init { state, city, callback_url }
                   └─► Paystack checkout (₦3,000)
              ◄─ redirect back with ?reference=…
              ─► invoke paystack-verify { reference }
                   └─► service role inserts placement_access (idempotent)
              ─► get_unlocked_companies(state, city) → full details revealed
```

### Apply to a company

```text
Apply.tsx ─► get_unlocked_company(id) + get_company_requirements(id)
          ─► merge with CANONICAL_FIELDS → renders the form, pre-filled from profiles
          ─► uploads files to storage bucket applicant-documents/{uid}/…
          ─► invoke submit-application { company_id, info, document_paths }
                ├─ duplicate check on applications
                ├─ company_visible + has_paid_for + get_unlocked_company revalidation
                ├─ 7-day signed URLs for each document
                ├─ Resend → company internship_email  (HR package)
                ├─ Resend → student email             (confirmation receipt)
                └─ INSERT applications (snapshot + documents + sent_to_email)
```

## Repository layout

```text
.
├── index.html                  Document head, SEO/OG meta, font preloads
├── vite.config.ts              Vite config, port 8080, @ alias, lovable-tagger
├── tailwind.config.ts          Design tokens mapped to CSS variables
├── src/
│   ├── main.tsx                React root
│   ├── App.tsx                 Providers + full route table
│   ├── index.css               Design system: colours, gradients, shadows, animations
│   ├── assets/                 Static images
│   ├── components/
│   │   ├── ui/                 shadcn/ui primitives (Radix based)
│   │   └── *.tsx               App components (Header, Footer, Hero, …)
│   ├── hooks/                  use-mobile, use-toast, useLiveData
│   ├── integrations/supabase/  Auto-generated client.ts and types.ts (never edit)
│   ├── lib/
│   │   ├── applicationFields.ts  Canonical application field catalogue + merge logic
│   │   └── utils.ts              cn() class merge helper
│   └── pages/                  One file per route
├── supabase/
│   ├── config.toml             Project binding (auto-generated)
│   ├── migrations/             Ordered SQL migrations
│   └── functions/              Deno edge functions
└── docs/                       This documentation
```

## Route map

| Path | Page | Access |
| --- | --- | --- |
| `/` | `Index` | Public |
| `/about` | `About` | Public |
| `/contact` | `Contact` | Public |
| `/help` | `Help` | Public |
| `/terms` | `Terms` | Public |
| `/privacy` | `Privacy` | Public |
| `/how-to-apply` | `HowToApply` | Public |
| `/login` | `Auth` (sign-in mode) | Public |
| `/register` | `Auth` (sign-up mode) | Public |
| `/forgot-password` | `ForgotPassword` | Public |
| `/reset-password` | `ResetPassword` | Public (recovery link) |
| `/placements` | `Placements` | Student |
| `/dashboard` | `Dashboard` | Student |
| `/profile` | `Profile` | Student |
| `/apply/:companyId` | `Apply` | Student |
| `/applications` | `MyApplications` | Student |
| `/admin` | `Admin` | Admin |
| `/admin/applications` | `AdminApplications` | Admin |
| `*` | `NotFound` | Public |

Role gating is done by `RequireRole`, which wraps student and admin routes. `ScrollToTop` resets the scroll position on every navigation.

## Application-level providers

Defined in `src/App.tsx`, in order: `QueryClientProvider` (TanStack Query) → `TooltipProvider` → shadcn `Toaster` + Sonner `Toaster` → `BrowserRouter` → `ScrollToTop` → `Routes`.
