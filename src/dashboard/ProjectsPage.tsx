import { useMemo, useState } from "react";
import { Search, Trash2, Plus, CheckCircle2, Send, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StatusPill from "./components/StatusPill";
import EmptyState from "./components/EmptyState";
import { useProjects, useFeedbacks } from "./store";
import type { ProjectStage } from "./types";
import { toast } from "sonner";

const stageOptions: { value: ProjectStage; label: string }[] = [
  { value: "planejamento", label: "Planejamento" },
  { value: "desenvolvimento", label: "Desenvolvimento" },
  { value: "revisao", label: "Revisão" },
  { value: "entregue", label: "Entregue" },
];

const tone = (s: ProjectStage) =>
  s === "planejamento" ? "gray" : s === "desenvolvimento" ? "blue" : s === "revisao" ? "yellow" : "green";

const ProjectsPage = () => {
  const { data: projects, loading, addProject, updateProjectStage, removeProject } = useProjects();
  const { data: feedbacks, releaseFeedback } = useFeedbacks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProjectStage | "all">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    type: "",
    deadline: "",
    stage: "planejamento" as ProjectStage,
  });

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchSearch = (p.name + p.client).toLowerCase().includes(search.toLowerCase());
        const matchStage = filter === "all" || p.stage === filter;
        return matchSearch && matchStage;
      }),
    [projects, search, filter]
  );

  const add = async () => {
    if (!form.name || !form.client) return toast.error("Preencha nome e cliente");
    const ok = await addProject(form);
    if (ok) {
      setForm({ name: "", client: "", type: "", deadline: "", stage: "planejamento" });
      setOpen(false);
      toast.success("Projeto criado");
    } else toast.error("Erro ao criar projeto");
  };

  const updateStage = async (id: string, stage: ProjectStage) => {
    const ok = await updateProjectStage(id, stage);
    if (ok) toast.success("Status atualizado");
    else toast.error("Erro ao atualizar");
  };

  const remove = async (id: string) => {
    const ok = await removeProject(id);
    if (ok) toast.success("Projeto removido");
    else toast.error("Erro ao remover");
  };
  const feedbackForProject = (projectId: string) =>
    feedbacks.find((f) => f.projectId === projectId);

  const onMarkDelivered = async (id: string) => {
    const ok = await updateProjectStage(id, "entregue");
    if (ok) toast.success("Projeto marcado como entregue");
  };

  const onReleaseFeedback = async (p: { id: string; name: string; client: string }) => {
    const existing = feedbackForProject(p.id);
    if (existing) {
      const link = `${window.location.origin}/feedback/${existing.token}`;
      await navigator.clipboard.writeText(link).catch(() => {});
      toast.success("Link copiado: " + link);
      return;
    }
    const ok = await releaseFeedback(p);
    if (ok) toast.success("Feedback liberado — link disponível");
    else toast.error("Erro ao liberar feedback");
  };

  const copyLink = async (token: string) => {
    const link = `${window.location.origin}/feedback/${token}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    toast.success("Link copiado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display">Projetos</h2>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe o andamento de cada projeto.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" /> Novo projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo projeto</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome do projeto</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Cliente</Label>
                  <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo</Label>
                  <Input
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="Ex: Site, Bot..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Prazo</Label>
                  <Input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v as ProjectStage })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={add}>Criar projeto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar projeto ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as ProjectStage | "all")}>
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {stageOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="card-dark p-8 text-center text-sm text-muted-foreground">Carregando…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum projeto encontrado"
          description="Crie seu primeiro projeto para começar a acompanhar."
        />
      ) : (
        <div className="card-dark overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.client}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{p.type}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString("pt-BR") : "—"}
                  </TableCell>
                  <TableCell>
                    <Select value={p.stage} onValueChange={(v) => updateStage(p.id, v as ProjectStage)}>
                      <SelectTrigger className="h-8 w-[160px] border-0 bg-transparent p-0 hover:bg-secondary/40 px-2">
                        <SelectValue>
                          <StatusPill tone={tone(p.stage)}>
                            {stageOptions.find((o) => o.value === p.stage)?.label}
                          </StatusPill>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      {(() => {
                        const fb = feedbackForProject(p.id);
                        if (p.stage !== "entregue") {
                          return (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onMarkDelivered(p.id)}
                              title="Marcar como entregue"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Entregue
                            </Button>
                          );
                        }
                        if (!fb) {
                          return (
                            <Button
                              size="sm"
                              onClick={() => onReleaseFeedback({ id: p.id, name: p.name, client: p.client })}
                            >
                              <Send className="w-3.5 h-3.5 mr-1" /> Liberar feedback
                            </Button>
                          );
                        }
                        const label =
                          fb.status === "released"
                            ? "Pendente"
                            : fb.status === "received"
                            ? "Recebido"
                            : fb.status === "published"
                            ? "Publicado"
                            : "Oculto";
                        const toneFb =
                          fb.status === "released" ? "yellow" : fb.status === "received" ? "blue" : fb.status === "published" ? "green" : "gray";
                        return (
                          <>
                            <StatusPill tone={toneFb as any}>{label}</StatusPill>
                            {fb.status === "released" && (
                              <Button size="icon" variant="ghost" onClick={() => copyLink(fb.token)} title="Copiar link">
                                <Copy className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        );
                      })()}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <strong>{p.name}</strong> será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(p.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
