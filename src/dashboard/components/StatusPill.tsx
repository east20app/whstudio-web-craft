type Tone = "blue" | "green" | "yellow" | "red" | "violet" | "gray";

const tones: Record<Tone, string> = {
  blue: "text-primary before:bg-primary",
  green: "text-emerald-400 before:bg-emerald-400",
  yellow: "text-yellow-400 before:bg-yellow-400",
  red: "text-red-400 before:bg-red-400",
  violet: "text-primary before:bg-primary",
  gray: "text-muted-foreground before:bg-muted-foreground",
};

/** Status técnico: ponto + label mono. Sem pílula colorida. */
const StatusPill = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => (
  <span
    className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] whitespace-nowrap before:h-1.5 before:w-1.5 before:rounded-full before:content-[''] ${tones[tone]}`}
  >
    {children}
  </span>
);

export default StatusPill;
