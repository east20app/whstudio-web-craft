import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { zipSync, strToU8 } from "fflate";
import type { Artifact } from "../../supabase/functions/_shared/artifact";
import { validPublicBackend } from "@/lib/builder-backend";
export type { Artifact };
export type Project = {
  id: string;
  user_id: string;
  title: string;
  kind: "site" | "system";
  created_at: string;
  backend_url: string | null;
  backend_key: string | null;
};
export type Generation = {
  id: string;
  project_id: string;
  user_id: string;
  prompt: string;
  status: "pending" | "complete" | "error";
  artifact: Artifact | null;
  error: string | null;
  created_at: string;
};
type Table<R, I> = { Row: R; Insert: I; Update: Partial<R>; Relationships: [] };
type BuilderDatabase = {
  public: {
    Tables: {
      builder_projects: Table<
        Project,
        { user_id: string; kind: "site" | "system"; title?: string }
      >;
      builder_generations: Table<Generation, never>;
      builder_wallets: Table<{ user_id: string; balance: number }, never>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
// Reuse the existing authenticated client; this schema accompanies the builder migration.
export const builderDb = supabase as unknown as SupabaseClient<BuilderDatabase>;
export async function builderRequest(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("wh-builder", {
    body,
  });
  if (error) {
    let message =
      "Não foi possível acessar a WH Studio AI. Verifique se o serviço foi ativado.";
    if (error.context instanceof Response) {
      try {
        message = (await error.context.json()).error || message;
      } catch {
        /* retain readable fallback */
      }
    }
    throw new Error(message);
  }
  if (data.error) throw new Error(data.error);
  return data as { generation?: Generation; url?: string };
}
export function backendModule(url = "", key = "") {
  if (!validPublicBackend(url, key)) {
    url = "";
    key = "";
  }
  return `import { createClient } from '@supabase/supabase-js';\nconst url=${JSON.stringify(url)};\nconst key=${JSON.stringify(key)};\nexport const supabase = url && key ? createClient(url,key) : null;\nexport const backendConfigured = Boolean(supabase);\n`;
}
export function projectArchive(artifact: Artifact, project?: Project) {
  const entries = Object.fromEntries(
    artifact.files.map((f) => [f.path, strToU8(f.content)]),
  );
  entries["src/lib/supabase.ts"] = strToU8(
    backendModule(project?.backend_url || "", project?.backend_key || ""),
  );
  return zipSync(entries);
}
export function downloadProject(artifact: Artifact, project?: Project) {
  const archive = projectArchive(artifact, project);
  const blob = new Blob([archive as BlobPart], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${artifact.title.replace(/[^a-z0-9-]/gi, "-") || "projeto"}.zip`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
