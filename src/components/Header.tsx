import { useState } from "react";
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
  const location = useLocation();
  const { requestQuote } = useOrcamentoAction();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <AvailabilityBanner />
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)} aria-label="WH Studio">
          <img src={logo} alt="WH Studio" width={160} height={40} loading="eager" decoding="async" className="logo-invert h-9 w-auto md:h-10 object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Navegação principal">
          {navLinks.map((l) => {
            const active = location.pathname === l.href;
            if (l.href.includes("#")) {
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              );
            }
            return (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm transition-colors ${
                  active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Button
            onClick={() => requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " })}
            className="h-9 rounded-none px-4 text-sm"
          >
            Iniciar projeto
            <ArrowUpRight className="w-4 h-4 ml-1.5" />
          </Button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
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

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
            aria-label="Navegação mobile"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((l) => {
                const active = location.pathname === l.href;
                if (l.href.includes("#")) {
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Button
                className="w-full mt-3 rounded-none"
                onClick={() => {
                  setOpen(false);
                  requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " });
                }}
              >
                Iniciar projeto
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
