// Configuração central do site WH Studio

import {
  Bot,
  Globe,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "WH Studio",
  shortName: "WH",
  slogan: "Software feito por quem atende e assume o código",
  description:
    "WH Studio — sites, bots para Discord, sistemas e automações. Código do zero, atendimento direto e suporte depois da entrega.",
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
    generic: "Olá, vim pelo site e quero conversar sobre um projeto.",
    service: (service: string) =>
      `Olá, vim pelo site da WH Studio. Quero falar sobre: ${service}. Pode me ajudar?`,
    plan: (plan: string) =>
      `Olá, vim pelo site da WH Studio. Quero entender se o plano ${plan} serve para meu caso.`,
    contactForm: (data: { name?: string; email?: string; project?: string; message?: string }) =>
      `Olá, vim pelo site da WH Studio.\n\nNome: ${data.name}\nE-mail: ${data.email}${
        data.project ? `\nProjeto: ${data.project}` : ""
      }\nMensagem: ${data.message}`,
  },
} as const;

export const whatsappLink = (message: string = siteConfig.defaultMessages.generic) =>
  `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const discordLink = () => siteConfig.discordInvite;

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
    title: "Sites que explicam e vendem",
    short:
      "Site institucional, landing page ou loja simples para parar de depender só do Instagram. Carrega rápido, abre bem no celular e manda o cliente para o WhatsApp certo.",
    benefits: [
      "Layout específico para o seu negócio",
      "SEO básico sem enrolação",
      "WhatsApp integrado no site",
      "Carregamento rápido em rede ruim",
    ],
  },
  {
    id: "bots-discord",
    icon: Bot,
    title: "Bots para Discord",
    short:
      "Bot para tirar trabalho manual da moderação: ticket, cargo, aviso, ranking, economia e painel. Você diz a regra. Eu transformo em comando.",
    benefits: [
      "Moderação automática configurada",
      "Sistema de tickets com painel",
      "Economia, ranking e níveis",
      "Comandos feitos para a sua regra",
    ],
  },
  {
    id: "apis-sistemas",
    icon: Settings,
    title: "Sistemas internos",
    short:
      "Sistema web para o que hoje está em planilha, caderno ou grupo de WhatsApp: cadastro, pedido, financeiro, estoque, entrega e controle interno.",
    benefits: [
      "Banco de dados próprio e seguro",
      "Login com permissões por cargo",
      "API documentada quando fizer sentido",
      "Código organizado para manutenção",
    ],
  },
  {
    id: "automacao",
    icon: Zap,
    title: "Automações",
    short:
      "Aquela tarefa repetitiva que seu funcionário odeia fazer? Eu conecto WhatsApp, planilha, e-mail e sistema para ela rodar sem alguém copiando e colando.",
    benefits: [
      "Notificações automáticas no WhatsApp",
      "Integração com APIs que você já usa",
      "Sincronização de dados em tempo real",
      "Fluxo montado para o seu processo",
    ],
  },
  {
    id: "dashboards",
    icon: LayoutDashboard,
    title: "Painéis administrativos",
    short:
      "Uma tela para ver pedido, cliente, status, resultado e pendência sem abrir quatro sistemas diferentes. Login, permissões e relatório quando precisar.",
    benefits: [
      "Métricas e relatórios úteis",
      "Controle de quem vê o quê",
      "Exportação de dados",
      "Interface simples, sem treinamento longo",
    ],
  },
  {
    id: "delivery",
    icon: ShoppingCart,
    title: "Delivery próprio",
    short:
      "Cardápio online com pedido pelo WhatsApp ou pagamento direto. Para hamburgueria, açaí, pizzaria e mercadinho que quer vender sem depender só de aplicativo.",
    benefits: [
      "Cardápio digital bom no celular",
      "Pedido direto no WhatsApp ou pagamento",
      "Frete calculado por bairro",
      "Painel para aceitar e acompanhar",
    ],
  },
];

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
    tagline: "Para quem precisa parar de improvisar rápido.",
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
    tagline: "Para empresa que já vende e precisa organizar o digital.",
    deliveryTime: "Entrega em até 15 dias",
    support: "30 dias de suporte",
    popular: true,
    features: [
      "Site completo com várias páginas",
      "Painel administrativo simples",
      "Formulários funcionais",
      "Integração com pagamentos",
      "Analytics e páginas importantes",
      "3 revisões inclusas",
    ],
    ctaLabel: "Solicitar orçamento",
  },
  {
    id: "premium",
    name: "Sistema Premium",
    tagline: "Para quem vai rodar parte da operação dentro do sistema.",
    deliveryTime: "Prazo sob consulta",
    support: "90 dias de suporte técnico",
    features: [
      "Sistema customizado do zero",
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

export type ProjectStatus = "online" | "demo" | "em-desenvolvimento" | "privado";

export type PortfolioProject = {
  title: string;
  category: string;
  desc: string;
  url?: string;
  status: ProjectStatus;
  tech: string[];
  color: string;
  screenshot?: string;
};

export const portfolio: PortfolioProject[] = [
  {
    title: "Serra Delivery",
    category: "Sistema de delivery",
    desc: "Cardápio, pedidos, painel e acompanhamento para tirar o atendimento do improviso.",
    status: "em-desenvolvimento",
    tech: ["React", "Node.js", "PostgreSQL", "Mapbox"],
    color: "from-amber-400 to-cyan-700",
  },
  {
    title: "DroxBot",
    category: "Bot Discord + Painel",
    desc: "Bot com moderação, tickets, economia, ranking e painel para configurar sem editar código.",
    status: "online",
    tech: ["Node.js", "Discord.js", "React", "MongoDB"],
    color: "from-cyan-400 to-blue-800",
  },
  {
    title: "Peixe Store",
    category: "Loja digital",
    desc: "Loja com catálogo, carrinho, checkout e gestão de pedidos.",
    url: "https://peixestore.shop/",
    status: "online",
    tech: ["React", "Tailwind", "Stripe"],
    color: "from-teal-400 to-slate-800",
  },
  {
    title: "Copa Ativa",
    category: "Eventos esportivos",
    desc: "Inscrições, tabelas, resultados e ranking de equipes para campeonato local.",
    status: "online",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    color: "from-teal-400 to-cyan-800",
    screenshot: "/screenshots/copa-ativa.png",
  },
];

export const statusLabels: Record<ProjectStatus, { label: string; className: string }> = {
  online: { label: "Online", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  demo: { label: "Demonstração", className: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  "em-desenvolvimento": {
    label: "Em desenvolvimento",
    className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  privado: { label: "Projeto privado", className: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30" },
};

export const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Planos", href: "/planos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Contato", href: "/contato" },
];

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
    text: "Contratei para refazer o sistema interno de controle de demanda da equipe. Em 17 dias estava rodando, com login, dashboard e exportação para Excel. O que mais valeu foi falar direto com quem mexia no código.",
  },
  {
    name: "Ana Beatriz",
    role: "Sabor & Arte",
    text: "Abri meu delivery de açaí e precisava de um site que mandasse o pedido direto para o WhatsApp. No primeiro dia já tive pedido por lá. O Walmry me ensinou a mexer e responde quando preciso.",
  },
  {
    name: "Rafael Costa",
    role: "Comunidade Lobby BR",
    text: "Administro uma comunidade no Discord e o bot virou parte da rotina do servidor. Ticket, economia e moderação funcionam sem travar. Quando preciso ajustar regra, mando mensagem e ele resolve.",
  },
];
