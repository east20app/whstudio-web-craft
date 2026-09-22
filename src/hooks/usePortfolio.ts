import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ProjectStatus } from "@/config/site";

type PortfolioRow = Database["public"]["Tables"]["portfolio_projects"]["Row"] & {
  cover_url?: string | null;
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  desc: string;
  url?: string;
  status: ProjectStatus;
  tech: string[];
  coverUrl?: string;
  published: boolean;
  sortOrder: number;
  featured: boolean;
};

export const mapPorfolioRow = (r: PortfolioRow): PortfolioItem => ({
  id: r.id,
  title: r.title,
  category: r.category ?? "",
  desc: r.description ?? "",
  url: r.url ?? undefined,
  status: (r.status ?? "online") as ProjectStatus,
  tech: (r.tech ?? []) as string[],
  coverUrl: r.cover_url ?? undefined,
  published: !!r.published,
  sortOrder: r.sort_order ?? 0,
  featured: !!r.featured,
});

const toRow = (p: Partial<PortfolioItem>) => {
  const row: Record<string, unknown> = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.category !== undefined) row.category = p.category;
  if (p.desc !== undefined) row.description = p.desc;
  if (p.url !== undefined) row.url = p.url?.trim() ? p.url.trim() : null;
  if (p.status !== undefined) row.status = p.status;
  if (p.tech !== undefined) row.tech = p.tech;
  if (p.coverUrl !== undefined) row.cover_url = p.coverUrl?.trim() ? p.coverUrl.trim() : null;
  if (p.published !== undefined) row.published = p.published;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  if (p.featured !== undefined) row.featured = p.featured;
  return row;
};

/**
 * Projetos do portfólio vindos do banco (editáveis pelo painel admin).
 * Prefere o RPC restrito `get_public_portfolio`; se a migração ainda não
 * rodou, cai no SELECT público (policy já limita a `published = true`).
 */
export const usePortfolio = (onlyPublished = false) => {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // 1) Público: prefere a função protegida (nenhum dado não-publicado vaza).
    if (onlyPublished) {
      const { data: rpcRows } = await supabase.rpc("get_public_portfolio" as never);
      if (Array.isArray(rpcRows)) {
        setData((rpcRows as unknown as PortfolioRow[]).map(mapPorfolioRow));
        setLoading(false);
        return;
      }
    }
    // 2) Fallback (ou admin): leitura direta; policy RLS limita o anon a publicados.
    let query = supabase
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (onlyPublished) query = query.eq("published", true);
    const { data: rows, error } = await query;
    if (!error && rows) setData((rows as PortfolioRow[]).map(mapPorfolioRow));
    setLoading(false);
  }, [onlyPublished]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = async (p: Omit<PortfolioItem, "id">) => {
    const { error } = await supabase
      .from("portfolio_projects")
      .insert(toRow(p) as unknown as Database["public"]["Tables"]["portfolio_projects"]["Insert"]);
    if (!error) await refresh();
    return !error;
  };

  const updateProject = async (id: string, patch: Partial<PortfolioItem>) => {
    const { error } = await supabase
      .from("portfolio_projects")
      .update(toRow(patch) as unknown as Database["public"]["Tables"]["portfolio_projects"]["Update"])
      .eq("id", id);
    if (!error) await refresh();
    return !error;
  };

  const removeProject = async (id: string) => {
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (!error) await refresh();
    return !error;
  };

  return { data, loading, refresh, addProject, updateProject, removeProject };
};