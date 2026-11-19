import { useState } from "react";
import { ArrowUpRight, Check, Clock3 } from "lucide-react";

const initial = [
  { id: "A-01", label: "Validar pedido", done: false },
  { id: "A-02", label: "Conferir estoque", done: false },
  { id: "A-03", label: "Preparar entrega", done: false },
];

export default function SystemDemo() {
  const [tasks, setTasks] = useState(initial);
  const completed = tasks.filter(({ done }) => done).length;

  return (
    <div className="border border-[#303037] bg-[#121216]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#303037] p-4 text-sm">
        <strong>Fila de operação</strong><span role="status" className="text-[#a1a1aa]">{completed} de {tasks.length} concluídas</span>
      </div>
      <ul className="divide-y divide-[#303037]">
        {tasks.map(({ id, label, done }) => (
          <li key={id} className="flex flex-wrap items-center gap-3 p-4">
            <span className="font-mono text-xs text-[#a1a1aa]">{id}</span>
            <span className="mr-auto text-sm">{label}</span>
            <button
              type="button"
              className="inline-flex min-h-9 items-center gap-2 border border-[#42424d] px-2 text-xs transition-colors hover:border-[#0085ff]"
              aria-pressed={done}
              aria-label={`Concluir: ${label}`}
              onClick={() => setTasks((previous) => previous.map((task) => task.id === id ? { ...task, done: !task.done } : task))}
            >
              {done ? <Check size={15} /> : <Clock3 size={15} />} {done ? "Concluída" : "Pendente"}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-[#303037] p-4">
        <span className="text-xs text-[#a1a1aa]">Dados de demonstração</span>
        <button type="button" className="wh-text-link" onClick={() => setTasks(initial)}>Reiniciar <ArrowUpRight size={15} /></button>
      </div>
    </div>
  );
}
