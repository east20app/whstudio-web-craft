import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { portfolioWebUrl } from "@/lib/portfolio-url";

function coverPath(value: string) {
  const prefix = "portfolio-covers/";
  if (value.startsWith(prefix)) return value.slice(prefix.length);
  try {
    const url = new URL(value);
    const storagePrefix = "/storage/v1/object/public/" + prefix;
    if (url.origin === new URL(import.meta.env.VITE_SUPABASE_URL).origin && url.pathname.startsWith(storagePrefix)) {
      return decodeURIComponent(url.pathname.slice(storagePrefix.length));
    }
  } catch {
    return null;
  }
  return null;
}

export function usePortfolioCover(value?: string) {
  const path = value ? coverPath(value) : null;
  const [signed, setSigned] = useState<{ path: string; url: string }>();
  useEffect(() => {
    if (!path) return;
    let active = true;
    const refresh = async () => {
      const { data } = await supabase.storage.from("portfolio-covers").createSignedUrl(path, 300);
      if (active && data?.signedUrl) setSigned({ path, url: data.signedUrl });
    };
    void refresh();
    const timer = window.setInterval(refresh, 240_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [path]);
  return path ? (signed?.path === path ? signed.url : null) : portfolioWebUrl(value);
}
