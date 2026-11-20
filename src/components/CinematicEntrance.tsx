import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

export default function CinematicEntrance({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [playing, setPlaying] = useState(() =>
    pathname === "/" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const turnOff = () => { if (motion.matches) setPlaying(false); };
    motion.addEventListener("change", turnOff);
    return () => motion.removeEventListener("change", turnOff);
  }, []);

  return (
    <>
      {children}
      {pathname === "/" && playing && (
        <div className="wh-intro" onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setPlaying(false);
        }}>
          <div className="wh-intro__mark" aria-hidden="true"><BrandLogo /></div>
          <button type="button" className="wh-button" onClick={() => setPlaying(false)}>Pular introdução</button>
        </div>
      )}
    </>
  );
}
