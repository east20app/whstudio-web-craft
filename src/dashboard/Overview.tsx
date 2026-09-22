import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActivity, type ActivityEntry } from "@/lib/activity";
import StatCard from "./components/StatCard";
import StatusPill from "./components/StatusPill";
import { useBudgets, useClients, useProjects, useMessages, useSettings } from "./store";

const stageTone = {
  planejamento: "gray" as const,
  desenvolvimento: "blue" as const,
  revisao: "yellow" as const,
  entregue: "green" as const,
};
const stageLabel = {
  planejamento: "Planejamento",
  desenvolvimento: "Dev",
  revisao: "Revisão",
  entregue: "Entregue",
};

const Panel = ({ title, href, children }: { title: string; href: string; children: React.ReactNode }) => (
  <section className="border border-border overflow-hidden bg-card/30">
    <header className="flex items-center justify-between px-5 h-12 border-b border-border">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <Link to={href} className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary hover:underline">
        ver tudo
      </Link>
    </header>
    {children}
  </section>
);

const Overview = () => {
  const { data: budgets } = useBudgets();
  const { data: clients } = useClients();
  const { data: projects } = useProjects();
  const { data: messages } = useMessages();
  const { settings } = useSettings();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    fetchActivity(12).then(setActivity);
  }, []);

  const activeClients = clients.filter((c) => c.status === "ativo").length;
  const ongoing = projects.filter((p) => p.stage !== "entregue").length;
  const delivered = projects.filter((p) => p.stage === "entregue").length;
  const unread = messages.filter((m) => !m.read).length;
  const newBudgets = budgets.filter((b) => b.status === "novo").length;

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Sys / Overview</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">Visão geral</h2>
        </div>
        <Link
          to="/dashboard/configuracoes"
          className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-2 border ${
            settings.acceptingProjects
              ? "border-emerald-400/30 text-emerald-400"
              : "border-warning/30 text-warning"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${settings.acceptingProjects ? "bg-emerald-400" : "bg-warning"}`} />
          {settings.acceptingProjects ? "Aceitando projetos" : "Fila fechada"}
        </Link>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-border divide-x divide-border">
        <StatCard label="Orçamentos" value={budgets.length} trend={`${newBudgets} novos`} />
        <StatCard label="Clientes ativos" value={activeClients} trend={`${clients.length} no total`} />
        <StatCard label="Em andamento" value={ongoing} trend={`${delivered} entregues`} />
        <StatCard label="Mensagens" value={messages.length} trend={`${unread} não lidas`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Últimos orçamentos" href="/dashboard/orcamentos">
          {budgets.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">Nenhum orçamento ainda.</p>
          ) : (
            <ul className="divide-y divide-border">
              {budgets.slice(0, 5).map((b, i) => (
                <li key={b.id} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{b.client}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.service}</p>
                  </div>
                  <StatusPill
                    tone={
                      b.status === "novo" ? "blue" : b.status === "em-analise" ? "yellow" : b.status === "aprovado" ? "green" : "red"
                    }
                  >
                    {b.status === "em-analise" ? "Em análise" : b.status}
                  </StatusPill>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Projetos" href="/dashboard/projetos">
          {projects.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">Nenhum projeto cadastrado.</p>
          ) : (
            <ul className="divide-y divide-border">
              {projects.slice(0, 5).map((p, i) => (
                <li key={p.id} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.client}</p>
                  </div>
                  <StatusPill tone={stageTone[p.stage]}>{stageLabel[p.stage]}</StatusPill>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <section className="border border-border overflow-hidden bg-card/30">
        <header className="flex items-center justify-between px-5 h-12 border-b border-border">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Atividade recente
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
            {activity.length} registros
          </span>
        </header>
        {activity.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Nenhuma ação registrada ainda.</p>
        ) : (
          <ul className="divide-y divide-border">
            {activity.map((a) => (
              <li key={a.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                  {new Date(a.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-border text-muted-foreground">
                  {a.action}
                </span>
                <span className="text-sm truncate min-w-0">{a.details || a.entity}</span>
                <span className="ml-auto text-xs text-muted-foreground truncate">{a.actor}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
};

export default Overview;
