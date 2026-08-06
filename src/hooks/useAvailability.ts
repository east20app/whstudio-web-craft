import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      .from("settings")
      .select("accepting_projects, availability_note")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
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
