# ChedLink (CCL)

ChedLink is a placement platform that connects Nigerian students with vetted companies for SIWES, Industrial Training (IT) and internship placements. It is built by **Ched Technology** in collaboration with **COCIS**.

Students register, complete a profile, browse placements that are relevant to *their department only*, unlock a state/city for a one-off ₦3,000 Paystack payment, and then submit a complete application package (personal details, academic details, internship details, and supporting documents) which is emailed directly to the company's HR/internship address.

---

## Quick start

```bash
npm install        # or bun install
npm run dev        # start Vite dev server on http://localhost:8080
npm run build      # production build
npm run build:dev  # development-mode build
npm run lint       # ESLint
npm run preview    # preview the production build
```

No `.env` file needs to be created by hand — the backend connection variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) are generated and managed by Lovable Cloud. Server-side secrets live in the backend secret store, never in the repo.

## Stack at a glance

| Layer | Technology |
| --- | --- |
| UI framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) |
| Styling | Tailwind CSS 3 + custom HSL design tokens |
| Components | shadcn/ui on Radix UI primitives |
| Routing | React Router 6 |
| Server state | TanStack Query + a custom `useLiveData` hook |
| Forms & validation | React Hook Form + Zod |
| Backend | Lovable Cloud (Supabase): Postgres, Auth, Storage, Edge Functions |
| Payments | Paystack (NGN, cards / bank / USSD) |
| Email | Resend (HTML transactional email) |
| CSV import | PapaParse |

## Documentation index

| Document | What it covers |
| --- | --- |
| [01 — Architecture](docs/01-architecture.md) | System diagram, request flows, folder layout, full route map |
| [02 — Tech stack](docs/02-tech-stack.md) | Every dependency and dev dependency with version and purpose |
| [03 — Frontend](docs/03-frontend.md) | Every page and component, hooks, design tokens, typography |
| [04 — Database](docs/04-database.md) | Tables, columns, enums, indexes, RLS policies, grants, triggers, functions |
| [05 — Edge functions](docs/05-edge-functions.md) | `paystack-init`, `paystack-verify`, `submit-application`, `seed-accounts` |
| [06 — Auth & roles](docs/06-auth-and-roles.md) | Signup trigger, role model, route guards, admin access, password reset |
| [07 — Payments](docs/07-payments.md) | The Paystack unlock flow end to end |
| [08 — Applications & email](docs/08-applications-and-email.md) | Submission pipeline, documents, HR and student emails |
| [09 — Admin guide](docs/09-admin-guide.md) | Company CRUD, department assignment, CSV bulk import, requirements |
| [10 — Operations](docs/10-operations.md) | Secrets, deployment, seeding, limits, known security warnings |

## Core product rules

1. A student only ever sees companies whose eligible-department list includes their own department.
2. Company identity and contact details stay hidden until the student has paid to unlock that company's state + city.
3. Payment is ₦3,000 per state + city, one-off and permanent.
4. A student may apply to a given company only once.
5. Personal and academic profile details can be set once, then lock; only an administrator can change them afterwards.
