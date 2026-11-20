alter table public.portfolio_projects
  add column if not exists gallery_urls text[] not null default '{}',
  add constraint portfolio_gallery_max_images check (cardinality(gallery_urls) <= 12);

-- Existing public consumers keep their response shape. Admin uploads stay private.
create or replace function public.get_public_portfolio()
returns table (id uuid, title text, category text, description text, url text, status text,
  tech text[], cover_url text, published boolean, sort_order integer, featured boolean)
language sql stable security definer set search_path = '' as $$
  select p.id, p.title, p.category, p.description, p.url, p.status, p.tech,
    case when p.cover_url not like '%/portfolio-covers/%' then coalesce(p.cover_url, p.gallery_urls[1])
      else p.gallery_urls[1] end,
    p.published, p.sort_order, p.featured
  from public.portfolio_projects p
  where p.published
  order by p.sort_order, p.created_at;
$$;
