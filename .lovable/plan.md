# WHIA — Plataforma SaaS de Inteligência Artificial

## Objetivo

Criar uma experiência independente da WHIA dentro do projeto atual, preservando o site público e o painel administrativo da WH Studio. A marca visível será somente WHIA, com visual escuro premium, navegação responsiva e fluxos reais de conta, arquivos, conversas e preferências.

## Experiência a construir

- Autenticação completa em `/login`, `/register` e `/forgot-password`, incluindo Google, validações, recuperação de senha e retornos visuais.
- Aplicativo protegido com Início, Conversas, Nova conversa, Biblioteca, Configurações, Uso e Planos.
- Área inicial com saudação, campo de pergunta, anexos, microfone e sugestões rápidas.
- Chat profissional com histórico, modos WHIA, mensagens em streaming visual, Markdown, código, copiar, regenerar, avaliar e continuar.
- Biblioteca de arquivos com upload, abertura, uso em conversa e exclusão.
- Configurações de perfil, conta, segurança, preferências, plano e consumo.
- Tela de planos com valores administráveis, estado atual e comparação objetiva.
- Navegação móvel com menu lateral e campo de mensagem fixo, sem rolagem horizontal.

## Dados e segurança

- Criar dados isolados por usuário para perfil, conversas, mensagens, arquivos, preferências, plano e registros de uso.
- Aplicar regras de acesso para cada pessoa enxergar apenas seus próprios dados.
- Criar armazenamento privado com validação de tipo e limite de tamanho.
- Manter chaves e provedores fora do navegador; preparar um único ponto de integração segura para a futura camada de IA.
- Implementar limites e consumo no servidor, sem confiar em valores enviados pela tela.
- Preservar as regras atuais do painel administrativo da WH Studio.

## Direção visual

- Fundo quase preto, superfícies grafite, azul luminoso controlado e tipografia limpa.
- Cantos moderados, linhas finas, sombras discretas e bastante espaço negativo.
- Identidade própria WHIA, sem nomes de provedores, mascotes, robôs ou clichês visuais.
- Animações suaves de 150–250 ms e detalhes tecnológicos discretos apenas na autenticação.
- Estados completos: vazio, carregando, erro, sucesso e skeleton.

## Detalhes técnicos

- Rotas do produto: `/login`, `/register`, `/forgot-password`, `/app`, `/chat`, `/chat/:id`, `/library`, `/settings`, `/usage` e `/plans`.
- Componentes de conversa baseados em AI Elements, adaptados ao design WHIA.
- Camada de serviços separada da interface para autenticação, arquivos, conversas e futura IA.
- Google configurado na autenticação; Discord será apresentado como integração futura sem simular login inexistente.
- A IA real será preparada, mas não será fingida: sem provedor/chave ativo, a interface exibirá um estado claro de indisponibilidade em vez de respostas falsas.
- Verificação final em desktop e celular, incluindo login, cadastro, recuperação, navegação, uploads e chat.
