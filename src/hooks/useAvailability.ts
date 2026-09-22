import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];

type Availability = {
  accepting: boolean;
  note: string;
  loaded: boolean;
};

/** Lê o status público de disponibilidade definido no painel. */
export const useAvailability = (): Availability => {
  const [state, setState] = useState<Availability>({ accepting: true, note: "", loaded: false });

  useEffect(() => {
    let alive = true;
    supabase
      .rpc("get_public_settings")
      .maybeSingle()
      .then(({ data }: { data: SettingsRow | null }) => {
        if (!alive) return;
        setState({
          accepting: data?.accepting_projects ?? true,
          note: data?.availability_note ?? "",
          loaded: true,
        });
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
};
