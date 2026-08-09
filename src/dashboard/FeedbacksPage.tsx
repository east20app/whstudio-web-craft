import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Send, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useFeedbacks } from "./store";
import type { FeedbackStatus } from "./types";
import { toast } from "sonner";

const labels: Record<FeedbackStatus, string> = {
  released: "Pendente",
  received: "Recebido",
  published: "Publicado",
  hidden: "Oculto",
};
const tones: Record<FeedbackStatus, "yellow" | "blue" | "green" | "gray"> = {
  released: "yellow",
  received: "blue",
  published: "green",
  hidden: "gray",
};

const FeedbacksPage = () => {
  const { data, loading, updateStatus, removeFeedback } = useFeedbacks();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      data.filter((f) =>
        (f.clientName + f.projectName + (f.testimonial ?? ""))
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [data, search]
  );

  const copyLink = async (token: string) => {
    const link = `${window.location.origin}/feedback/${token}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    toast.success("Link copiado");
  };

  const setStatus = async (id: string, s: FeedbackStatus) => {
    const ok = await updateStatus(id, s);
    if (ok) toast.success("Status atualizado");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Feedbacks</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Avaliações enviadas pelos clientes. Publique no site as melhores.
        </p>
      </div>

      <Input
        placeholder="Buscar cliente, projeto ou texto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="card-dark p-8 text-center text-sm text-muted-foreground">Carregando…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum feedback ainda"
          description="Marque um projeto como entregue e clique em 'Liberar feedback'."
        />
      ) : (
        <div className="card-dark overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead className="hidden md:table-cell">Depoimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.clientName || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{f.projectName}</TableCell>
                  <TableCell>
                    {f.rating ? (
                      <span className="inline-flex items-center gap-1 text-yellow-300">
                        <Star className="w-3.5 h-3.5 fill-current" /> {f.rating}/5
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground max-w-[280px] truncate">
                    {f.testimonial || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={tones[f.status]}>{labels[f.status]}</StatusPill>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      {f.status === "released" && (
                        <Button size="sm" variant="outline" onClick={() => copyLink(f.token)}>
                          <Copy className="w-3.5 h-3.5 mr-1" /> Link
                        </Button>
                      )}
                      {(f.status === "received" || f.status === "hidden") && f.allowPublish && (
                        <Button size="sm" onClick={() => setStatus(f.id, "published")}>
                          <Send className="w-3.5 h-3.5 mr-1" /> Publicar
                        </Button>
                      )}
                      {f.status === "received" && !f.allowPublish && (
                        <span className="text-[11px] text-muted-foreground self-center px-2">
                          Sem autorização do cliente
                        </span>
                      )}
                      {f.status === "published" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(f.id, "hidden")}>
                          <EyeOff className="w-3.5 h-3.5 mr-1" /> Ocultar
                        </Button>
                      )}
                      {f.status === "hidden" && f.allowPublish && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(f.id, "published")}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> Mostrar
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
                            <AlertDialogTitle>Excluir feedback?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeFeedback(f.id)}>
                              Excluir
                            </AlertDialogAction>
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

export default FeedbacksPage;
