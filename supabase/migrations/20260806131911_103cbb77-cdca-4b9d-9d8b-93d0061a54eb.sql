GRANT SELECT ON public.settings TO anon;
CREATE POLICY "public can read settings" ON public.settings FOR SELECT TO anon USING (true);