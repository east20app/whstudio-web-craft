import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SettingsRow = {
  site_name: string | null;
  whatsapp: string | null;
  discord_link: string | null;
  footer_text: string | null;
  author_name: string | null;
  accepting_projects: boolean | null;
  availability_note: string | null;
};

export type SiteSettings = {
  loaded: boolean;
  siteName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappFull: string;
  discord: string;
  email: string;
  footerText: string;
  authorName: string;
  acceptingProjects: boolean;
  availabilityNote: string;
  buildWhatsappLink: (message?: string) => string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  loaded: false,
  siteName: "WH Studio",
  whatsappNumber: "5584988766134",
  whatsappDisplay: "(84) 98876-6134",
  whatsappFull: "+55 (84) 98876-6134",
  discord: "https://discord.gg/whstudio",
  email: "contato@whstudio.com.br",
  footerText: "Sites, sistemas e bots feitos do zero.",
  authorName: "Walmry Netto",
  acceptingProjects: true,
  availabilityNote: "Aceitando novos projetos.",
  buildWhatsappLink: () => "",
};

// Cache em nível de módulo: os dois componentes que leem as configurações
// (Header/Footer/CTAFinal/Contact/TicketChat) compartilham a MESMA chamada.
let cache: Promise<SettingsRow | null> | null = null;

function fetchSettings(): Promise<SettingsRow | null> {
  if (!cache) {
    cache = supabase
      .rpc("get_public_settings")
      .then(({ data, error }) => {
        if (error) {
          console.warn("[useSiteSettings] get_public_settings indisponível:", error.message);
          return null;
        }
        const rows = data as SettingsRow[] | null;
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      })
      .catch(() => null);
  }
  return cache;
}

function digitsOf(value: string) {
  return value.replace(/\D/g, "");
}

function formatDisplay(number: string) {
  const d = digitsOf(number);
  const local = d.length === 13 && d.startsWith("55") ? d.slice(2) : d;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return number;
}

function formatFull(number: string) {
  const d = digitsOf(number);
  if (d.length === 13) {
    return `+55 (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  }
  return `+${d}`;
}

export function buildWhatsappLink(message: string, number = "5584988766134") {
  return `https://wa.me/${digitsOf(number)}?text=${encodeURIComponent(message)}`;
}

export function useSiteSettings(): SiteSettings {
  const [row, setRow] = useState<SettingsRow | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((r) => {
      if (mounted) setRow(r);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (row === undefined) return DEFAULT_SETTINGS;

  const number = row?.whatsapp || DEFAULT_SETTINGS.whatsappNumber;
  const siteName = row?.site_name || DEFAULT_SETTINGS.siteName;
  const footerText = row?.footer_text || DEFAULT_SETTINGS.footerText;
  const authorName = row?.author_name || DEFAULT_SETTINGS.authorName;

  return {
    loaded: true,
    siteName,
    whatsappNumber: digitsOf(number),
    whatsappDisplay: formatDisplay(number),
    whatsappFull: formatFull(number),
    discord: row?.discord_link || DEFAULT_SETTINGS.discord,
    email: DEFAULT_SETTINGS.email,
    footerText,
    authorName,
    acceptingProjects: row?.accepting_projects ?? DEFAULT_SETTINGS.acceptingProjects,
    availabilityNote: row?.availability_note || DEFAULT_SETTINGS.availabilityNote,
    buildWhatsappLink: (message = "Olá, vim pelo site e quero solicitar um orçamento.") =>
      buildWhatsappLink(message, number),
  };
}