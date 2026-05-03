import { useMemo, useState } from "react";
import { Search, Trash2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useBudgets } from "./store";
import { toast } from "sonner";
import type { BudgetStatus } from "./types";

const statusOptions: { value: BudgetStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em-analise", label: "Em análise" },
  { value: "aprovado", label: "Aprovado" },
  { value: "recusado", label: "Recusado" },
];

const toneByStatus = (s: BudgetStatus) =>
  s === "novo" ? "blue" : s === "em-analise" ? "yellow" : s === "aprovado" ? "green" : "red";

const labelByStatus = (s: BudgetStatus) => statusOptions.find((o) => o.value === s)!.label;

const BudgetsPage = () => {
  const [budgets, setBudgets] = useBudgets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BudgetStatus | "all">("all");

  const filtered = useMemo(
    () =>
      budgets.filter((b) => {
        const matchSearch = b.client.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filter === "all" || b.status === filter;
        return matchSearch && matchStatus;
      }),
    [budgets, search, filter]
  );

  const updateStatus = (id: string, status: BudgetStatus) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success("Status atualizado");
  };

  const remove = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast.success("Orçamento removido");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Orçamentos</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie e acompanhe todas as solicitações recebidas.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as BudgetStatus | "all")}>
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum orçamento encontrado"
          description="Ajuste o filtro ou aguarde novas solicitações chegando pelo formulário de contato."
        />
      ) : (
        <div className="card-dark overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.client}</TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{b.contact}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {new Date(b.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v as BudgetStatus)}>
                      <SelectTrigger className="h-8 w-[140px] border-0 bg-transparent p-0 hover:bg-secondary/40 px-2">
                        <SelectValue>
                          <StatusPill tone={toneByStatus(b.status)}>{labelByStatus(b.status)}</StatusPill>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        asChild
                        title="Responder no WhatsApp"
                      >
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Olá ${b.client}, sobre seu orçamento de ${b.service}...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir orçamento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O orçamento de{" "}
                              <strong>{b.client}</strong> será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(b.id)}>Excluir</AlertDialogAction>
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

export default BudgetsPage;
