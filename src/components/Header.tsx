import { Link, NavLink, useLocation } from "react-router-dom";
import { useRef } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const navigation = [
  ["/", "Início"], ["/servicos", "Serviços"], ["/sistemas", "Sistemas"],
  ["/portfolio", "Projetos"], ["/sobre", "Sobre"], ["/contato", "Contato"],
];

export default function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { email, whatsappDisplay, buildWhatsappLink } = useSiteSettings();
  const location = useLocation();

  return (
    <header className="studio-header wh-header">
      <a className="studio-skip" href="#main-content">Ir para o conteúdo</a>
      <Link to="/" aria-label="WH Studio, início"><BrandLogo className="h-9 w-36" /></Link>
      <nav className="wh-header__links" aria-label="Navegação principal">
        {navigation.map(([path, label]) => <NavLink key={path} to={path} end={path === "/"}>{label}</NavLink>)}
      </nav>
      <button className="wh-button" type="button" onClick={() => dialog.current?.showModal()}>
        <Menu size={18} aria-hidden="true" /> Menu
      </button>
      <dialog key={location.key} ref={dialog} className="wh-menu" aria-labelledby="wh-menu-title">
        <div className="wh-menu__bar">
          <h2 id="wh-menu-title">Navegação</h2>
          <button className="wh-button" type="button" onClick={() => dialog.current?.close()}><X size={18} aria-hidden="true" /> Fechar</button>
        </div>
        <nav aria-label="Menu expandido">
          {[...navigation, ["/ai", "WH Studio AI"], ["/orcamento", "Orçamento"]].map(([path, label]) =>
            <NavLink key={path} to={path} end={path === "/"} onClick={() => dialog.current?.close()}>{label}</NavLink>
          )}
        </nav>
        <address><a href={`mailto:${email}`}>{email}</a><a href={buildWhatsappLink()}>{whatsappDisplay}</a></address>
      </dialog>
    </header>
  );
}
