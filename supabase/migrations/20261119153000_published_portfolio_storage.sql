UPDATE storage.buckets SET public = false
  WHERE id = 'portfolio-covers';

DROP POLICY IF EXISTS "portfolio covers public read" ON storage.objects;
CREATE POLICY "published portfolio covers" ON storage.objects FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'portfolio-covers'
    AND EXISTS (
      SELECT 1 FROM public.portfolio_projects project
      WHERE project.published
        AND project.cover_url IS NOT NULL
        AND (
          project.cover_url = 'portfolio-covers/' || storage.objects.name
          OR (
            project.cover_url ~ '^https?://[^/]+/storage/v1/object/public/portfolio-covers/'
            AND split_part(regexp_replace(project.cover_url,
              '^https?://[^/]+/storage/v1/object/public/portfolio-covers/', ''), '?', 1) = storage.objects.name
          )
        )
    )
  );
