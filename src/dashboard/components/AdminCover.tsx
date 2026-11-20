import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { portfolioStoragePath, publicPortfolioCover } from "@/lib/portfolio-url";

export default function AdminCover({ value, alt, className }: { value?: string; alt: string; className: string }) {
  const [preview, setPreview] = useState<{ value?: string; url: string }>();
  const path = portfolioStoragePath(value);
  useEffect(() => {
    if (!path) return;
    let mounted = true;
    let objectUrl: string | undefined;
    void supabase.storage.from("portfolio-covers").download(path).then(({ data }) => {
      if (!mounted || !data) return;
      objectUrl = URL.createObjectURL(data);
      setPreview({ value, url: objectUrl });
    });
    return () => {
      mounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path, value]);

  const source = path && preview?.value === value ? preview?.url : publicPortfolioCover(value);
  return source ? <img src={source} alt={alt} className={className} loading="lazy" /> : null;
}
