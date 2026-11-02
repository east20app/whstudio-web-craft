import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAccess(userId?: string) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let active = true;
    setChecking(true);
    setIsAdmin(false);
    async function check() {
      if (!userId) {
        if (active) setChecking(false);
        return;
      }
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user?.id === userId) {
        const { data, error: roleError } = await supabase.rpc("is_admin");
        if (active) setIsAdmin(!roleError && data === true);
      }
      if (active) setChecking(false);
    }
    void check();
    return () => { active = false; };
  }, [userId]);
  return { isAdmin, checking };
}