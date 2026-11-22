import { useEffect, useState } from "react";
import { Copy, FileCode2, Save, GitCompareArrows } from "lucide-react";
import type { Artifact } from "@/lib/builder";
import { Button } from "@/components/ui/button";

export default function BuilderFiles({ artifact, onSave }: { artifact: Artifact; onSave?: (artifact: Artifact) => Promise<void> }) {
  const [files, setFiles] = useState(artifact.files);
  const [path, setPath] = useState("src/App.tsx");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [diff, setDiff] = useState(false);
  useEffect(() => { setFiles(artifact.files); setNotice(""); setDiff(false); }, [artifact]);
  const selected = files.find(f => f.path === path) || files[0];
  if (!selected) return <p role="alert" className="p-5">Nenhum arquivo disponível.</p>;
  const original = artifact.files.find(f => f.path === selected.path)?.content || "";
  const dirty = files.some(f => f.content !== artifact.files.find(a => a.path === f.path)?.content);
  async function save() {
    if (!onSave || saving) return;
    setSaving(true); setNotice("");
    try { await onSave({ ...artifact, files }); setNotice("Nova versão salva."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível salvar."); }
    finally { setSaving(false); }
  }
  return <div className="builder-files grid h-full min-h-[420px] w-full grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[180px_minmax(0,1fr)] md:grid-rows-1">
    <nav aria-label="Arquivos do projeto" className="flex max-h-32 gap-1 overflow-auto border-b border-border p-2 md:max-h-none md:flex-col md:border-b-0 md:border-r">
      {[...files].sort((a,b) => a.path.localeCompare(b.path)).map(file => <Button key={file.path} title={file.path} variant="ghost" onClick={() => { setPath(file.path); setDiff(false); }} className={`h-9 shrink-0 justify-start truncate rounded-sm px-2 font-mono text-[11px] ${selected.path === file.path ? "bg-accent text-primary" : "text-muted-foreground"}`}>
        <FileCode2 className="shrink-0"/><span className="truncate">{file.path}</span>{file.content !== artifact.files.find(f => f.path === file.path)?.content && <span aria-label="Modificado">●</span>}
      </Button>)}
    </nav>
    <div className="flex min-h-0 min-w-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-2">
        <p className="min-w-0 truncate font-mono text-xs text-muted-foreground" title={selected.path}>{selected.path}</p>
        <div className="flex flex-wrap items-center gap-1">
          <Button variant="ghost" size="icon" title="Copiar arquivo" aria-label="Copiar arquivo" onClick={async () => { try { await navigator.clipboard.writeText(selected.content); setNotice("Arquivo copiado."); } catch { setNotice("Não foi possível copiar o arquivo."); } }}><Copy/></Button>
          <Button variant="ghost" size="icon" title="Comparar alterações" aria-label="Comparar alterações" aria-pressed={diff} disabled={selected.content === original} onClick={() => setDiff(!diff)}><GitCompareArrows/></Button>
          {dirty && <Button variant="ghost" size="sm" disabled={saving} onClick={() => { if (window.confirm("Descartar as alterações não salvas?")) { setFiles(artifact.files); setDiff(false); } }}>Descartar</Button>}
          <Button size="sm" disabled={!dirty || saving || !onSave} onClick={save}><Save/>{saving ? "Salvando…" : "Salvar versão"}</Button>
        </div>
      </div>
      {notice && <p role="status" className="border-b border-border px-3 py-2 text-xs text-primary">{notice}</p>}
      {diff ? <div className="grid min-h-0 flex-1 overflow-auto md:grid-cols-2">
        <div className="min-w-0 border-b border-border md:border-b-0 md:border-r"><p className="p-3 text-xs text-muted-foreground">Versão salva</p><pre className="overflow-auto whitespace-pre p-3 font-mono text-xs text-muted-foreground">{original}</pre></div>
        <div className="min-w-0"><p className="p-3 text-xs text-primary">Alterações atuais</p><pre className="overflow-auto whitespace-pre p-3 font-mono text-xs">{selected.content}</pre></div>
      </div> : <textarea aria-label={`Editar ${selected.path}`} spellCheck={false} value={selected.content} onChange={e => setFiles(all => all.map(file => file.path === selected.path ? { ...file, content: e.target.value } : file))} className="min-h-72 flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-relaxed text-foreground outline-none"/>}
    </div>
  </div>;
}
