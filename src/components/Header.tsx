import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navLinks, whatsappLink } from "@/config/site";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-[hsl(var(--rule))]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          aria-label="WH Studio"
          className="group flex items-baseline gap-2.5"
        >
          <span className="font-display text-2xl md:text-[1.65rem] leading-none tracking-tight">
            WH<span className="serif-italic text-[hsl(var(--accent))]">·</span>Studio
          </span>
          <span className="hidden md:inline eyebrow text-muted-foreground translate-y-[-1px]">
            est. RN
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9" aria-label="Navegação principal">
          {navLinks.map((l, i) => {
            const active = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className="group relative flex items-center gap-2 text-[13px] font-medium"
                aria-current={active ? "page" : undefined}
              >
                <span className="num-mono text-[10px] text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`transition-colors ${
                    active ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
                  }`}
                >
                  {l.label}
                </span>
                {active && (
                  <span className="absolute -bottom-2 left-7 right-0 h-px bg-foreground" />
                )}
              </Link>
            );
          })}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-2 text-[13px] font-medium text-foreground"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[hsl(var(--accent))] opacity-70 animate-ping" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-[hsl(var(--accent))]" />
            </span>
            Disponível — agende uma conversa
          </a>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-t border-[hsl(var(--rule))]"
            aria-label="Navegação mobile"
          >
            <div className="container-wide py-6 flex flex-col divide-y divide-[hsl(var(--rule))]">
              {navLinks.map((l, i) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 group"
                >
                  <span className="font-display text-2xl">{l.label}</span>
                  <span className="num-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} →
                  </span>
                </Link>
              ))}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between py-4 text-[hsl(var(--accent))]"
                onClick={() => setOpen(false)}
              >
                <span className="font-display text-2xl">Conversar agora</span>
                <span className="num-mono text-[10px]">→</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
