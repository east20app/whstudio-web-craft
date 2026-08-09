import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import EmptyState from "./components/EmptyState";
import StatusPill from "./components/StatusPill";
import { useAdminServices } from "./store";
import { toast } from "sonner";
import type { AdminService } from "./types";

const empty = { name: "", description: "", active: true };

const ServicesPage = () => {
  const { data: services, loading, addService, updateService, removeService } = useAdminServices();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [form, setForm] = useState(empty);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (s: AdminService) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description, active: s.active });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name) return toast.error("Informe o nome");
    const ok = editing
      ? await updateService(editing.id, form)
      : await addService({ ...form, price: "Sob consulta" });
    if (ok) {
      toast.success(editing ? "Serviço atualizado" : "Serviço adicionado");
      setOpen(false);
    } else {
      toast.error("Erro ao salvar");
    }
  };

  const remove = async (id: string) => {
    const ok = await removeService(id);
    if (ok) toast.success("Serviço removido");
    else toast.error("Erro ao remover");
  };

  const toggle = async (s: AdminService) => {
    await updateService(s.id, { active: !s.active });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Serviços</h2>
          <p className="text-muted-foreground text-sm mt-1">Cadastre e edite os serviços oferecidos.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-1" /> Novo serviço
        </Button>
      </div>

      {loading ? (
        <div className="card-dark p-8 text-center text-sm text-muted-foreground">Carregando…</div>
      ) : services.length === 0 ? (
        <EmptyState
          title="Nenhum serviço cadastrado"
          description="Adicione seu primeiro serviço para exibir no site."
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="card-dark p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{s.description}</p>
                </div>
                <StatusPill tone={s.active ? "green" : "gray"}>{s.active ? "Ativo" : "Inativo"}</StatusPill>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-semibold text-primary">Sob consulta</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={s.active} onCheckedChange={() => toggle(s)} />
                  Visível no site
                </label>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover serviço?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{s.name}</strong> será excluído permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(s.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar serviço" : "Novo serviço"}</DialogTitle>
            <DialogDescription className="sr-only">
              {editing ? "Edite os dados do serviço." : "Cadastre um novo serviço."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome do serviço</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <Input value="Sob consulta" disabled />
            </div>
            <label className="flex items-center gap-2 text-sm pt-1">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              Ativo
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
