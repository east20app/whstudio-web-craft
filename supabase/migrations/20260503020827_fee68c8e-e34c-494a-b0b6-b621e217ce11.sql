
-- Tabela: budgets
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  service text not null,
  contact text not null,
  date timestamptz not null default now(),
  status text not null default 'novo' check (status in ('novo','em-analise','aprovado','recusado')),
  notes text,
  created_at timestamptz not null default now()
);

-- Tabela: clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null default '',
  discord text default '',
  service text not null default '',
  status text not null default 'ativo' check (status in ('ativo','inativo','lead')),
  created_at timestamptz not null default now()
);

-- Tabela: projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text not null default '',
  type text not null default '',
  deadline date,
  stage text not null default 'planejamento' check (stage in ('planejamento','desenvolvimento','revisao','entregue')),
  created_at timestamptz not null default now()
);

-- Tabela: services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price text not null default 'Sob consulta',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tabela: messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Tabela: settings (singleton)
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'WH Studio',
  whatsapp text not null default '5584988766134',
  discord_link text not null default 'https://discord.gg/whstudio',
  footer_text text not null default 'WH STUDIO © 2026',
  author_name text not null default 'Walmry Netto',
  updated_at timestamptz not null default now()
);

-- Habilitar RLS
alter table public.budgets enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;

-- RLS: usuários autenticados têm acesso total
create policy "auth full access" on public.budgets for all to authenticated using (true) with check (true);
create policy "auth full access" on public.clients for all to authenticated using (true) with check (true);
create policy "auth full access" on public.projects for all to authenticated using (true) with check (true);
create policy "auth full access" on public.services for all to authenticated using (true) with check (true);
create policy "auth full access" on public.messages for all to authenticated using (true) with check (true);
create policy "auth full access" on public.settings for all to authenticated using (true) with check (true);

-- RLS: visitantes podem inserir mensagens (formulário de contato público)
create policy "anyone can insert messages" on public.messages for insert to anon with check (true);

-- Trigger updated_at em settings
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger settings_updated_at before update on public.settings
for each row execute function public.set_updated_at();

-- Linha inicial de settings
insert into public.settings default values;

-- Seed de serviços
insert into public.services (name, description, price, active) values
  ('Criação de Sites', 'Sites institucionais, landing pages e lojas virtuais.', 'Sob consulta', true),
  ('Bots para Discord', 'Bots completos sob medida.', 'Sob consulta', true),
  ('APIs e Sistemas', 'Sistemas web e APIs sob medida.', 'Sob consulta', true),
  ('Automação', 'Automatize processos e integrações.', 'Sob consulta', true);

-- Seed de projetos reais
insert into public.projects (name, client, type, deadline, stage) values
  ('Serra Delivery', 'Serra Delivery', 'Sistema de delivery', '2026-06-10', 'desenvolvimento'),
  ('DroxBot', 'Comunidade DroxBot', 'Bot Discord + Painel', '2026-05-20', 'desenvolvimento'),
  ('Peixe Store', 'Peixe Store', 'E-commerce', '2026-04-30', 'entregue'),
  ('Copa Ativa', 'Copa Ativa', 'Plataforma de eventos esportivos', '2026-03-15', 'entregue');
