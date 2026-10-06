import { useEffect, useState } from "react";
import { builderDb, type Artifact, type Project } from "@/lib/builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validPublicBackend } from "@/lib/builder-backend";
export default function BuilderBackend({
  project,
  artifact,
  onSaved,
}: {
  project?: Project;
  artifact: Artifact;
  onSaved: () => void;
}) {
  const [url, setUrl] = useState(project?.backend_url || ""),
    [key, setKey] = useState(project?.backend_key || ""),
    [notice, setNotice] = useState(""),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    setUrl(project?.backend_url || "");
    setKey(project?.backend_key || "");
  }, [project?.id, project?.backend_url, project?.backend_key]);
  const sql = artifact.files.filter((f) => f.path.endsWith(".sql"));
  async function save() {
    if (!project) return;
    if (!validPublicBackend(url, key)) {
      setNotice(
        "Use a URL HTTPS do seu projeto Supabase e uma chave pública publishable/anon. Chaves secretas não são aceitas.",
      );
      return;
    }
    setSaving(true);
    const { error } = await builderDb
      .from("builder_projects")
      .update({ backend_url: url.replace(/\/$/, ""), backend_key: key })
      .eq("id", project.id);
    setNotice(
      error
        ? "Não foi possível salvar a conexão."
        : "Conexão salva. Aplique as migrações e configure o Auth no seu Supabase para usar o sistema.",
    );
    setSaving(false);
    if (!error) onSaved();
  }
  return (
    <div className="h-[650px] w-full overflow-auto p-6">
      <h2 className="font-display text-2xl">Backend do seu projeto</h2>
      <p className="my-4 max-w-2xl text-sm leading-relaxed text-slate-400">
        Conecte um projeto Supabase exclusivo para este sistema. Ele fornece
        banco PostgreSQL, autenticação e API reais. A chave pública pode ser
        usada no navegador; a proteção dos dados depende das políticas RLS das
        migrações.
      </p>
      <div className="max-w-xl space-y-4">
        <label className="block text-sm">
          URL do Supabase
          <Input
            className="mt-2"
            placeholder="https://seu-projeto.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Chave pública (publishable ou anon)
          <Input
            className="mt-2"
            autoComplete="off"
            placeholder="sb_publishable_…"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </label>
        <Button onClick={save} disabled={saving || !project}>
          {saving ? "Salvando…" : "Salvar conexão"}
        </Button>
        {notice && (
          <p role="status" className="text-sm text-blue-300">
            {notice}
          </p>
        )}
      </div>
      <p className="my-5 text-sm text-slate-400">
        Revise e aplique os arquivos SQL no editor do seu Supabase. Depois
        habilite e configure os métodos de login e URLs de redirecionamento. As
        instruções completas estão no README do projeto.
      </p>
      {sql.length ? (
        sql.map((f) => (
          <details
            key={f.path}
            className="mb-3 rounded-lg border border-white/10 p-4"
          >
            <summary className="cursor-pointer font-mono text-xs">
              {f.path}
            </summary>
            <pre className="mt-4 overflow-auto whitespace-pre text-xs text-slate-300">
              {f.content}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(f.content);
                  setNotice("SQL copiado.");
                } catch {
                  setNotice("Selecione e copie o SQL manualmente.");
                }
              }}
            >
              Copiar SQL
            </Button>
          </details>
        ))
      ) : (
        <p className="text-sm text-slate-500">
          Este projeto não contém migrações SQL. Peça à IA para adicionar o
          backend necessário.
        </p>
      )}
    </div>
  );
}
