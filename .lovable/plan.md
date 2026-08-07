# ChedLink — Full Project Documentation

Produce complete written documentation covering every part of the system: frontend, backend, database, payments, email, storage, security, and operations. No code behaviour changes.

## What gets created

A `docs/` folder plus a rewritten root `README.md` that links to it.

| File | Contents |
| --- | --- |
| `README.md` | Project overview, quick start, scripts, links to all docs |
| `docs/01-architecture.md` | System diagram, request flows, folder layout, routing map |
| `docs/02-tech-stack.md` | Every dependency and dev dependency with purpose and version |
| `docs/03-frontend.md` | Every page and component, props, state, data hooks, design system tokens, fonts, Tailwind config |
| `docs/04-database.md` | Every table, column, enum, index, constraint, RLS policy, grant, trigger, and DB function with purpose |
| `docs/05-edge-functions.md` | `paystack-init`, `paystack-verify`, `submit-application`, `seed-accounts` — inputs, outputs, validation, secrets used |
| `docs/06-auth-and-roles.md` | Signup trigger, roles table, `has_role`, route guards, admin access (hidden trigger + shortcut), password reset flow |
| `docs/07-payments.md` | Paystack unlock flow end to end, ₦ pricing, `placement_access`, verification and retry behaviour |
| `docs/08-applications-and-email.md` | Application submission pipeline, dynamic requirements, document upload to storage, HR + student emails via Resend |
| `docs/09-admin-guide.md` | Admin UI: company CRUD, department assignment, CSV bulk import format and column mapping, requirement library, viewing applications |
| `docs/10-operations.md` | Environment variables/secrets list (names only), deploy, seeding, backups, known limits and open security-scan warnings |

## How it will be produced

Content is derived by reading the actual source: `src/pages/*`, `src/components/*`, `src/hooks/*`, `src/lib/*`, `supabase/migrations/*`, `supabase/functions/*`, `tailwind.config.ts`, `src/index.css`, and `package.json` — so the docs match the code rather than being generic.

## Technical notes

- Secrets are referenced by name only; no values, project IDs, or dashboard links.
- Diagrams use plain ASCII in fenced `text` blocks.
- Docs are markdown only — no source files touched.
