import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { siteConfig, whatsappLink, navLinks } from "@/config/site";

const Footer = () => (
  <footer className="py-14 border-t border-border bg-secondary/30">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div className="md:col-span-2">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-gradient">WH</span> STUDIO
          </Link>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
            {siteConfig.slogan}. Sites, sistemas, bots e automações sob medida para o seu negócio.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="E-mail"
              className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm">Navegação</h4>
          <div className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm">Contato</h4>
          <div className="flex flex-col gap-2">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              WhatsApp {siteConfig.whatsapp.display}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {siteConfig.email}
            </a>
            <Link
              to="/contato"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Formulário de contato
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">{siteConfig.name}</span>. Todos os direitos reservados.
        </p>
        <p className="text-[11px] tracking-wide">
          Feito por <span className="font-medium text-foreground/80">Walmry Netto</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
