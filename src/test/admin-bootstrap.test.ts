// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = process.env.RUN_ADMIN_BOOTSTRAP_TEST === "1" && !!url && !!key;

describe.skipIf(!enabled)("first-account administrator integration", () => {
  it("grants only the first account admin, blocks later accounts, and does not reopen after deletion", async () => {
    if (!url || !key) throw new Error("Missing test binding");
    const client = createClient(url, key, { auth: { persistSession: false } });
    const ids: string[] = [];
    async function account() {
      const { data, error } = await client.auth.admin.createUser({
        email: `bootstrap-${randomUUID()}@example.com`,
        password: randomUUID() + randomUUID(), email_confirm: true,
      });
      if (error || !data.user) throw new Error("Test account creation failed");
      ids.push(data.user.id);
      return data.user.id;
    }
    try {
      const { data: open, error: initialError } = await client.rpc("admin_signup_available");
      expect(initialError).toBeNull();
      expect(open).toBe(true);
      const first = await account();
      const later = await Promise.all([account(), account()]);
      const { data: roles, error } = await client.from("user_roles").select("user_id,role").in("user_id", ids);
      expect(error).toBeNull();
      expect(roles?.filter(row => row.role === "admin")).toEqual([{ user_id: first, role: "admin" }]);
      for (const id of later) expect(roles).toContainEqual({ user_id: id, role: "user" });
      const { error: deleteError } = await client.auth.admin.deleteUser(first);
      expect(deleteError).toBeNull();
      const { data: stillOpen } = await client.rpc("admin_signup_available");
      expect(stillOpen).toBe(false);
      const last = await account();
      const { data: lastRole } = await client.from("user_roles").select("role").eq("user_id", last).single();
      expect(lastRole?.role).toBe("user");
    } finally {
      for (const id of ids) await client.auth.admin.deleteUser(id);
    }
  }, 60000);
});