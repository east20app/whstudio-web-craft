import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "@/config/site";
import logo from "@/assets/wh-studio-logo.png";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import ThemeToggle from "@/components/ThemeToggle";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { requestQuote } = useOrcamentoAction();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const startProject = () => {
    setOpen(false);
    requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div
        className={`transition-all duration-300 ${scrolled ? "h-14" : "h-16 md:h-[4.5rem]"}`}
      >
        <AvailabilityBanner />
        <div className="container h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
            aria-label="WH Studio — página inicial"
          >
            <img
              src={logo}
              alt="WH Studio"
              width={150}
              height={36}
              loading="eager"
              decoding="async"
              className="logo-invert h-8 w-auto md:h-9 object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
            {navLinks.map((l) => {
              const active =
                l.href === "/" ? location.pathname === "/" : location.pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  to={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <ThemeToggle />
            <Button
              onClick={() => {
                setOpen(false);
                requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " });
              }}
              className="h-9 rounded-none px-4 font-mono text-[11px] uppercase tracking-[0.14em]"
            >
              Solicitar orçamento
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 -mr-2 text-foreground"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
            aria-label="Navegação mobile"
          >
            <div className="container py-4 flex flex-col divide-y divide-border">
              {navLinks.map((l) => {
                const active =
                  l.href === "/" ? location.pathname === "/" : location.pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`px-3 py-3.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Button className="w-full mt-3 rounded-none" onClick={startProject}>
                Solicitar orçamento
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;