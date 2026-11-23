# Architecture rules

- Authorize dashboard access through the server-side `is_admin` function and protected `public.user_roles`, never email allowlists or browser storage, so accounts cannot self-promote.
- Assign the first signup through an atomic singleton claim in `public.admin_bootstrap`; retain the claim after account deletion so later users never inherit ownership automatically.
- Keep portfolio storage reads administrator-scoped until an explicit public-cover delivery flow is configured; blanket anonymous storage policies expose unpublished uploads.
- Keep the cinematic entrance presentation-only on the home route, outside the maintenance gate; skipping or finishing must not change access rules, and reduced-motion visitors bypass it.teste
- Keep builder mutations behind verified sessions and owner checks in wh-builder; browser RLS is defense in depth, not a replacement for server authorization.
- Record wallet consumption, refunds and confirmed purchases in the same locked database transaction as the balance change so retries cannot charge or refund twice.
- Share prompt, package and public-key validation between browser and server to avoid divergent credit rules or unsafe connections.
- Execute generated projects only in the isolated preview and export environment templates without real credentials to protect the host application and downloaded source.