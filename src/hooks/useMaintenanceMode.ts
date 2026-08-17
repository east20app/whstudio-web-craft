import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MaintenanceState = {
  active: boolean;
  message: string;
  eta: string;
  loaded: boolean;
};

const initial: MaintenanceState = { active: false, message: "", eta: "", loaded: false };

const mapRow = (data: any): MaintenanceState => ({
  active: data?.maintenance_mode ?? false,
  message: data?.maintenance_message ?? "",
  eta: data?.maintenance_eta ?? "",
  loaded: true,
});

/** Lê o modo de manutenção público (settings) e escuta mudanças em tempo real. */
export const useMaintenanceMode = (): MaintenanceState => {
  const [state, setState] = useState<MaintenanceState>(initial);

  useEffect(() => {
    let alive = true;

    const load = () =>
      supabase
        .rpc("get_public_settings" as any)
        .maybeSingle()
        .then(({ data }: any) => {
          if (alive) setState(mapRow(data));
        });

    load();

    const channel = supabase
      .channel("settings-maintenance")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, (payload) => {
        if (alive) setState(mapRow(payload.new));
      })
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return state;
};
