import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

const OG_IMAGE = `${siteConfig.url}/og-image.jpg`;

type SeoProps = {
  title: string;
  description: string;
  path: string;
  /** JSON-LD extra específico da página. */
  jsonLd?: Record<string, unknown>;
};

/** Metadados por página (title, description, canonical, OG e Twitter). */
const Seo = ({ title, description, path, jsonLd }: SeoProps) => {
  const url = `${siteConfig.url}${path === "/" ? "/" : path}`;
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

/** Textos de SEO das páginas públicas — mesmo tom de voz do site. */
export const pageSeo = {
  home: {
    title: "WH Studio — Sites, sistemas e bots feitos do zero",
    description:
      "Site, loja virtual, bot de Discord, sistema e automação sob medida. Código do zero, prazo curto e atendimento direto com quem programa.",
    path: "/",
  },
  servicos: {
    title: "Serviços — Sites, bots, APIs e automação | WH Studio",
    description:
      "Criação de sites, bots para Discord, APIs e sistemas, automação, dashboards e delivery. Veja o que está incluído em cada serviço.",
    path: "/servicos",
  },
  sistemas: {
    title: "Sistemas sob medida — Painel, login e integrações | WH Studio",
    description:
      "Sistema web feito para o processo da sua empresa: painel com login, cadastros, relatórios e integrações. Escopo fechado antes de escrever o código.",
    path: "/sistemas",
  },
  planos: {
    title: "Planos e prazos — Inicial, Profissional e Premium | WH Studio",
    description:
      "Compare os planos Inicial, Profissional e Sistema Premium: o que entra, prazo de entrega e tempo de suporte. Orçamento fechado antes de começar.",
    path: "/planos",
  },
  portfolio: {
    title: "Portfólio — Projetos entregues pela WH Studio",
    description:
      "Delivery, bot de Discord com painel, loja virtual e plataforma de campeonatos. Veja projetos reais, tecnologias usadas e o que está no ar.",
    path: "/portfolio",
  },
  contato: {
    title: "Contato — Peça seu orçamento | WH Studio",
    description:
      "Conte o que você precisa e receba um orçamento fechado em até 24 horas úteis. Atendimento pela central do site ou pelo WhatsApp.",
    path: "/contato",
  },
  sobre: {
    title: "Sobre — Como trabalha a WH Studio",
    description:
      "Um estúdio, uma pessoa por trás de cada projeto. Conheça os princípios, as etapas de trabalho e os limites honestos da WH Studio.",
    path: "/sobre",
  },
} as const;

/** JSON-LD: organização / estúdio de serviços profissionais. */
export const orgJsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "WH Studio",
  url: siteConfig.url,
  email: siteConfig.email,
  founder: { "@type": "Person", name: siteConfig.author },
  areaServed: "BR",
  description: siteConfig.description,
  sameAs: [siteConfig.social.discord],
};

export default Seo;
