# LUXERA website

A Persian, RTL product introduction and lead collection site based on `PRODUCT-REFERENCE.fa.md` (۱۴۰۵/۰۷/۰۷). `PRODUCT-PLAN.fa.md` records the feature audit and UX scope. The three-panel preview contains fictional data and does not connect to the LUXERA hotel backend.

## Run

- `npm ci`
- `npm run db:generate` only after changing `db/schema.ts` (do not rewrite deployed migrations)
- `npm run dev`
- `npm run build`

D1 binding `DB` stores leads, opt-in analytics and admin login rate limits. Apply the generated Drizzle migrations to the local D1 database after the first build as described in the starter docs. The Sites hosting pipeline applies versioned migrations in deployment.

## Admin access

The public site links to `/admin`; unauthenticated visitors are redirected to `/admin/login`. All lead reads, status changes and JSON exports are protected by a server-verified, HttpOnly, SameSite=Strict, 12-hour session. Passwords are checked against a salted PBKDF2-SHA256 hash; login attempts are limited to five per IP in a 15-minute window. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` as runtime secrets. Never commit their real values. Run `node scripts/hash-admin-password.mjs` and pipe a new password through stdin to produce a hash and session secret; changing the session secret signs out existing sessions. Public visitors may submit leads without an admin account. The current Sites deployment also has its separate owner-only access policy.

## Moving to your own host

This project uses a Cloudflare Worker-compatible Vinext build and a D1 database. For Cloudflare deployment, provision a D1 database, bind it as `DB`, apply the SQL files in `drizzle/` in order, configure the three admin runtime secrets, then build and deploy the Worker and `dist/client` assets. Use HTTPS so the admin session cookie receives its Secure attribute. Set your domain's DNS to the Worker deployment and verify a lead submission, admin login, status update and JSON export on that domain. The product's Django API is separate from this presentation site.

A generic static-only host is insufficient because lead storage and admin authentication need the server Worker and database. For another provider, adapt the Worker/D1 binding layer before switching DNS. No domain or external hosting account is configured in this repository; the existing Sites deployment remains live until migration details are supplied.

The lead API has server-side validation, idempotency and basic duplicate throttling. Optional analytics require visitor opt-in. Form submission stores contact details but does not send email or book a meeting; review requests at `/admin` and export JSON there.

The product's Django API is separate. Do not label the preview as a live hotel deployment. External adapters, owner-approved founder biography, customer claims, and any integration with the product backend require verified source material.
