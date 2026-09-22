import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ActivityRow = Database["public"]["Tables"]["activity_log"]["Row"];

export type ActivityEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
};

/** Registra uma ação do admin no log de atividade (silencioso em caso de erro). */
export const logActivity = async (input: {
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
}) => {
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("activity_log").insert({
      actor: data.session?.user.email ?? "admin",
      action: input.action,
      entity: input.entity,
      entity_id: input.entityId ?? null,
      details: input.details ?? null,
    });
  } catch {
    /* log não deve quebrar a operação principal */
  }
};

export const fetchActivity = async (limit = 10): Promise<ActivityEntry[]> => {
  const { data } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data as ActivityRow[]) ?? []).map((r) => ({
    id: r.id,
    actor: r.actor ?? "",
    action: r.action,
    entity: r.entity ?? "",
    entityId: r.entity_id ?? null,
    details: r.details ?? null,
    createdAt: r.created_at,
  }));
};
