# 02 — Tech stack

Everything the project depends on, why it is here, and where it is used. Versions are the semver ranges from `package.json`.

## Runtime & tooling

| Tool | Version | Purpose |
| --- | --- | --- |
| React | ^18.3.1 | UI framework |
| React DOM | ^18.3.1 | DOM renderer |
| TypeScript | ^5.8.3 | Static typing across the whole codebase |
| Vite | ^5.4.19 | Dev server (port 8080) and production bundler |
| @vitejs/plugin-react-swc | ^3.11.0 | SWC-based React transform (fast refresh) |
| lovable-tagger | ^1.1.9 | Development-only component tagging for the Lovable editor |
| ESLint | ^9.32.0 | Linting (flat config in `eslint.config.js`) |
| typescript-eslint | ^8.38.0 | TypeScript lint rules |
| eslint-plugin-react-hooks | ^5.2.0 | Hook rules |
| eslint-plugin-react-refresh | ^0.4.20 | Fast-refresh safety rules |
| @eslint/js, globals | ^9.32.0 / ^15.15.0 | Base ESLint config and global definitions |
| @types/node, @types/react, @types/react-dom | ^22 / ^18 | Type definitions |

## Styling

| Package | Version | Purpose |
| --- | --- | --- |
| tailwindcss | ^3.4.17 | Utility CSS; all colours come from CSS variables |
| tailwindcss-animate | ^1.0.7 | Keyframe utilities for shadcn components |
| @tailwindcss/typography | ^0.5.16 | `prose` styles for long-form legal/help pages |
| postcss | ^8.5.6 | Tailwind pipeline |
| autoprefixer | ^10.4.21 | Vendor prefixing |
| class-variance-authority | ^0.7.1 | Typed component variants (button, badge, etc.) |
| clsx | ^2.1.1 | Conditional class names |
| tailwind-merge | ^2.6.0 | Conflict-safe class merging, wrapped by `cn()` in `src/lib/utils.ts` |
| next-themes | ^0.3.0 | Theme class handling used by the Sonner toaster |

Fonts are loaded from Google Fonts in `index.html`: **DM Serif Display** (display/serif) and **Fira Sans** (body/sans).

## UI components

`src/components/ui/` is shadcn/ui — unstyled Radix primitives wrapped with project tokens. Radix packages in use:

`react-accordion`, `react-alert-dialog`, `react-aspect-ratio`, `react-avatar`, `react-checkbox`, `react-collapsible`, `react-context-menu`, `react-dialog`, `react-dropdown-menu`, `react-hover-card`, `react-label`, `react-menubar`, `react-navigation-menu`, `react-popover`, `react-progress`, `react-radio-group`, `react-scroll-area`, `react-select`, `react-separator`, `react-slider`, `react-slot`, `react-switch`, `react-tabs`, `react-toast`, `react-toggle`, `react-toggle-group`, `react-tooltip`.

Supporting UI libraries:

| Package | Version | Purpose |
| --- | --- | --- |
| lucide-react | ^0.462.0 | Icon set used site-wide |
| sonner | ^1.7.4 | Toast notifications (primary feedback channel) |
| cmdk | ^1.1.1 | Command palette primitive |
| vaul | ^0.9.9 | Drawer primitive (mobile sheets) |
| embla-carousel-react | ^8.6.0 | Carousel |
| react-day-picker | ^8.10.1 | Date picker (with `date-fns` ^3.6.0) |
| input-otp | ^1.4.2 | OTP input |
| react-resizable-panels | ^2.1.9 | Resizable split panes |
| recharts | ^2.15.4 | Charts |

## Data, forms & routing

| Package | Version | Purpose |
| --- | --- | --- |
| react-router-dom | ^6.30.1 | Client-side routing |
| @tanstack/react-query | ^5.83.0 | Query client provider and cache |
| react-hook-form | ^7.61.1 | Form state |
| @hookform/resolvers | ^3.10.0 | Bridges Zod schemas into React Hook Form |
| zod | ^3.25.76 | Runtime validation of form and contact input |
| papaparse (+ @types/papaparse) | ^5.5.4 | CSV parsing for the admin bulk company import |

## Backend

| Piece | Detail |
| --- | --- |
| @supabase/supabase-js | ^2.110.7 — browser client at `src/integrations/supabase/client.ts` |
| Postgres | Managed by Lovable Cloud; schema in `supabase/migrations/` |
| PostgREST | Auto REST API over the `public` schema, guarded by RLS + grants |
| GoTrue | Email/password auth, password recovery |
| Storage | Private bucket `applicant-documents`, read via signed URLs |
| Edge Functions | Deno runtime; `npm:@supabase/supabase-js@2` imported by URL specifier |

## Third-party services

| Service | Used for | Secret name |
| --- | --- | --- |
| Paystack | ₦3,000 location unlock payments (cards, bank, USSD) | `PAYSTACK_SECRET_KEY` |
| Resend | HR application email + student confirmation email | `RESEND_API_KEY` |
| Lovable AI Gateway | Available to the project (key provisioned) | `LOVABLE_API_KEY` |

## Build configuration highlights

- `vite.config.ts` — dev server on `::` port 8080, `@` alias → `./src`, `lovable-tagger` enabled only in development mode.
- `tailwind.config.ts` — `darkMode: ["class"]`, container centred with a 1400px `2xl` screen, font families `display`/`serif` → DM Serif Display and `sans` → Fira Sans, and every colour mapped to an `hsl(var(--token))`.
- `tsconfig.json` — path alias `@/*`, relaxed strictness suited to rapid iteration.
