import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Budget } from "../types";

export default function BudgetDetails({ budget }: { budget: Budget }) {
  const [files, setFiles] = useState<{ id: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load(open: boolean) {
    if (!open) return;
    setError("");
    setLoading(true);
    try {
      const result = await supabase.from("budget_attachments").select("id,filename").eq("budget_id", budget.id);
      if (result.error) throw result.error;
      setFiles(result.data);
    } catch {
      setError("Não foi possível consultar os anexos.");
    } finally {
      setLoading(false);
    }
  }

  async function download(id: string) {
    setError("");
    setDownloading(id);
    try {
      const result = await supabase.from("budget_attachments").select("filename,payload").eq("id", id).eq("budget_id", budget.id).single();
      if (result.error) throw result.error;
      const bytes = Uint8Array.from(atob(result.data.payload), character => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.data.filename;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      setError("Não foi possível baixar o anexo.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <Dialog onOpenChange={load}>
      <DialogTrigger asChild><Button variant="link" className="h-auto whitespace-normal p-0 text-left">{budget.client}</Button></DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-auto">
        <DialogTitle>{budget.client}</DialogTitle>
        <DialogDescription>{budget.service} · {budget.contact}</DialogDescription>
        {budget.notes && <p className="whitespace-pre-wrap break-words">{budget.notes}</p>}
        {loading && <p role="status">Consultando anexos…</p>}
        {error && <p role="alert" className="text-red-400">{error}</p>}
        {files.length > 0 && <ul className="grid gap-2">
          {files.map(({ id, filename }) => <li key={id}><Button variant="outline" disabled={downloading !== null} onClick={() => download(id)}>{downloading === id ? "Baixando…" : filename}</Button></li>)}
        </ul>}
      </DialogContent>
    </Dialog>
  );
}
