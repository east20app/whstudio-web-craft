/** Accept only public web addresses for live previews and outbound project links. */
export function portfolioWebUrl(value?: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || !url.hostname || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function publicPortfolioCover(value?: string | null): string | null {
  if (!value || !/^https:\/\//i.test(value)) return null;
  const url = portfolioWebUrl(value);
  if (!url || new URL(url).pathname.includes("/portfolio-covers/")) return null;
  return url;
}

export function portfolioStoragePath(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const backend = new URL(import.meta.env.VITE_SUPABASE_URL);
    const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|authenticated)\/portfolio-covers\/(.+)$/);
    return url.origin === backend.origin && match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}
