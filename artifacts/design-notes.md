# WH Studio — reformulação visual

A WH Studio é apresentada como empresa de desenvolvimento de sites e sistemas. A direção visual usa superfícies grafite, azul, Space Grotesk e Inter, com tipografia responsiva, divisórias e menos cartões repetidos. O tema claro continua disponível.

O rodapé foi adaptado da referência https://21st.dev/@mdafsarx/components/hover-footer: letras SVG em contorno, máscara radial que acompanha o cursor e iluminação de fundo. A implementação é própria, integrada às rotas e aos contatos reais da empresa.

## Skills consultadas

- agent-skills-main: web-design-guidelines e react-best-practices.
- awesome-design-skills-main: sleek e bold para hierarquia, contraste e espaçamento.
- design-system-skills-main: tipografia responsiva, tema escuro, foco e contraste.
- shadcn: composição de controles, estados e tokens com os componentes já instalados.
- better-design-main: skill lida; MCP não conectado, sem resultados ou geração alegados.
- magic-mcp-main: 21st-ui lida; MCP não conectado. Referência pública examinada diretamente.
- chrome-devtools-mcp-main: workflow lido; MCP não conectado. Verificação com Playwright instalado no projeto.
- shadcn-ui-mcp-server-master: documentação examinada; servidor não conectado.
- skills-main: catálogo examinado; predominam auditorias de segurança, contratos, C/Rust e ferramentas fora do escopo desta reformulação.

Estilos incompatíveis entre si e skills de tecnologias ausentes não foram aplicados juntos. As pastas externas não foram alteradas.

## Verificação

As capturas e scripts nesta pasta verificam rotas públicas, menu mobile, ausência de overflow em 390 px e efeito do cursor no rodapé. Os testes de interação cobrem orçamento com contexto, tema persistido, FAQ, formulário com resposta simulada e redirecionamento administrativo. Nenhum contato de teste é enviado ao banco pelo script de fluxos.

As telas protegidas recebem os tokens e componentes compartilhados; a verificação visual interna exige sessão administrativa. Migrações e dados de produção não foram alterados. Os tipos locais do Supabase foram alinhados às migrações existentes.
