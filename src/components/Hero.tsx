import { useRef, type PointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  const stage = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const depth = useTransform(scrollY, [0, 800], [0, 110], { clamp: true });

  function move(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    stage.current?.style.setProperty("--look-x", `${((event.clientX - left) / width - .5) * 26}deg`);
    stage.current?.style.setProperty("--look-y", `${((event.clientY - top) / height - .5) * -20}deg`);
  }

  function magnet(event: PointerEvent<HTMLAnchorElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * .07;
    const y = (event.clientY - bounds.top - bounds.height / 2) * .14;
    event.currentTarget.style.translate = `${x}px ${y}px`;
  }

  function resetMagnet(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.removeProperty("translate");
  }

  return (
    <section ref={stage} className="wh-hero" onPointerMove={move} onPointerLeave={() => {
      stage.current?.style.removeProperty("--look-x");
      stage.current?.style.removeProperty("--look-y");
    }}>
      <motion.div className="wh-stage" style={reduceMotion ? undefined : { y: depth }} aria-hidden="true">
        <div className="wh-scene">
          <div className="wh-orbit" />
          <div className="wh-prism"><i /><i /><i /><i /></div>
          {[0, 1, 2].map((shape) => (
            <div className={`wh-solid wh-solid--${shape}`} key={shape}>
              {Array.from({ length: 6 }, (_, face) => <i key={face} />)}
            </div>
          ))}
        </div>
      </motion.div>
      <div className="wh-hero__content">
        <h1><span>WH DIGITAL</span><span>STUDIO</span></h1>
        <p>Construindo o futuro digital, um projeto por vez.</p>
        <div className="wh-actions">
          <Link className="wh-button wh-button--primary" to="/orcamento" onPointerMove={magnet} onPointerLeave={resetMagnet}>Solicitar orçamento</Link>
          <Link className="wh-button" to="/portfolio" onPointerMove={magnet} onPointerLeave={resetMagnet}>Ver projetos</Link>
        </div>
      </div>
    </section>
  );
}
