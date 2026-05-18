import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navLinks, siteConfig, whatsappLink } from "@/config/site";
import logo from "@/assets/wh-studio-logo.png";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60 shadow-sm shadow-black/20">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm">
            {siteConfig.shortName}
          </span>
          <span className="text-foreground">
            {siteConfig.name.replace("WH ", "")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Navegação principal">
          {navLinks.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={`relative text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
          <Button asChild>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Solicitar orçamento
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
            className="md:hidden overflow-hidden bg-background border-b border-border"
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
              <Button asChild className="w-full mt-3" onClick={() => setOpen(false)}>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  Solicitar orçamento
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
