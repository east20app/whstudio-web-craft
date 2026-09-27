# Conclusão integral da WH Studio e WHIA

## Objetivo
Reformular o projeto existente para uma identidade autoral de estúdio pequeno, técnico e humano, preservando os sistemas já criados e concluindo o que ficou pendente. O site público terá composição editorial própria; o painel continuará funcional e a WHIA será entregue como produto separado dentro do mesmo projeto.

## 1. Estabilizar a base
- Corrigir todos os erros atuais de TypeScript e inconsistências entre os tipos locais e o banco.
- Revisar as migrações existentes sem alterá-las; qualquer ajuste novo será uma nova migração.
- Remover código morto, mocks enganosos, placeholders e rastros visuais genéricos.
- Manter as rotas e funções públicas atuais funcionando durante a reformulação.

## 2. Nova identidade da WH Studio
- Fixar a linguagem editorial: Instrument Serif, Inter e JetBrains Mono; papel quente, tinta e azul de assinatura.
- Remover glassmorphism, glow, gradientes decorativos, navegação em cápsula, excesso de cards, sombras e cantos arredondados.
- Criar uma assinatura visual recorrente com linha manual, marcações técnicas discretas, assimetria e ritmo tipográfico.
- Refazer cabeçalho, rodapé, estados claro/escuro, motion, foco e comportamento móvel como um sistema único.

## 3. Reconstruir o site público
- Novo início assimétrico com “Eu projeto, programo e publico”, RN, disponibilidade real, portfólio e contato direto.
- Serviços em lista editorial interativa, sempre alimentados pelos serviços ativos do painel.
- Portfólio como principal prova de trabalho: destaque variável, frame simples, capa real, monograma para projeto privado e filtros.
- Processo, diferenciais, planos, avaliações, sobre, FAQ, contato e chamada final redesenhados sem grades repetitivas.
- Revisar a assistente de briefing whAI e o chat de atendimento para pertencerem à linguagem da WH Studio.
- Aplicar a mesma direção às páginas Serviços, Sistemas, Planos, Portfólio, Sobre e Contato, com SEO individual.

## 4. Completar o painel administrativo
- Padronizar navegação, tabelas, formulários, diálogos, filtros, estados vazios e status.
- Garantir criar, editar, pesquisar, mudar status e excluir em clientes, projetos, serviços, portfólio, orçamentos e mensagens.
- Preservar e validar tickets em conversa, respostas, status e leitura; feedback com link, aprovação, publicação e ocultação.
- Fazer nome, WhatsApp, Discord, rodapé, autor, disponibilidade e manutenção refletirem no site público com defaults apenas como contingência.
- Finalizar upload, preview, troca e remoção de capas do portfólio no armazenamento privado/controlado.

## 5. Concluir a plataforma WHIA
- Aproveitar as tabelas seguras já criadas para perfis, planos, créditos, conversas, mensagens, arquivos, papéis e uso.
- Criar autenticação em `/login`, `/register` e `/forgot-password`, com e-mail e Google; Discord aparecerá apenas quando estiver realmente configurado.
- Criar o aplicativo protegido com Início, Conversas, Chat, Biblioteca, Configurações, Uso e Planos.
- Entregar histórico, modos WHIA, Markdown/código, copiar, regenerar, avaliar, anexos, upload validado e estados de carregamento/erro.
- Manter provedores e chaves fora do navegador; sem serviço de IA conectado, mostrar indisponibilidade real em vez de respostas falsas.
- Separar visualmente WHIA da WH Studio, preservando autoria “WHIA • Desenvolvido por WH Studio”.

## 6. Segurança e dados
- Revisar permissões para que visitantes leiam somente serviços, configurações, portfólio e avaliações publicados.
- Manter clientes, mensagens, orçamentos, tickets internos e administração restritos ao proprietário autenticado.
- Validar arquivos por tipo e tamanho e assegurar isolamento dos dados de cada usuário da WHIA.
- Executar verificação de segurança após as mudanças de dados.

## 7. Validação final
- Verificar os fluxos públicos, administrativos e da WHIA no navegador.
- Testar larguras de 320, 375, 390, 430, 768, 1024, 1280 e 1440 px, sem cortes ou sobreposições.
- Confirmar tema claro/escuro, teclado, contraste, reduced motion, imagens e carregamento.
- Executar build, testes e lint; corrigir todos os erros antes da entrega.

## Limitações externas legítimas
- Respostas reais da IA dependem de um gateway/provedor ativo; a plataforma não fingirá respostas sem essa conexão.
- Login social depende da configuração e das credenciais válidas de cada provedor.
