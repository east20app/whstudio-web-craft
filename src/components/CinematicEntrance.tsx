import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** A presentation only: never blocks or changes the site's access rules. */
export default function CinematicEntrance({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">(() =>
    pathname === "/" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "playing" : "done"
  );
  const [percent, setPercent] = useState(0);
  const content = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const visible = pathname === "/" && phase !== "done";

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (content.current) content.current.inert = true;
    skip.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
      if (content.current) content.current.inert = false;
      document.querySelector<HTMLElement>("#main-content")?.focus({ preventScroll: true });
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || phase !== "playing") return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const fraction = Math.min(1, (now - start) / 2600);
      setPercent(Math.round((1 - Math.pow(1 - fraction, 1.45)) * 100));
      if (fraction === 1) setPhase("leaving");
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (motion.matches) setPhase("done"); };
    motion.addEventListener("change", reduce);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", reduce); };
  }, [visible, phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("done"), 700);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <>
      <div ref={content}>{children}</div>
      {visible && (
        <div className={`cinematic-entrance ${phase === "leaving" ? "cinematic-entrance--leaving" : ""}`}
          role="dialog" aria-modal="true" aria-label="Apresentação da WH Studio"
          onKeyDown={(event) => { if (event.key === "Escape") setPhase("done"); }}>
          <span className="cinematic-entrance__edition" aria-hidden="true">WH / STUDIO</span>
          <div className="cinematic-entrance__inner">
            <p className="cinematic-entrance__kicker">Uma nova experiência</p>
            <div className="cinematic-entrance__title" aria-label="WH Studio">
              <span className="cinematic-entrance__wh">WH<span className="cinematic-entrance__dot">.</span></span>
              <span className="cinematic-entrance__studio">STUDIO</span>
            </div>
            <p className="cinematic-entrance__presents">Apresenta</p>
            <div className="cinematic-entrance__loading">
              <progress className="cinematic-entrance__progress" value={phase === "leaving" ? 100 : percent} max={100} aria-label="Progresso da apresentação" />
              <div className="cinematic-entrance__foot" aria-hidden="true">
                <span>Iniciando apresentação</span><span>{phase === "leaving" ? 100 : percent}%</span>
              </div>
            </div>
          </div>
          <Button ref={skip} variant="ghost" className="cinematic-entrance__skip rounded-none" onClick={() => setPhase("done")}>
            Pular introdução <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      )}
    </>
  );
}