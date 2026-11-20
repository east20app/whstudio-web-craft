# WH Studio

Site institucional da WH Studio, com páginas públicas para serviços, sistemas, portfólio, orçamento e contato, além de uma área privada para clientes e equipe.

## Desenvolvimento local

Requisitos: Node.js e npm.

```sh
npm ci
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

## Validação da WH Studio 2.0

Inicie o Vite com `npm run dev -- --host 127.0.0.1 --port 5173`. Em outro terminal, instale o Chromium com `npx playwright install chromium` e execute `node artifacts/verify-site.mjs`. A suíte intercepta as requisições de teste ao Supabase e escreve capturas em `artifacts/wh-studio-qa.local/`. Os testes de integração com Supabase e Stripe usam um ambiente de homologação separado.

Antes de promover a branch, aplique as migrações de novembro em homologação na ordem do Supabase. Se uma equipe dependia de autorização por e-mail ou ID fixo, um operador do banco precisa conferir os administradores existentes e registrar as funções aprovadas em `public.user_roles`. A migração preserva funções protegidas e importa marcações administrativas existentes em `app_metadata`. Cadastros novos só reivindicam a administração de um banco sem reivindicação anterior.

O formulário envia até três arquivos em PDF, PNG ou JPEG, limitados a 2 MB no total. Administradores baixam os anexos em Orçamentos. No portfólio, cadastre URLs HTTPS de capturas aprovadas no campo Capturas públicas. As capas enviadas ao bucket privado ficam acessíveis no painel.