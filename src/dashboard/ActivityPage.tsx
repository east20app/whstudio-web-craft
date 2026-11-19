import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { fetchActivity, type ActivityEntry } from "@/lib/activity";

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>();
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    void fetchActivity(100).then((data) => {
      if (active) setEntries(data);
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, []);

  const normalized = search.trim().toLowerCase();
  const shown = entries?.filter(({ action, actor, entity, entityId }) =>
    [action, actor, entity, entityId ?? ""].some((value) => value.toLowerCase().includes(normalized))
  );

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-display">Registro de atividades</h2>
      <p className="text-sm text-muted-foreground">Até 100 alterações administrativas recentes.</p>
      <Input className="max-w-sm" aria-label="Buscar atividades" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar ação, entidade ou usuário" />
      {failed ? <p role="alert">Não foi possível carregar as atividades.</p> :
        !shown ? <p role="status">Carregando atividades…</p> :
        shown.length === 0 ? <p>Nenhuma atividade encontrada.</p> :
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card"><tr>{["Data", "Ação", "Registro", "Usuário"].map((heading) => <th scope="col" key={heading} className="p-3">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">{shown.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap p-3">{new Date(entry.createdAt).toLocaleString("pt-BR")}</td>
                <td className="p-3">{entry.action}</td>
                <td className="p-3">{entry.entity}<div className="font-mono text-xs text-muted-foreground">{entry.entityId}</div></td>
                <td className="p-3">{entry.actor}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>}
    </section>
  );
}
