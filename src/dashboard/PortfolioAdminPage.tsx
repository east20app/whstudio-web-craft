import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
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
import { usePortfolio, type PortfolioItem } from "@/hooks/usePortfolio";
import { statusLabels, type ProjectStatus } from "@/config/site";
import { logActivity } from "@/lib/activity";
import EmptyState from "./components/EmptyState";

const statusOptions: ProjectStatus[] = ["online", "demo", "em-desenvolvimento", "privado"];
const colorOptions = [
  "from-blue-500 to-indigo-700",
  "from-orange-500 to-red-600",
  "from-violet-500 to-purple-700",
  "from-violet-600 to-fuchsia-600",
  "from-emerald-500 to-teal-700",
  "from-cyan-500 to-blue-700",
  "from-zinc-600 to-zinc-900",
];

type Draft = {
  title: string;
  category: string;
  desc: string;
  url: string;
  status: ProjectStatus;
  tech: string;
  color: string;
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
  color: colorOptions[0],
  published: true,
  sortOrder: 0,
};

const PortfolioAdminPage = () => {
  const { data, loading, addProject, updateProject, removeProject } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [toDelete, setToDelete] = useState<PortfolioItem | null>(null);

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
      color: p.color,
      published: p.published,
      sortOrder: p.sortOrder,
    });
    setOpen(true);
  };

  const save = async () => {
    if (draft.title.trim().length < 2) {
      toast.error("Informe o nome do projeto.");
      return;
    }
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
      color: draft.color,
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
            O que estiver publicado aqui aparece na página /portfolio do site.
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
        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-card/30">
          {data.map((p, i) => (
            <div key={p.id} className="px-5 py-4 flex flex-wrap items-start gap-4">
              <span className="font-mono text-[10px] text-muted-foreground/50 tabular-nums pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
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
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-sm"
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
            <div className="space-y-2">
              <Label htmlFor="p-color">Cor do card</Label>
              <select
                id="p-color"
                className="w-full h-10 px-3 rounded-md bg-background border border-input text-sm"
                value={draft.color}
                onChange={(e) => setDraft({ ...draft, color: e.target.value })}
              >
                {colorOptions.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("from-", "").replace(" to-", " → ")}
                  </option>
                ))}
              </select>
              <div className={`h-8 rounded-md bg-gradient-to-br ${draft.color}`} aria-hidden="true" />
            </div>
            <div className="flex items-center justify-between border border-border rounded-md px-4 py-3">
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
            <Button onClick={save}>Salvar</Button>
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
