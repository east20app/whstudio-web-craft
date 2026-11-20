-- Populate missing offerings without changing the status or order of existing entries.
insert into public.services (name, description, sort_order)
select entry.name, entry.description, entry.position
from (values
  ('Criação de Sites', 'Sites institucionais e landing pages responsivas, com conteúdo organizado e canais de contato integrados.', 1, array['criação de sites', 'criação de site', 'desenvolvimento de sites']),
  ('Sistemas empresariais', 'Sistemas web para cadastros, pedidos, financeiro e controle interno.', 2, array['sistemas empresariais', 'apis e sistemas']),
  ('Bots para Discord', 'Moderação, tickets, comandos sob demanda e painel para comunidades.', 3, array['bots para discord', 'bots discord']),
  ('Inteligência artificial', 'Integração de modelos de IA a fluxos e aplicações.', 4, array['inteligência artificial', 'ia']),
  ('Lojas virtuais', 'Catálogo, pagamentos e gestão de produtos e pedidos.', 5, array['lojas virtuais', 'loja virtual', 'e-commerce']),
  ('APIs e integrações', 'Conectamos ferramentas internas e serviços externos com APIs documentadas.', 6, array['apis e integrações', 'integrações']),
  ('Automação', 'Automatize tarefas repetitivas e sincronize informações entre ferramentas.', 7, array['automação', 'automações']),
  ('Dashboards', 'Painéis com permissões, indicadores e relatórios operacionais.', 8, array['dashboards', 'dashboard']),
  ('Sistemas de Delivery', 'Cardápio digital, pedidos, pagamentos e gestão de entregas.', 9, array['sistemas de delivery', 'sistema de delivery'])
) as entry(name, description, position, aliases)
where not exists (
  select 1 from public.services service where lower(btrim(service.name)) = any(entry.aliases)
);
