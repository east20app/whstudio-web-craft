export function validPublicBackend(url: string, key: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || u.username || u.password || u.search || u.hash ||
        !/^[a-z0-9]+\.supabase\.co$/.test(u.hostname) || (u.pathname !== "/" && u.pathname !== "")) return false;
    if (key.startsWith("sb_publishable_")) return key.length > 25 && /^[a-zA-Z0-9_-]+$/.test(key);
    const payload = JSON.parse(atob(key.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/") || ""));
    return payload.role === "anon";
  } catch { return false; }
}