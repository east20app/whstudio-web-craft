# Architecture rules

- Authorize dashboard access through the server-side `is_admin` function and protected `public.user_roles`, never email allowlists or browser storage, so accounts cannot self-promote.
- Assign the first signup through an atomic singleton claim in `public.admin_bootstrap`; retain the claim after account deletion so later users never inherit ownership automatically.