# WH Studio AI — primeira versão

Rota `/ai`. Conta de cliente Supabase, projetos privados por RLS, geração real pela API Responses, alterações a partir da última versão, histórico, prévia React compilada pelo Sandpack e download ZIP do projeto Vite + React + TypeScript com múltiplos arquivos. Sistemas podem incluir autenticação, CRUD e PostgreSQL pelo Supabase, com migrações SQL e Edge Functions geradas. Não há provisionamento automático de banco, aplicação automática de SQL nem publicação automática. Não prometer equivalência completa com Lovable/v0.

## Ativar o serviço

1. Aplicar `supabase/migrations/20261006090000_builder.sql` no projeto correto. Revisar as permissões: cliente só lê saldo, pedidos e gerações; funções financeiras só `service_role`.
2. Publicar as funções `wh-builder` e `wh-builder-webhook` com Supabase CLI ou dashboard. `verify_jwt=false` é intencional: builder valida o token com `auth.getUser`, webhook valida assinatura Stripe.
3. Configurar segredos **no servidor**, nunca VITE nem Git: `OPENAI_API_KEY`, `OPENAI_MODEL` (modelo compatível com Responses + structured outputs), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `WH_AI_APP_URL` (origem exata, sem barra final; ex.: `https://whstudio.site`). Supabase injeta URL, anon e service role na Edge Function. Para desenvolvimento usar `http://127.0.0.1:5173` como origem.
4. Na Stripe cadastrar webhook para `checkout.session.completed` e `checkout.session.async_payment_succeeded` apontando para `/functions/v1/wh-builder-webhook`. Usar inicialmente modo de teste. Saldo só é creditado por evento assinado e valor/moeda conferidos, nunca pelo retorno do navegador.
5. Habilitar email/senha no Supabase Auth e URLs de redirecionamento `<origem>/ai`; configurar SMTP, confirmação e recuperação de senha.
6. Testar de ponta a ponta com usuário de teste: cadastro, confirmação, Checkout teste, saldo, geração, edição, erro com reembolso, histórico após recarregar, download e isolamento entre usuários. Repetir webhook: saldo deve aumentar apenas uma vez. Antes de produção revisar limites/custos, termos e política de dados.

Preço inicial configurado na tabela: **R$10 por 5 créditos**, uma versão por crédito. É uma hipótese de lançamento, não garantia de margem. Ajustar defaults `amount` e `credits` antes de vender; medir tokens/modelo gravados em `builder_generations`. Sem créditos grátis automáticos. Conceder créditos a teste apenas via administração segura.

Falhas devolvem o crédito uma vez. ID repetido reaproveita a geração e não repete chamada. Um usuário só pode ter uma geração pendente. Interrupções do processo são reconciliadas na próxima tentativa após 15 minutos. Não devolver manualmente antes de conferir o status.

Prévia: Sandpack compila React/TypeScript em iframe externo, separado da origem da aplicação. Os arquivos enviados ao bundler CodeSandbox não devem conter segredos. Não inserir dados sensíveis no prompt: prompt e código são armazenados na conta e enviados ao provedor para geração. Código e migrações exigem revisão antes de produção.

## Backend dos sistemas gerados

Criar um projeto Supabase exclusivo para cada aplicação gerada. Na aba Backend informar URL `https://<ref>.supabase.co` e chave **pública publishable/anon**; jamais service_role/secret. Esses valores públicos são salvos no projeto privado e inseridos em `src/lib/supabase.ts` na prévia e no ZIP. Não são as credenciais administrativas da plataforma WH Studio AI.

Revisar e aplicar os arquivos `supabase/migrations/*.sql` no projeto separado, habilitar os provedores Auth e redirecionamentos e publicar Edge Functions necessárias. As políticas RLS são essenciais para dados privados; sua correção depende da revisão do código gerado. Sem backend conectado o aplicativo deve mostrar configuração pendente, sem fingir persistência/login. A geração foi instruída a seguir isso, mas saídas de IA precisam de validação funcional.

ZIP contém package.json, fontes, configurações Vite/TypeScript, README, migrações e funções quando necessárias. Rodar `npm install`, `npm run dev` e `npm run build` no projeto exportado após revisão. Hospedar o frontend com fallback SPA e configurar o backend correspondente. O WH Studio AI não executa scripts gerados na máquina do operador.

## Validação local

`npx tsc --noEmit -p tsconfig.app.json`, `npm run lint`, `npm run build`, `npm test`. Para Edge Functions: `deno check --config supabase/functions/deno.json supabase/functions/wh-builder/index.ts supabase/functions/wh-builder-webhook/index.ts`. As integrações reais exigem segredos e migração; compilação do frontend não as valida.
