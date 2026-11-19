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

export const fetchActivity = async (limit = 10): Promise<ActivityEntry[]> => {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
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
