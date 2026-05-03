type Tone = "blue" | "green" | "yellow" | "red" | "violet" | "gray";

const tones: Record<Tone, string> = {
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
  violet: "bg-primary/15 text-primary border-primary/30",
  gray: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

const StatusPill = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${tones[tone]}`}>
    {children}
  </span>
);

export default StatusPill;
