// Configuração central do site WH Studio

export const siteConfig = {
  name: "WH Studio",
  shortName: "WH",
  slogan: "Desenvolvimento web feito por gente que atende WhatsApp",
  description:
    "WH Studio — sites, bots para Discord, sistemas personalizados e automações. Código do zero, atendimento direto. Solicite seu orçamento.",
  url: "https://whstudio.site",
  email: "contato@whstudio.com.br",
  whatsapp: {
    number: "5584988766134",
    display: "(84) 98876-6134",
  },
  discordInvite: "https://discord.gg/whstudio",
  social: {
    discord: "https://discord.gg/whstudio",
    instagram: "#",
    github: "#",
  },
  author: "Walmry Netto",
  defaultMessages: {
    generic: "Olá, vim pelo site e quero solicitar um orçamento.",
    service: (service: string) =>
      `Olá, vim pelo site da WH Studio. Tenho interesse no serviço: ${service}. Pode me enviar um orçamento?`,
    plan: (plan: string) =>
      `Olá, vim pelo site da WH Studio. Tenho interesse no plano ${plan}. Pode me enviar mais detalhes?`,
    contactForm: (data: { name?: string; email?: string; project?: string; message?: string }) =>
      `Olá, vim pelo site da WH Studio.\n\nNome: ${data.name}\nE-mail: ${data.email}${
        data.project ? `\nProjeto: ${data.project}` : ""
      }\nMensagem: ${data.message}`,
  },
} as const;

export const whatsappLink = (message: string = siteConfig.defaultMessages.generic) =>
  `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const discordLink = () => siteConfig.discordInvite;

// =============== SERVIÇOS ===============
import {
  Globe,
  Bot,
  Settings,
  Server,
  Zap,
  LayoutDashboard,
  ShoppingCart,
  Rocket,
  Plug,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  short: string;
  benefits: string[];
};

export const services: Service[] = [
  {
    id: "criacao-sites",
    icon: Globe,
    title: "Criação de Sites",
    short: "Site institucional, landing page ou loja virtual. Rápido pra carregar, fácil pra você editar e bonito no celular — que é onde o seu cliente vai abrir.",
    benefits: [
      "Design responsivo feito do zero",
      "Otimizado pra aparecer no Google",
      "WhatsApp integrado no site",
      "Carregamento rápido em qualquer rede",
    ],
  },
  {
    id: "bots-discord",
    icon: Bot,
    title: "Bots para Discord",
    short: "Bot de Discord do jeito que o seu servidor precisa: moderação automática, sistema de tickets, economia, ranks, painel web pra administrar. Você manda o que quer, eu programo.",
    benefits: [
      "Moderação automática configurada",
      "Sistema de tickets com painel",
      "Economia, ranking e níveis",
      "Comandos feitos sob demanda",
    ],
  },
  {
    id: "apis-sistemas",
    icon: Settings,
    title: "APIs e Sistemas",
    short: "Sistema web e API pra coisas que você ainda controla na planilha: cadastro, pedidos, financeiro, controle interno. Pensado pra um time pequeno usar sem treinamento.",
    benefits: [
      "Banco de dados próprio e seguro",
      "Login com permissões por cargo",
      "API documentada pra expansão",
      "Código organizado, fácil de manter",
    ],
  },
  {
    id: "automacao",
    icon: Zap,
    title: "Automação",
    short: "Aquela tarefa repetitiva que come 2h do seu dia? Conecto WhatsApp, planilhas, e-mail, sistema interno e CRM pra rodar sozinho enquanto você atende cliente.",
    benefits: [
      "Notificações automáticas no WhatsApp",
      "Integração com APIs que você já usa",
      "Sincronização de dados em tempo real",
      "Workflow montado pro seu processo",
    ],
  },
  {
    id: "dashboards",
    icon: LayoutDashboard,
    title: "Dashboards",
    short: "Painel administrativo com login, permissões, gráficos e relatório de verdade. Tudo o que importa do seu negócio numa tela só — sem precisar abrir 4 sistemas.",
    benefits: [
      "Métricas e gráficos em tempo real",
      "Controle de quem vê o quê",
      "Exportação de relatórios",
      "Interface simples, sem curso",
    ],
  },
  {
    id: "delivery",
    icon: ShoppingCart,
    title: "Sistemas de Delivery",
    short: "Cardápio online com pedido pelo WhatsApp ou pagamento direto. Foi feito pensando em hamburgueria, açaí, pizzaria e mercadinho de bairro — sem mensalidade de iFood.",
    benefits: [
      "Cardápio digital bonito no celular",
      "Pedido direto no WhatsApp ou pagamento",
      "Frete calculado por bairro",
      "Painel pra você aceitar e acompanhar",
    ],
  },
];

// =============== PLANOS (sem preços fixos) ===============
export type Plan = {
  id: string;
  name: string;
  tagline: string;
  deliveryTime: string;
  support: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
};

export const plans: Plan[] = [
  {
    id: "inicial",
    name: "Inicial",
    tagline: "Pra quem precisa estar no ar essa semana.",
    deliveryTime: "Entrega em até 7 dias",
    support: "15 dias de suporte",
    features: [
      "Landing page ou site simples (até 3 páginas)",
      "Design responsivo",
      "WhatsApp integrado",
      "SEO básico configurado",
      "1 revisão inclusa",
    ],
    ctaLabel: "Solicitar orçamento",
  },
  {
    id: "profissional",
    name: "Profissional",
    tagline: "Pra empresa que já tem cliente e precisa parecer empresa.",
    deliveryTime: "Entrega em até 15 dias",
    support: "30 dias de suporte",
    popular: true,
    features: [
      "Site completo com várias páginas",
      "Painel administrativo simples",
      "Formulários funcionais",
      "Integração com pagamentos",
      "SEO avançado e Analytics",
      "3 revisões inclusas",
    ],
    ctaLabel: "Solicitar orçamento",
  },
  {
    id: "premium",
    name: "Sistema Premium",
    tagline: "Pra quem vai rodar o negócio dentro do sistema.",
    deliveryTime: "Prazo sob consulta",
    support: "90 dias de suporte avançado",
    features: [
      "Sistema sob medida do zero",
      "Dashboard administrativo completo",
      "API própria para integrações",
      "Login e controle de usuários",
      "Banco de dados dedicado",
      "Integração com bot Discord",
      "Suporte prioritário",
    ],
    ctaLabel: "Falar sobre meu projeto",
  },
];

// =============== PORTFÓLIO ===============
export type ProjectStatus = "online" | "demo" | "em-desenvolvimento" | "privado";

export type PortfolioProject = {
  title: string;
  category: string;
  desc: string;
  url?: string;
  status: ProjectStatus;
  tech: string[];
  color: string;
};

export const portfolio: PortfolioProject[] = [
  {
    title: "Serra Delivery",
    category: "Sistema de delivery",
    desc: "Plataforma completa de delivery com cardápio digital, painel administrativo e mapa em tempo real para acompanhar entregadores.",
    status: "em-desenvolvimento",
    tech: ["React", "Node.js", "PostgreSQL", "Mapbox"],
    color: "from-orange-500 to-red-600",
  },
  {
    title: "DroxBot",
    category: "Bot Discord + Painel",
    desc: "Bot avançado para Discord com painel web próprio: moderação, tickets, economia, ranking e configuração visual.",
    status: "online",
    tech: ["Node.js", "Discord.js", "React", "MongoDB"],
    color: "from-violet-500 to-purple-700",
  },
  {
    title: "Peixe Store",
    category: "Loja digital",
    desc: "Loja virtual completa com catálogo, carrinho, checkout e gestão de pedidos.",
    url: "https://peixestore.shop/",
    status: "online",
    tech: ["React", "Tailwind", "Stripe"],
    color: "from-violet-600 to-fuchsia-600",
  },
  {
    title: "Copa Ativa",
    category: "Eventos esportivos",
    desc: "Plataforma para gestão de campeonatos, inscrições, tabelas, resultados e ranking de equipes.",
    status: "online",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    color: "from-emerald-500 to-teal-700",
  },
];

export const statusLabels: Record<ProjectStatus, { label: string; className: string }> = {
  online: {
    label: "Online",
    className: "bg-background/80 border-emerald-500/30 text-emerald-600 dark:text-emerald-300",
  },
  demo: {
    label: "Demonstração",
    className: "bg-background/80 border-violet-500/30 text-violet-600 dark:text-violet-300",
  },
  "em-desenvolvimento": {
    label: "Em desenvolvimento",
    className: "bg-background/80 border-yellow-500/30 text-yellow-600 dark:text-yellow-300",
  },
  privado: {
    label: "Projeto privado",
    className: "bg-background/80 border-zinc-500/30 text-zinc-500 dark:text-zinc-300",
  },
};

// =============== NAVEGAÇÃO ===============
export const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Planos", href: "/planos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Contato", href: "/contato" },
];

// =============== PROVA SOCIAL ===============
export const stats = [
  { label: "Clientes atendidos", value: "50+" },
  { label: "Projetos entregues", value: "70+" },
  { label: "Uptime médio", value: "99.9%" },
  { label: "Suporte", value: "WhatsApp" },
];

export const testimonials = [
  {
    name: "Lucas Mendes",
    role: "CEO, TechFlow",
    text: "Contratei pra refazer o sistema interno de controle de demanda da equipe. Em 17 dias estava rodando, com login, dashboard e exportação pra Excel. O que mais valeu foi poder falar direto com o dev quando o time pediu uma mudança.",
  },
  {
    name: "Ana Beatriz",
    role: "Sabor & Arte",
    text: "Abri meu delivery de açaí e precisava de um site que os clientes pedissem direto. No primeiro dia já tive 14 pedidos pelo WhatsApp. O Walmry me ensinou a mexer sozinha e até hoje responde quando preciso.",
  },
  {
    name: "Rafael Costa",
    role: "Comunidade Lobby BR",
    text: "Administro a comunidade Lobby BR no Discord e o bot que ele fez já virou a espinha dorsal do servidor. Ticket, economia, moderação automática — tudo funciona sem travar. Se precisar de ajuste, mando mensagem e ele resolve.",
  },
];
