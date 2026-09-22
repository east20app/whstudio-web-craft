import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { services as configServices } from "@/config/site";
import { Code2, type LucideIcon } from "lucide-react";

export type PublicService = {
  key: string;
  title: string;
  desc: string;
  short: string;
  icon: LucideIcon;
  benefits: string[];
};

type DbServiceRow = {
  id: string;
  name: string;
  description: string;
};

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Casa o serviço do banco com a entrada visual do site.ts (ícone/benefícios). */
function matchConfig(title: string) {
  const t = normalize(title);
  return configServices.find((c) => {
    const id = normalize(c.id);
    const name = normalize(c.title);
    return id === t || name === t || name.includes(t) || t.includes(id);
  });
}

export const toPublicService = (s: (typeof configServices)[number]): PublicService => ({
  key: s.id,
  title: s.title,
  desc: s.short,
  short: s.short,
  icon: s.icon,
  benefits: s.benefits,
});

let cache: Promise<PublicService[] | null> | null = null;

function fetchServices(): Promise<PublicService[] | null> {
  if (!cache) {
    cache = supabase
      .rpc("get_public_services")
      .then(({ data, error }) => {
        if (error) {
          console.warn("[usePublicServices] get_public_services indisponível:", error.message);
          return null;
        }
        const rows = data as DbServiceRow[] | null;
        if (!Array.isArray(rows) || rows.length === 0) return null;
        return rows
          .filter((r) => r.name)
          .map((r) => {
            const c = matchConfig(r.name);
            return {
              key: r.id,
              title: c?.title ?? r.name,
              desc: r.description || c?.short || "",
              short: c?.short ?? r.description ?? "",
              icon: c?.icon ?? Code2,
              benefits: c?.benefits ?? [],
            } as PublicService;
          });
      })
      .catch(() => null);
  }
  return cache;
}

/**
 * Serviços editados no painel admin (tabela `services`), expostos via RPC.
 * Retorna `null` enquanto carrega ou se a migração ainda não rodou
 * (componentes então usam o fallback estático de `site.ts`).
 */
export function usePublicServices(): PublicService[] | null {
  const [services, setServices] = useState<PublicService[] | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    fetchServices().then((s) => {
      if (mounted) setServices(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return services === null ? null : (services ?? null);
}