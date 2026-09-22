import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolio, type PortfolioItem } from "@/hooks/usePortfolio";
import { statusLabels, type ProjectStatus } from "@/config/site";
import { logActivity } from "@/lib/activity";
import EmptyState from "./components/EmptyState";

const statusOptions: ProjectStatus[] = ["online", "demo", "em-desenvolvimento", "privado"];
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "avif"];

type Draft = {
  title: string;
  category: string;
  desc: string;
  url: string;
  status: ProjectStatus;
  tech: string;
  coverUrl: string;
  removeCover: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyDraft: Draft = {
  title: "",
  category: "",
  desc: "",
  url: "",
  status: "online",
  tech: "",
  coverUrl: "",
  removeCover: false,
  published: true,
  sortOrder: 0,
};

const PortfolioAdminPage = () => {
  const { data, loading, addProject, updateProject, removeProject } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [toDelete, setToDelete] = useState<PortfolioItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setEditing(null);
    setDraft({ ...emptyDraft, sortOrder: data.length + 1 });
    setOpen(true);
  };

  const openEdit = (p: PortfolioItem) => {
    setEditing(p);
    setDraft({
      title: p.title,
      category: p.category,
      desc: p.desc,
      url: p.url ?? "",
      status: p.status,
      tech: p.tech.join(", "),
      coverUrl: p.coverUrl ?? "",
      removeCover: false,
      published: p.published,
      sortOrder: p.sortOrder,
    });
    setOpen(true);
  };

  const uploadCover = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeExt = ALLOWED_EXT.includes(ext) ? ext : "jpg";
    const path = `${crypto.randomUUID()}.${safeExt}`;
    const { error } = await supabase.storage
      .from("portfolio-covers")
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    if (error) return null;
    const { data: pub } = supabase.storage.from("portfolio-covers").getPublicUrl(path);
    return pub.publicUrl;
  };

  const removeOldCover = async (coverUrl?: string) => {
    if (!coverUrl) return;
    const marker = "/portfolio-covers/";
    const idx = coverUrl.indexOf(marker);
    if (idx === -1) return;
    const path = coverUrl.slice(idx + marker.length).split("?")[0];
    if (!path) return;
    await supabase.storage.from("portfolio-covers").remove([path]);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCover(file);
      if (!url) {
        toast.error("Não foi possível enviar a capa.");
        return;
      }
      setDraft((d) => ({ ...d, coverUrl: url, removeCover: false }));
      toast.success("Capa enviada.");
    } finally {
      setUploading(false);
    }
  };

  const removeCover = () => {
    removeOldCover(draft.coverUrl);
    setDraft((d) => ({ ...d, coverUrl: "", removeCover: true }));
  };

  const save = async () => {
    if (draft.title.trim().length < 2) {
      toast.error("Informe o nome do projeto.");
      return;
    }
    if (draft.removeCover) await removeOldCover(editing?.coverUrl ?? draft.coverUrl);

    const payload = {
      title: draft.title.trim(),
      category: draft.category.trim(),
      desc: draft.desc.trim(),
      url: draft.url.trim(),
      status: draft.status,
      tech: draft.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverUrl: draft.removeCover ? "" : (draft.coverUrl.trim() || undefined),
      published: draft.published,
      sortOrder: Number(draft.sortOrder) || 0,
    };

    const ok = editing
      ? await updateProject(editing.id, payload)
      : await addProject(payload as Omit<PortfolioItem, "id">);

    if (!ok) {
      toast.error("Não foi possível salvar.");
      return;
    }
    await logActivity({
      action: editing ? "portfolio.update" : "portfolio.create",
      entity: "portfolio_projects",
      entityId: editing?.id ?? null,
      details: payload.title,
    });
    toast.success(editing ? "Projeto atualizado." : "Projeto adicionado ao portfólio.");
    setOpen(false);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    removeOldCover(toDelete.coverUrl);
    const ok = await removeProject(toDelete.id);
    if (!ok) {
      toast.error("Não foi possível excluir.");
      return;
    }
    await logActivity({
      action: "portfolio.delete",
      entity: "portfolio_projects",
      entityId: toDelete.id,
      details: toDelete.title,
    });
    toast.success("Projeto excluído do portfólio.");
    setToDelete(null);
  };

  const togglePublished = async (p: PortfolioItem) => {
    const ok = await updateProject(p.id, { published: !p.published });
    if (ok) {
      await logActivity({
        action: p.published ? "portfolio.unpublish" : "portfolio.publish",
        entity: "portfolio_projects",
        entityId: p.id,
        details: p.title,
      });
      toast.success(p.published ? "Projeto oculto no site." : "Projeto visível no site.");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Sys / Portfólio</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">Portfólio</h2>
          <p className="text-sm text-muted-foreground mt-1">
            O que estiver publicado aparece na página /portfolio do site. Projetos com capa ficam mais fortes.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo projeto
        </Button>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : data.length === 0 ? (
        <EmptyState title="Nenhum projeto" description="Adicione o primeiro projeto do portfólio." />
      ) : (
        <div className="border border-border divide-y divide-border overflow-hidden bg-card/30">
          {data.map((p, i) => (
            <div key={p.id} className="px-5 py-4 flex flex-wrap items-start gap-4">
              {p.coverUrl ? (
                <img
                  src={p.coverUrl}
                  alt=""
                  className="w-24 h-16 object-cover border border-border hidden sm:block"
                  loading="lazy"
                />
              ) : (
                <span className="w-24 h-16 border border-border bg-secondary items-center justify-center font-display text-2xl hidden sm:flex" aria-hidden="true">
                  {p.title.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="min-w-[220px] flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{p.title}</p>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${statusLabels[p.status]?.className ?? ""}`}
                  >
                    {statusLabels[p.status]?.label ?? p.status}
                  </span>
                  {!p.published && (
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-border text-muted-foreground">
                      Oculto
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2 max-w-xl">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-border text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                {p.url && (
                  <Button variant="ghost" size="icon" asChild aria-label="Abrir projeto">
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublished(p)}
                  aria-label={p.published ? "Ocultar do site" : "Publicar no site"}
                >
                  {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Editar projeto">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => setToDelete(p)}
                  aria-label="Excluir projeto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar projeto" : "Novo projeto"}</DialogTitle>
            <DialogDescription>Esses dados aparecem no portfólio público.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Capa */}
            <div className="space-y-2">
              <span className="field-label">Capa do projeto</span>
              {draft.coverUrl ? (
                <div className="relative border border-border overflow-hidden">
                  <img src={draft.coverUrl} alt="Prévia da capa" className="w-full aspect-[4/3] object-cover object-top" />
                  <button
                    type="button"
                    onClick={removeCover}
                    className="absolute top-2 right-2 w-8 h-8 border border-border bg-background/90 hover:bg-background flex items-center justify-center"
                    aria-label="Remover capa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-[4/3] border border-dashed border-border bg-card flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {uploading ? (
                    <span className="text-xs">Enviando…</span>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">JPG, PNG, WEBP ou AVIF</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept={ALLOWED_EXT.map((e) => `.${e}`).join(",")}
                onChange={onFile}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Sem capa, o site mostra um monograma + “Projeto privado”. Subir uma imagem deixa o case completo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-title">Nome</Label>
              <Input id="p-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-cat">Categoria</Label>
              <Input
                id="p-cat"
                placeholder="Ex.: Bot Discord + Painel"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-desc">Descrição</Label>
              <Textarea
                id="p-desc"
                className="min-h-[90px]"
                value={draft.desc}
                onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-url">Link (opcional)</Label>
              <Input
                id="p-url"
                placeholder="https://..."
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-tech">Tecnologias (separadas por vírgula)</Label>
              <Input
                id="p-tech"
                placeholder="React, Node.js, PostgreSQL"
                value={draft.tech}
                onChange={(e) => setDraft({ ...draft, tech: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-status">Status</Label>
                <select
                  id="p-status"
                  className="w-full h-10 px-3 bg-background border border-input text-sm"
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as ProjectStatus })}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s].label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-order">Ordem</Label>
                <Input
                  id="p-order"
                  type="number"
                  value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Publicado no site</p>
                <p className="text-xs text-muted-foreground">Desmarque para esconder sem excluir.</p>
              </div>
              <Switch
                checked={draft.published}
                onCheckedChange={(v) => setDraft({ ...draft, published: v })}
                aria-label="Publicado no site"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={uploading}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir “{toDelete?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              O projeto sai do portfólio público na hora. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PortfolioAdminPage;