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
    short: "Sites institucionais, landing pages e lojas virtuais com design moderno e foco em conversão.",
    benefits: [
      "Design responsivo e personalizado",
      "Otimizado para Google (SEO)",
      "Integração com WhatsApp",
      "Performance e carregamento rápido",
    ],
  },
  {
    id: "bots-discord",
    icon: Bot,
    title: "Bots para Discord",
    short: "Bots completos sob medida para sua comunidade — moderação, tickets, economia e muito mais.",
    benefits: [
      "Moderação automática",
      "Sistema de tickets e suporte",
      "Economia, ranking e níveis",
      "Comandos personalizados",
    ],
  },
  {
    id: "apis-sistemas",
    icon: Settings,
    title: "APIs e Sistemas",
    short: "Sistemas web e APIs sob medida para automatizar e organizar seu negócio com segurança.",
    benefits: [
      "Banco de dados próprio",
      "Login seguro e permissões",
      "APIs REST documentadas",
      "Escalável e fácil de manter",
    ],
  },
  {
    id: "automacao",
    icon: Zap,
    title: "Automação",
    short: "Automatize processos, integrações e fluxos repetitivos para ganhar produtividade real.",
    benefits: [
      "Notificações automáticas",
      "Integrações com APIs externas",
      "Sincronização de dados",
      "Workflows sob medida",
    ],
  },
  {
    id: "dashboards",
    icon: LayoutDashboard,
    title: "Dashboards",
    short: "Painéis administrativos com gráficos, relatórios e gestão centralizada do seu negócio.",
    benefits: [
      "Métricas em tempo real",
      "Controle de permissões",
      "Exportação de relatórios",
      "Interface intuitiva",
    ],
  },
  {
    id: "delivery",
    icon: ShoppingCart,
    title: "Sistemas de Delivery",
    short: "Plataforma de pedidos online para restaurantes, lanchonetes e mercados.",
    benefits: [
      "Cardápio digital responsivo",
      "Pedidos pelo WhatsApp ou painel",
      "Cálculo de frete por bairro",
      "Painel para o estabelecimento",
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
    tagline: "Para tirar sua ideia do papel rapidamente.",
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
    tagline: "Solução completa para empresas que querem crescer.",
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
    tagline: "Sistemas sob medida com dashboard, API e integrações.",
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
  online: { label: "Online", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  demo: { label: "Demonstração", className: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  "em-desenvolvimento": {
    label: "Em desenvolvimento",
    className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  privado: { label: "Projeto privado", className: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30" },
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
    text: "A WH Studio entregou nosso sistema em pouco mais de duas semanas. Comunicação clara e código de qualidade.",
  },
  {
    name: "Ana Beatriz",
    role: "Sabor & Arte",
    text: "Meu site de delivery ficou exatamente como eu queria. Atendimento direto pelo WhatsApp facilitou demais.",
  },
  {
    name: "Rafael Costa",
    role: "Comunidade Discord",
    text: "O bot que criaram para nosso servidor é completo: moderação, tickets, economia. Está tudo funcionando muito bem.",
  },
];
