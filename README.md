# LUXERA website

A Persian, RTL product introduction and lead collection site based on `PRODUCT-REFERENCE.fa.md` (۱۴۰۵/۰۷/۰۷). `PRODUCT-PLAN.fa.md` records the feature audit and UX scope. The three-panel preview contains fictional data and does not connect to the LUXERA hotel backend.

## Run

- `npm ci`
- `npm run db:generate` only after changing `db/schema.ts` (do not rewrite deployed migrations)
- `npm run dev`
- `npm run build`

D1 binding `DB` stores leads and opt-in analytics. Apply the generated Drizzle migration to the local D1 database after the first build as described in the starter docs. The hosting pipeline applies versioned migrations in deployment. `ADMIN_EMAILS` is a server-side allowlist for `/api/admin/leads` and must match the authenticated site user's email. Public visitors can submit leads, but cannot read or export them. Keep the admin allowlist set before changing the Site audience.

The lead API has server-side validation, idempotency and basic duplicate throttling. Optional analytics require visitor opt-in. Form submission stores contact details but does not send email or book a meeting; review requests at `/admin` and export JSON there.

The product's Django API is separate. Do not label the preview as a live hotel deployment. External adapters, owner-approved founder biography, customer claims, and any integration with the product backend require verified source material.
