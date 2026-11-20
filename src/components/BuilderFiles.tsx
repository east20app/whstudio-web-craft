import { useEffect, useState } from "react";
import type { Artifact } from "@/lib/builder";
import { Button } from "@/components/ui/button";

export default function BuilderFiles({
  artifact,
  onSave,
}: {
  artifact: Artifact;
  onSave?: (artifact: Artifact) => Promise<void>;
}) {
  const [files, setFiles] = useState(artifact.files);
  const [path, setPath] = useState("src/App.tsx");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    setFiles(artifact.files);
    setNotice("");
  }, [artifact]);
  const selected = files.find((f) => f.path === path) || files[0];
  const dirty = files.some(
    (f, i) => f.content !== artifact.files[i]?.content,
  );
  async function save() {
    if (!onSave) return;
    setSaving(true);
    setNotice("");
    try {
      await onSave({ ...artifact, files });
      setNotice("Salvo como nova versão.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="grid min-h-[520px] w-full grid-rows-[auto_minmax(0,1fr)] sm:h-[650px] sm:grid-cols-[minmax(120px,.28fr)_minmax(0,1fr)] sm:grid-rows-1">
      <nav
        aria-label="Arquivos do projeto"
        className="flex max-h-36 gap-1 overflow-auto border-b border-white/10 p-2 sm:max-h-none sm:flex-col sm:border-b-0 sm:border-r"
      >
        {files.map((f, i) => (
          <button
            key={f.path}
            title={f.path}
            onClick={() => setPath(f.path)}
            className={`block max-w-52 shrink-0 truncate p-2 sm:w-full sm:max-w-none text-left font-mono text-xs ${selected.path === f.path ? "bg-blue-500/15 text-blue-300" : "text-slate-400 hover:bg-white/5"}`}
          >
            {f.content !== artifact.files[i]?.content ? "● " : ""}
            {f.path}
          </button>
        ))}
      </nav>
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-2 pl-3">
          <p className="truncate font-mono text-xs text-slate-400">
            {selected.path}
          </p>
          <div className="flex items-center gap-2">
            {notice && (
              <span role="status" className="text-xs text-blue-300">
                {notice}
              </span>
            )}
            {dirty && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFiles(artifact.files)}
              >
                Descartar
              </Button>
            )}
            <Button size="sm" disabled={!dirty || saving} onClick={save}>
              {saving ? "Salvando…" : "Salvar (sem crédito)"}
            </Button>
          </div>
        </div>
        <textarea
          aria-label={`Editar ${selected.path}`}
          spellCheck={false}
          value={selected.content}
          onChange={(e) =>
            setFiles((all) =>
              all.map((f) =>
                f.path === selected.path ? { ...f, content: e.target.value } : f,
              ),
            )
          }
          className="min-h-80 flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-300 outline-none"
        />
      </div>
    </div>
  );
}
