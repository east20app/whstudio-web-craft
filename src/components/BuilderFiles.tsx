import { useState } from "react";
import type { Artifact } from "@/lib/builder";
export default function BuilderFiles({ artifact }: { artifact: Artifact }) {
  const [path, setPath] = useState("src/App.tsx");
  const selected =
    artifact.files.find((f) => f.path === path) || artifact.files[0];
  return (
    <div className="grid h-[650px] w-full grid-cols-[155px_1fr] sm:grid-cols-[220px_1fr]">
      <nav
        aria-label="Arquivos do projeto"
        className="overflow-auto border-r border-white/10 p-2"
      >
        {artifact.files.map((f) => (
          <button
            key={f.path}
            title={f.path}
            onClick={() => setPath(f.path)}
            className={`mb-1 block w-full truncate rounded p-2 text-left font-mono text-xs ${selected.path === f.path ? "bg-blue-500/15 text-blue-300" : "text-slate-400 hover:bg-white/5"}`}
          >
            {f.path}
          </button>
        ))}
      </nav>
      <div className="min-w-0">
        <p className="border-b border-white/10 p-3 font-mono text-xs text-slate-400">
          {selected.path}
        </p>
        <pre className="h-[600px] overflow-auto p-4 text-xs text-slate-300">
          <code>{selected.content}</code>
        </pre>
      </div>
    </div>
  );
}
