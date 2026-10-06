import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "@/config/site";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import ThemeToggle from "@/components/ThemeToggle";
import { useOrcamentoAction } from "@/components/tickets/TicketChat";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  const { requestQuote } = useOrcamentoAction();
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    if (open) window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  const start = () => { setOpen(false); requestQuote({ subject: "Projeto novo", prefill: "Quero iniciar um projeto. " }); };
  const links = navLinks.map(link => {
    const active = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
    return <Link key={link.href} to={link.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`studio-nav-link ${active ? "studio-nav-link--active" : ""}`}>{link.label}</Link>;
  });
  return (
    <header className="studio-header fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <a href="#main-content" className="studio-skip">Pular para o conteúdo</a>
      <AvailabilityBanner />
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" onClick={() => setOpen(false)} className="studio-brand" aria-label="WH Studio — página inicial">wh<span className="text-primary">/</span><span className="studio-brand__suffix">studio</span></Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">{links}</nav>
        <div className="flex items-center gap-3"><ThemeToggle /><Button onClick={start} className="hidden h-11 rounded-full px-5 lg:inline-flex">Iniciar projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Button><button ref={toggle} type="button" className="grid h-11 w-11 place-items-center rounded-full border border-border lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      {open && <nav id="mobile-navigation" className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-border bg-background lg:hidden" aria-label="Navegação mobile"><div className="container flex flex-col items-stretch gap-1 py-5">{links}<Button className="mt-5 h-12" onClick={start}>Iniciar projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Button></div></nav>}
    </header>
  );
};
export default Header;
