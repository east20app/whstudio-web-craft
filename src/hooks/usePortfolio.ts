import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectStatus } from "@/config/site";

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  desc: string;
  url?: string;
  status: ProjectStatus;
  tech: string[];
  color: string;
  published: boolean;
  sortOrder: number;
};

const mapRow = (r: any): PortfolioItem => ({
  id: r.id,
  title: r.title,
  category: r.category ?? "",
  desc: r.description ?? "",
  url: r.url ?? undefined,
  status: (r.status ?? "online") as ProjectStatus,
  tech: (r.tech ?? []) as string[],
  color: r.color ?? "from-blue-500 to-indigo-700",
  published: !!r.published,
  sortOrder: r.sort_order ?? 0,
});

const toRow = (p: Partial<PortfolioItem>) => {
  const row: Record<string, unknown> = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.category !== undefined) row.category = p.category;
  if (p.desc !== undefined) row.description = p.desc;
  if (p.url !== undefined) row.url = p.url?.trim() ? p.url.trim() : null;
  if (p.status !== undefined) row.status = p.status;
  if (p.tech !== undefined) row.tech = p.tech;
  if (p.color !== undefined) row.color = p.color;
  if (p.published !== undefined) row.published = p.published;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

/** Projetos do portfólio vindos do banco (editáveis pelo painel admin). */
export const usePortfolio = (onlyPublished = false) => {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    let query = supabase
      .from("portfolio_projects" as any)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (onlyPublished) query = query.eq("published", true);
    const { data: rows, error } = await query;
    if (!error && rows) setData((rows as any[]).map(mapRow));
    setLoading(false);
  }, [onlyPublished]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = async (p: Omit<PortfolioItem, "id">) => {
    const { error } = await supabase.from("portfolio_projects" as any).insert(toRow(p) as any);
    if (!error) await refresh();
    return !error;
  };

  const updateProject = async (id: string, patch: Partial<PortfolioItem>) => {
    const { error } = await supabase
      .from("portfolio_projects" as any)
      .update(toRow(patch) as any)
      .eq("id", id);
    if (!error) await refresh();
    return !error;
  };

  const removeProject = async (id: string) => {
    const { error } = await supabase.from("portfolio_projects" as any).delete().eq("id", id);
    if (!error) await refresh();
    return !error;
  };

  return { data, loading, refresh, addProject, updateProject, removeProject };
};
