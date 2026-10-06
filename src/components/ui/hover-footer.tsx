import { useId, useRef } from "react";
import type { PointerEvent } from "react";

/** Pointer-lit outlined wordmark inspired by Md Afsar Mahmud's 21st.dev Hover Footer. */
export function TextHoverEffect({ text }: { text: string }) {
  const id = useId().replace(/:/g, "");
  const light = useRef<SVGRadialGradientElement>(null);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    light.current?.setAttribute("cx", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    light.current?.setAttribute("cy", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };
  return (
    <svg viewBox="0 0 1000 180" className="hover-footer-text" onPointerMove={move} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-color`}><stop stopColor="#3ca2fa" /><stop offset="0.5" stopColor="#a0e9ff" /><stop offset="1" stopColor="#5077ef" /></linearGradient>
        <radialGradient id={`${id}-light`} ref={light} cx="50%" cy="50%" r="32%"><stop stopColor="white" /><stop offset="1" stopColor="black" /></radialGradient>
        <mask id={`${id}-mask`}><rect width="1000" height="180" fill={`url(#${id}-light)`} /></mask>
      </defs>
      <text x="50%" y="76%" textAnchor="middle" textLength="970" lengthAdjust="spacingAndGlyphs" className="hover-footer-text__base">{text}</text>
      <text x="50%" y="76%" textAnchor="middle" textLength="970" lengthAdjust="spacingAndGlyphs" className="hover-footer-text__lit" stroke={`url(#${id}-color)`} mask={`url(#${id}-mask)`}>{text}</text>
    </svg>
  );
}
export function FooterBackgroundGradient() {
  return <div className="footer-background-gradient" aria-hidden="true" />;
}
