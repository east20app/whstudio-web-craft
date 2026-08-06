import { useAvailability } from "@/hooks/useAvailability";

/** Faixa fina no topo avisando quando não estamos pegando projetos novos. */
const AvailabilityBanner = () => {
  const { accepting, note, loaded } = useAvailability();
  if (!loaded || accepting) return null;

  return (
    <div className="w-full bg-warning/10 border-b border-warning/25">
      <div className="container flex items-center gap-3 py-2">
        <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
        <p className="font-mono text-[11px] leading-snug uppercase tracking-[0.14em] text-warning">
          Fila fechada
        </p>
        <p className="text-xs text-foreground/70 leading-snug truncate">
          {note || "Não estamos pegando projetos novos no momento."}
        </p>
      </div>
    </div>
  );
};

export default AvailabilityBanner;
