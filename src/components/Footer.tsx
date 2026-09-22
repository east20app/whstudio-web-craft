import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { navLinks } from "@/config/site";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import logo from "@/assets/wh-studio-logo.png";

const Footer = () => {
  const settings = useSiteSettings();
  const waLink = settings.buildWhatsappLink();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center" aria-label="WH Studio — página inicial">
              <img
                src={logo}
                alt="WH Studio"
                width={190}
                height={44}
                loading="lazy"
                decoding="async"
                className="logo-invert h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground mt-4 max-w-xs leading-relaxed">
              {settings.footerText}
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                aria-label="E-mail"
                className="w-9 h-9 border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="eyebrow mb-4">Navegação</h4>
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

          <div className="md:col-span-3">
            <h4 className="eyebrow mb-4">Contato</h4>
            <div className="flex flex-col gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                WhatsApp {settings.whatsappDisplay}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {settings.email}
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

        <div className="border-t border-border mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            {settings.siteName.toUpperCase()} © {new Date().getFullYear()} — Todos os direitos reservados.
          </p>
          <p className="font-mono text-[11px] tracking-wide">
            Feito por <span className="font-medium text-foreground/80">{settings.authorName}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;