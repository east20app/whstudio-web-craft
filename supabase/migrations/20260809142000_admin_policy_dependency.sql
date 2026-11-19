-- Establish the dependency for historical policies on a clean installation.
DO $$
BEGIN
  IF to_regprocedure('public.is_admin()') IS NULL THEN
    EXECUTE 'CREATE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE AS ''SELECT false''';
  END IF;
END;
$$;
