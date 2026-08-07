# 03 — Frontend

## Design system

All colour, gradient and shadow values live as HSL CSS variables in `src/index.css` and are exposed to Tailwind through `tailwind.config.ts`. Components never hardcode colours.

### Palette — "Midnight Indigo × Editorial Serif"

| Token | Value | Role |
| --- | --- | --- |
| `--background` | `40 30% 97%` | Warm ivory canvas |
| `--foreground` | `240 60% 8%` | Deep indigo text |
| `--card` / `--popover` | `40 40% 99%` | Raised surfaces |
| `--primary` | `243 75% 59%` (#4f46e5) | Electric indigo, main action colour |
| `--primary-hover` | `243 75% 52%` | Hover state |
| `--secondary` | `240 51% 24%` | Midnight indigo |
| `--accent` | `38 92% 55%` | Warm ochre editorial pop |
| `--ink` / `--ink-soft` | `240 60% 6%` / `240 40% 20%` | Editorial ink shades |
| `--muted` / `--muted-foreground` | `40 20% 93%` / `240 15% 40%` | Quiet surfaces and text |
| `--border` / `--input` / `--ring` | `240 15% 88%` / `40 20% 94%` / `243 75% 59%` | Chrome |
| `--success` | `152 60% 36%` | Positive states (unlocked, sent) |
| `--destructive` | `0 72% 51%` | Errors and delete actions |

Gradients: `--gradient-primary`, `--gradient-hero`, `--gradient-card`, `--gradient-ink`.
Shadows: `--shadow-soft`, `--shadow-medium` and further elevation tokens, all indigo-tinted rather than neutral grey.

### Typography

- Display / headings: **DM Serif Display** (`font-display`, `font-serif`)
- Body / UI: **Fira Sans** (`font-sans`)
- Editorial conventions used throughout: oversized serif H1s, small uppercase tracked labels (`text-xs uppercase tracking-[0.18em]`), and "BigStat" numeric callouts on dashboards.

## Pages

| File | Route | Description |
| --- | --- | --- |
| `Index.tsx` | `/` | Landing page composed of `Header`, `Hero`, `Features`, `HowItWorks`, `Pricing`, `CTA`, `Footer` |
| `About.tsx` | `/about` | Mission, Ched Technology × COCIS collaboration |
| `Contact.tsx` | `/contact` | Contact form with Zod validation and toast feedback |
| `Help.tsx` | `/help` | FAQ accordion |
| `HowToApply.tsx` | `/how-to-apply` | Step-by-step guide to the placement journey |
| `Terms.tsx` / `Privacy.tsx` | `/terms`, `/privacy` | Legal copy rendered with typography styles |
| `Auth.tsx` | `/login`, `/register` | Sign-in and sign-up. Sign-up collects full name, department (from `departments`), level and institution as user metadata. After auth it calls `has_role` and redirects by role |
| `ForgotPassword.tsx` | `/forgot-password` | Sends a Supabase recovery email pointing at `/reset-password` |
| `ResetPassword.tsx` | `/reset-password` | Consumes the recovery session and calls `updateUser({ password })` |
| `Dashboard.tsx` | `/dashboard` | Student home: profile snapshot, unlocked locations (each deep-links into the matching filtered company list), latest 10 applications |
| `Placements.tsx` | `/placements` | The core discovery flow: states → cities → payment → unlocked company list, with search by city/area and by company name once unlocked, plus auto-scroll to results after payment |
| `Profile.tsx` | `/profile` | Personal, academic, internship and document details. Enforces the one-time-update confirmation and shows locked fields afterwards |
| `Apply.tsx` | `/apply/:companyId` | Dynamic application form generated from company requirements, pre-filled from the profile, with document upload and submission |
| `MyApplications.tsx` | `/applications` | Student's submission history with status and destination email |
| `Admin.tsx` | `/admin` | Admin console: company CRUD, department assignment, requirement overrides, CSV bulk import |
| `AdminApplications.tsx` | `/admin/applications` | Read-only list of every submitted application with applicant details |
| `NotFound.tsx` | `*` | 404 |

## Components

| File | Description |
| --- | --- |
| `Header.tsx` | Sticky, scroll-aware navigation. Swaps between public, student and admin link sets based on the session and `has_role`. Mobile drawer is opaque, locks body scroll and closes on route change. Registers the `Ctrl+Shift+A` admin shortcut |
| `Footer.tsx` | Site footer, legal links, and the hidden 5-click admin trigger |
| `Hero.tsx` | Landing hero with gradient ink background and primary calls to action |
| `Features.tsx` | Bento-style feature grid |
| `HowItWorks.tsx` | Three-step explanation of the placement journey |
| `Pricing.tsx` | ₦3,000 per-location unlock explanation |
| `CTA.tsx` | Closing conversion band |
| `CompanyDirectory.tsx` | Full company directory for students. Calls `browse_companies()` plus `company_requirements`; unlocked rows show details and an Apply action, locked rows show a masked card with an unlock prompt |
| `CompanyRequirements.tsx` | Renders the resolved requirement list for a company |
| `NextStepsJourney.tsx` | Role-aware stepper guiding Find Placement → Unlock → Apply → Track |
| `RequireRole.tsx` | Route guard. Resolves the session, calls `has_role`, and routes: anonymous → `/login`, wrong role → the other role's home, correct role → children. Shows a spinner while resolving |
| `ScrollToTop.tsx` | Scrolls to the top on every pathname change |
| `ui/*` | shadcn/ui primitives |

## Hooks

| Hook | Description |
| --- | --- |
| `useLiveData(loader, deps)` | Runs `loader` on mount and again whenever the tab regains focus or becomes visible, so the UI reflects backend state without a manual refresh. Returns `{ loading, refresh }`; `refresh()` is called after every successful mutation. Re-entrancy is guarded with a ref |
| `use-mobile` | Viewport breakpoint detection |
| `use-toast` | shadcn toast state (Sonner is used for most user-facing feedback) |

## `src/lib/applicationFields.ts`

The single source of truth for application fields, shared by `Apply`, `Profile` and `Admin`.

- `CANONICAL_FIELDS` — the full catalogue. Each entry has `key`, `label`, `kind` (`info` | `document` | `custom`), a `default` requirement (`required` | `optional` | `hidden`), an optional `input` type, and an optional `profileKey` used for auto-fill.
  - Personal: full name, phone, email, residential address, date of birth.
  - Academic: university, department, level, matric number.
  - Internship: internship type, expected duration, preferred start date, expected end date.
  - Documents: passport photograph, government ID, SIWES/IT introduction letter, student ID card, WAEC result, birth certificate, CV.
- `DEFAULT_INFO_KEYS` — fields that appear on every form and can never be hidden by a company.
- `requirementFieldKey(name)` — turns free text into a stable key, e.g. `"Police Clearance"` → `doc_police_clearance`.
- `resolveDocumentKeys(input)` — resolves a free-text CSV requirements string into canonical document keys by key, label, alias (`cv`, `resume`, `nin`, `siwes`, `waec`, …) or partial match; returns matched keys plus unmatched tokens.
- `mergeRequirements(overrides)` — merges canonical defaults with a company's `company_requirements` rows, allowing companies to hide fields, change requirement levels, and add extra custom fields.

## Data access conventions

- Import the client with `import { supabase } from "@/integrations/supabase/client"`. `client.ts` and `types.ts` are generated — never edit them.
- Gated reads always go through RPCs (`browse_companies`, `get_available_states`, `get_available_cities`, `get_unlocked_companies`, `get_unlocked_company`, `get_company_requirements`, `get_my_unlocked_locations`, `has_role`, `has_paid_for`) rather than direct table selects.
- Direct table access from the browser is limited to `profiles`, `applications`, `departments`, `company_requirements`, and — for admins only — `companies`, `company_departments` and `requirement_library`.

## SEO

`index.html` carries the page title, meta description, keywords, author, Open Graph tags (`og:title`, `og:description`, `og:type`) and `twitter:card`. Pages use a single H1, semantic sectioning, responsive viewport, and descriptive alt text on imagery.
