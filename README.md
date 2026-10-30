# WH Studio

Site institucional da WH Studio, com páginas públicas para serviços, sistemas, portfólio, orçamento e contato, além de uma área privada para clientes e equipe.

## Desenvolvimento local

Requisitos: Node.js e npm.

```sh
npm install
npm run dev
```

## Comandos

```sh
npm run build
npm run lint
npm test
```

## Configuração

As integrações públicas usam as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. Segredos de provedores e pagamentos devem ficar apenas nas configurações das Supabase Edge Functions. Consulte [docs/wh-studio-ai.md](docs/wh-studio-ai.md) para configurar a área WH Studio AI e o backend dos projetos gerados.
