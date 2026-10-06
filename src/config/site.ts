// Configuração central do site WH Studio

export const siteConfig = {
  name: "WH Studio",
  shortName: "WH",
  slogan: "Desenvolvimento de sites e sistemas para empresas",
  description:
    "WH Studio — empresa de desenvolvimento de sites, sistemas personalizados e automações. Design, integração e suporte conforme seu projeto.",
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
    short: "Sites institucionais, landing pages e lojas virtuais com design responsivo, conteúdo organizado e canais de contato integrados.",
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
    short: "Bot de Discord do jeito que o seu servidor precisa: moderação automática, sistema de tickets, economia, ranks, painel web pra administrar. Configuramos os recursos conforme as necessidades da sua comunidade.",
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
    short: "Sistemas web e APIs para cadastros, pedidos, financeiro e controle interno. Funcionalidades definidas a partir dos processos da sua empresa.",
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
    short: "Integrações entre WhatsApp, planilhas, e-mail, sistemas e CRM para automatizar tarefas e manter informações sincronizadas.",
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
    short: "Painéis administrativos com login, permissões, indicadores e relatórios para acompanhar a operação da empresa.",
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
    short: "Cardápio digital, pedidos, pagamentos e gestão de entregas para restaurantes e comércios, com recursos definidos para cada operação.",
    benefits: [
      "Cardápio digital bonito no celular",
      "Pedido direto no WhatsApp ou pagamento",
      "Frete calculado por bairro",
      "Painel pra você aceitar e acompanhar",
    ],
  },
];

// =============== PORTFÓLIO ===============
export type ProjectStatus = "online" | "demo" | "em-desenvolvimento" | "privado";

/** Rótulos de status em estilo editorial: mono, com cor contida para distinção. */
export const statusLabels: Record<ProjectStatus, { label: string; className: string }> = {
  online: {
    label: "Online",
    className: "border-border text-emerald-600 dark:text-emerald-400",
  },
  demo: {
    label: "Demonstração",
    className: "border-border text-accent-2 dark:text-accent-2",
  },
  "em-desenvolvimento": {
    label: "Em desenvolvimento",
    className: "border-border text-warning dark:text-warning",
  },
  privado: {
    label: "Projeto privado",
    className: "border-border text-muted-foreground",
  },
};

// =============== NAVEGAÇÃO ===============
export const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Orçamento", href: "/orcamento" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
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
