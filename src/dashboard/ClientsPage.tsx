import { useMemo, useState } from "react";
import { Search, Trash2, MessageCircle, Plus } from "lucide-react";
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
import { useClients } from "./store";
import type { ClientStatus } from "./types";
import { toast } from "sonner";

const statusOptions: { value: ClientStatus; label: string }[] = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "lead", label: "Lead" },
];

const tone = (s: ClientStatus) => (s === "ativo" ? "green" : s === "lead" ? "blue" : "gray");

const ClientsPage = () => {
  const { data: clients, loading, addClient, removeClient } = useClients();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClientStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    discord: "",
    service: "",
    status: "ativo" as ClientStatus,
  });

  const filtered = useMemo(
    () =>
      clients.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filter === "all" || c.status === filter;
        return matchSearch && matchStatus;
      }),
    [clients, search, filter]
  );

  const add = async () => {
    if (!form.name) return toast.error("Informe o nome");
    const ok = await addClient(form);
    if (ok) {
      setForm({ name: "", whatsapp: "", discord: "", service: "", status: "ativo" });
      setOpen(false);
      toast.success("Cliente adicionado");
    } else {
      toast.error("Erro ao adicionar cliente");
    }
  };

  const remove = async (id: string) => {
    const ok = await removeClient(id);
    if (ok) toast.success("Cliente removido");
    else toast.error("Erro ao remover");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display">Clientes</h2>
          <p className="text-muted-foreground text-sm mt-1">Gerencie clientes ativos, leads e contratos.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" /> Novo cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Discord</Label>
                  <Input value={form.discord} onChange={(e) => setForm({ ...form, discord: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Serviço contratado</Label>
                <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ClientStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={add}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as ClientStatus | "all")}>
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {statusOptions.map((o) => (
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
          title="Nenhum cliente encontrado"
          description="Adicione seu primeiro cliente clicando em 'Novo cliente'."
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card-dark p-5 flex flex-col gap-3 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.service || "—"}</p>
                  </div>
                </div>
                <StatusPill tone={tone(c.status)}>
                  {statusOptions.find((s) => s.value === c.status)?.label}
                </StatusPill>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                {c.whatsapp && (
                  <p>
                    WhatsApp: <span className="text-foreground/80">{c.whatsapp}</span>
                  </p>
                )}
                {c.discord && (
                  <p>
                    Discord: <span className="text-foreground/80">{c.discord}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-auto pt-2">
                {c.whatsapp && (
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                    </a>
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover <strong>{c.name}</strong>? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove(c.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
