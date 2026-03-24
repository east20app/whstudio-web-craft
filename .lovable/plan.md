

# WH STUDIO — Rebuild Completo (Dark Premium)

Rebuild total do site com tema dark premium, múltiplas páginas e foco em conversão.

## Visão Geral

Transformar o site atual (light, single-page) em um site multi-página dark premium com 5 rotas, animações, prova social, planos de preço e CTAs de conversão.

## Design System

- **Fundo**: `#0a0a0f` / Cards: `#1a1a2e` / Destaque: `#3b82f6`
- **Tipografia**: Inter (já importada)
- **Efeitos**: glow azul sutil, hover scale, fade-in animations via framer-motion
- **100% responsivo**, bordas arredondadas

## Arquitetura de Arquivos

### Arquivos Modificados
1. **`src/index.css`** — Reescrever CSS variables para tema dark premium
2. **`tailwind.config.ts`** — Adicionar utilitários glow, animações customizadas
3. **`src/App.tsx`** — Adicionar rotas: `/servicos`, `/planos`, `/portfolio`, `/contato`

### Componentes Reescritos
4. **`src/components/Header.tsx`** — Navbar dark com links para todas as páginas, logo "WH STUDIO"
5. **`src/components/Hero.tsx`** — Novo hero dark com título "Crie Sites, Bots e Sistemas...", mockup de dashboard, dois CTAs
6. **`src/components/Services.tsx`** — 5 cards dark (Sites, Bots Discord, Sistemas, Hospedagem, Automações) com botão "Solicitar"
7. **`src/components/Portfolio.tsx`** — Cards com projetos fictícios (delivery, bot, dashboard)
8. **`src/components/Contact.tsx`** — Formulário dark + botões WhatsApp/Discord
9. **`src/components/Footer.tsx`** — Footer completo com links para todas as páginas
10. **`src/components/WhatsAppButton.tsx`** — Manter, ajustar estilo

### Novos Componentes
11. **`src/components/SocialProof.tsx`** — "50+ clientes", 3 depoimentos com estrelas
12. **`src/components/Plans.tsx`** — 3 planos (Básico R$150, Pro R$350 destaque, Premium R$800+)
13. **`src/components/Differentials.tsx`** — Lista de diferenciais com ícones
14. **`src/components/HowItWorks.tsx`** — 3 passos: Contato → Desenvolvimento → Entrega
15. **`src/components/CTAFinal.tsx`** — CTA de conversão final com botões WhatsApp + criar projeto
16. **`src/components/PriceSimulator.tsx`** — Simulador simples com checkboxes (site, bot, sistema, hospedagem) que calcula preço estimado

### Novas Páginas
17. **`src/pages/Index.tsx`** — Landing completa: Hero → Serviços → Prova Social → Como Funciona → Planos → Diferenciais → CTA Final
18. **`src/pages/ServicosPage.tsx`** — Serviços detalhados com benefícios
19. **`src/pages/PlanosPage.tsx`** — Planos com comparação de recursos
20. **`src/pages/PortfolioPage.tsx`** — Portfólio expandido
21. **`src/pages/ContatoPage.tsx`** — Formulário + links de contato

## Detalhes Técnicos

- Todas as animações via `framer-motion` (já instalado)
- Ícones via `lucide-react`
- Links WhatsApp apontando para `5584988766134`
- Scroll suave via CSS `scroll-behavior: smooth`
- Cards com `border border-white/10` e `hover:border-blue-500/50` para efeito glow
- Plano Pro com `ring-2 ring-blue-500` e badge "POPULAR"
- Navegação entre páginas via `react-router-dom` (Link)

