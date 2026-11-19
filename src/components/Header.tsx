import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import BrandLogo from "@/components/BrandLogo";

const links = [
  ["/servicos", "Serviços"],
  ["/portfolio", "Portfólio"],
  ["/sistemas", "Sistemas"],
  ["/ai", "WH Studio AI"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="wh-header">
      <a href="#main-content" className="studio-skip">Pular para o conteúdo</a>
      <AvailabilityBanner />
      <div className="wh-wrap wh-header-inner">
        <Link to="/" aria-label="WH Studio · início"><BrandLogo className="wh-logo" /></Link>
        <button ref={toggle} className="wh-menu" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="wh-nav" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav id="wh-nav" className={open ? "wh-nav is-open" : "wh-nav"} aria-label="Navegação principal">
          {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          <Link className="wh-header-mobile-quote" to="/orcamento">Solicitar orçamento <ArrowUpRight size={16} /></Link>
        </nav>
        <Link className="wh-header-quote" to="/orcamento">Iniciar projeto <ArrowUpRight size={16} /></Link>
      </div>
    </header>
  );
}
