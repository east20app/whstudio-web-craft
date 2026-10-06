export function validPublicBackend(url: string, key: string) {
  try {
    const u = new URL(url);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      u.search ||
      u.hash ||
      !u.hostname.endsWith(".supabase.co")
    )
      return false;
    if (key.startsWith("sb_publishable_")) return key.length > 25;
    const payload = JSON.parse(
      atob(key.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/") || ""),
    );
    return payload.role === "anon";
  } catch {
    return false;
  }
}
