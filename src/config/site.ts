// Configuração central do site WH Studio
// Edite aqui qualquer informação de marca, contato, planos, serviços ou portfólio.

export const siteConfig = {
  name: "WH Studio",
  shortName: "WH",
  slogan: "Transformando ideias em sistemas reais",
  description:
    "WH Studio — desenvolvimento de sites profissionais, bots para Discord, sistemas personalizados, dashboards, automações e hospedagem. Solicite seu orçamento.",
  url: "https://whstudio.site",
  email: "contato@whstudio.com.br",
  whatsapp: {
    number: "5584988766134",
    display: "(84) 98876-6134",
  },
  social: {
    discord: "#",
    instagram: "#",
    github: "#",
  },
  defaultMessages: {
    generic: "Olá, vim pelo site da WH Studio e gostaria de solicitar um orçamento!",
    service: (service: string) =>
      `Olá, vim pelo site da WH Studio. Tenho interesse no serviço: ${service}.`,
    plan: (plan: string) =>
      `Olá, vim pelo site da WH Studio. Tenho interesse no plano ${plan}. Pode me enviar mais detalhes?`,
    simulator: (services: string[], total: number) =>
      `Olá, vim pelo site da WH Studio.\n\nGostaria de um orçamento para os seguintes serviços:\n${services
        .map((s) => `• ${s}`)
        .join("\n")}\n\nEstimativa inicial: R$ ${total}\n\nAguardo retorno.`,
    contactForm: (data: { name: string; email: string; project?: string; message: string }) =>
      `Olá, vim pelo site da WH Studio.\n\nNome: ${data.name}\nE-mail: ${data.email}${
        data.project ? `\nProjeto: ${data.project}` : ""
      }\nMensagem: ${data.message}`,
  },
} as const;

// Helper para gerar link de WhatsApp pré-preenchido com mensagem
export const whatsappLink = (message: string = siteConfig.defaultMessages.generic) =>
  `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;

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
    id: "site-institucional",
    icon: Globe,
    title: "Sites institucionais",
    short: "Presença digital profissional para sua empresa, com design moderno e foco em credibilidade.",
    benefits: [
      "Design responsivo e personalizado",
      "Otimizado para Google (SEO)",
      "Integração com WhatsApp",
      "Carregamento ultra-rápido",
    ],
  },
  {
    id: "landing-page",
    icon: Rocket,
    title: "Landing pages",
    short: "Páginas de alta conversão para campanhas, lançamentos e captação de leads.",
    benefits: [
      "Foco total em conversão",
      "Formulários inteligentes",
      "Integração com pixels e analytics",
      "A/B test friendly",
    ],
  },
  {
    id: "loja-virtual",
    icon: ShoppingCart,
    title: "Lojas virtuais",
    short: "E-commerces completos com catálogo, carrinho e pagamento integrado.",
    benefits: [
      "Catálogo dinâmico",
      "Pagamento Pix, cartão e boleto",
      "Painel para gerenciar pedidos",
      "Integração com frete",
    ],
  },
  {
    id: "bot-discord",
    icon: Bot,
    title: "Bots para Discord",
    short: "Bots completos sob medida para sua comunidade ou servidor.",
    benefits: [
      "Moderação automática",
      "Sistema de tickets e suporte",
      "Economia, ranking e níveis",
      "Comandos personalizados",
    ],
  },
  {
    id: "sistema-personalizado",
    icon: Settings,
    title: "Sistemas personalizados",
    short: "Sistemas web sob medida para automatizar e organizar seu negócio.",
    benefits: [
      "Banco de dados próprio",
      "Login seguro de usuários",
      "Regras de negócio sob medida",
      "Escalável e fácil de manter",
    ],
  },
  {
    id: "painel-admin",
    icon: LayoutDashboard,
    title: "Painel administrativo",
    short: "Dashboards com gráficos, relatórios e gestão centralizada.",
    benefits: [
      "Gráficos e métricas em tempo real",
      "Controle de permissões",
      "Exportação de relatórios",
      "Interface intuitiva",
    ],
  },
  {
    id: "delivery",
    icon: ShoppingCart,
    title: "Sistema de delivery",
    short: "Plataforma de pedidos online para restaurantes, lanchonetes e mercados.",
    benefits: [
      "Cardápio digital responsivo",
      "Pedido pelo WhatsApp ou painel",
      "Cálculo de frete por bairro",
      "Painel para o estabelecimento",
    ],
  },
  {
    id: "automacao",
    icon: Zap,
    title: "Automações",
    short: "Automatize processos repetitivos e ganhe tempo no seu dia a dia.",
    benefits: [
      "Notificações por e-mail e WhatsApp",
      "Integrações com planilhas",
      "Fluxos automatizados",
      "Sincronização de dados",
    ],
  },
  {
    id: "api-integracao",
    icon: Plug,
    title: "APIs e integrações",
    short: "Conecte sistemas, plataformas e serviços com APIs robustas.",
    benefits: [
      "APIs REST sob medida",
      "Integração com Stripe, Mercado Pago e outros",
      "Webhooks confiáveis",
      "Documentação clara",
    ],
  },
  {
    id: "hospedagem",
    icon: Server,
    title: "Hospedagem de projetos",
    short: "Hospedagem rápida e confiável com suporte técnico incluso.",
    benefits: [
      "Uptime de 99.9%",
      "SSL gratuito",
      "Backups automáticos",
      "Suporte direto pelo WhatsApp",
    ],
  },
];

// =============== PLANOS ===============
export type Plan = {
  id: string;
  name: string;
  tagline: string;
  priceFrom: number;
  priceSuffix?: string;
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
    priceFrom: 350,
    deliveryTime: "Entrega em até 7 dias",
    support: "15 dias de suporte",
    features: [
      "Landing page ou site simples (até 3 páginas)",
      "Design responsivo (mobile, tablet e desktop)",
      "WhatsApp integrado",
      "SEO básico configurado",
      "1 revisão inclusa",
    ],
    ctaLabel: "Quero o plano Inicial",
  },
  {
    id: "profissional",
    name: "Profissional",
    tagline: "Solução completa para empresas que querem crescer.",
    priceFrom: 900,
    deliveryTime: "Entrega em até 15 dias",
    support: "30 dias de suporte",
    popular: true,
    features: [
      "Site completo com várias páginas",
      "Painel administrativo simples",
      "Formulários funcionais com envio",
      "Integração com pagamentos (Pix / cartão)",
      "SEO avançado e Google Analytics",
      "3 revisões inclusas",
    ],
    ctaLabel: "Quero o plano Profissional",
  },
  {
    id: "premium",
    name: "Sistema Premium",
    tagline: "Sistemas sob medida com dashboard, API e integrações.",
    priceFrom: 2500,
    priceSuffix: "+",
    deliveryTime: "Entrega sob consulta",
    support: "90 dias de suporte avançado",
    features: [
      "Sistema sob medida do zero",
      "Dashboard administrativo completo",
      "API própria para integrações",
      "Login e controle de usuários",
      "Banco de dados dedicado",
      "Integração com bot do Discord",
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
    title: "Peixe Store",
    category: "E-commerce",
    desc: "Loja virtual completa com catálogo, carrinho e pagamento integrado.",
    url: "https://peixestore.shop/",
    status: "online",
    tech: ["React", "Tailwind", "Stripe"],
    color: "from-blue-600 to-cyan-600",
  },
  {
    title: "DeliveryPro",
    category: "Sistema de delivery",
    desc: "Plataforma de pedidos online com cardápio digital e painel administrativo.",
    status: "em-desenvolvimento",
    tech: ["Next.js", "PostgreSQL", "WhatsApp API"],
    color: "from-orange-500 to-red-600",
  },
  {
    title: "ModBot",
    category: "Bot Discord",
    desc: "Bot de moderação com tickets, economia, ranking e logs automáticos.",
    status: "privado",
    tech: ["Node.js", "Discord.js", "MongoDB"],
    color: "from-violet-500 to-purple-700",
  },
  {
    title: "AdminPanel",
    category: "Dashboard",
    desc: "Painel administrativo com gráficos, relatórios e gestão de usuários.",
    status: "demo",
    tech: ["React", "Recharts", "Supabase"],
    color: "from-emerald-500 to-teal-700",
  },
];

export const statusLabels: Record<ProjectStatus, { label: string; className: string }> = {
  online: { label: "Online", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  demo: { label: "Demonstração", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
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
