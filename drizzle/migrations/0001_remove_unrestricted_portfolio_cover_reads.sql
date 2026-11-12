-- No portfolio-covers bucket or files exist. Remove the unnecessary anonymous
-- read policy while preserving the separate administrator management policy.
DROP POLICY IF EXISTS "portfolio covers public read" ON storage.objects;