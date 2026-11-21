# Architecture rules

- Authorize dashboard access through the server-side `is_admin` function and protected `public.user_roles`, never email allowlists or browser storage, so accounts cannot self-promote.
- Assign the first signup through an atomic singleton claim in `public.admin_bootstrap`; retain the claim after account deletion so later users never inherit ownership automatically.
- Keep portfolio storage reads administrator-scoped until an explicit public-cover delivery flow is configured; blanket anonymous storage policies expose unpublished uploads.
- Keep the cinematic entrance presentation-only on the home route, outside the maintenance gate; skipping or finishing must not change access rules, and reduced-motion visitors bypass it.teste