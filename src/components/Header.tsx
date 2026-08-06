import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navLinks, whatsappLink } from "@/config/site";
import logo from "@/assets/wh-studio-logo.png";
import AvailabilityBanner from "@/components/AvailabilityBanner";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-xl border-glow-bottom">
      <AvailabilityBanner />
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)} aria-label="WH Studio">
          <img src={logo} alt="WH Studio" className="h-9 w-auto md:h-10 object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {navLinks.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={`eyebrow transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
          <Button asChild className="h-10 rounded-full px-5 btn-glow-hover glow">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
              Iniciar projeto
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border"
            aria-label="Navegação mobile"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((l) => {
                const active = location.pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Button asChild className="w-full mt-3 rounded-full glow" onClick={() => setOpen(false)}>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  Iniciar projeto
                </a>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
