import { Link } from "react-router-dom";
import { navLinks, siteConfig, whatsappLink } from "@/config/site";

const Footer = () => (
  <footer className="bg-background border-t border-[hsl(var(--rule))]">
    <div className="container-wide py-20 md:py-24">
      <div className="grid md:grid-cols-12 gap-10 mb-16">
        <div className="md:col-span-5">
          <Link to="/" aria-label="WH Studio" className="font-display text-3xl">
            WH<span className="serif-italic text-[hsl(var(--accent))]">·</span>Studio
          </Link>
          <p className="text-sm text-muted-foreground mt-6 max-w-md leading-relaxed">
            Estúdio independente de engenharia de software conduzido por Walmry Netto. Sistemas, sites, bots e automações entregues à mão.
          </p>
          <div className="num-mono text-[11px] text-muted-foreground mt-8 space-y-1">
            <div>Natal — Rio Grande do Norte, Brasil</div>
            <div>Atendendo todo o país desde 2022</div>
          </div>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="eyebrow text-muted-foreground mb-5">Índice</p>
          <ul className="space-y-2.5">
            {navLinks.map((l, i) => (
              <li key={l.href} className="flex items-baseline gap-3">
                <span className="num-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link to={l.href} className="text-sm hover:underline underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-muted-foreground mb-5">Contato</p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
              >
                WhatsApp · {siteConfig.whatsapp.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:underline underline-offset-4"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
              >
                Comunidade no Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="rule-t pt-6 flex flex-col md:flex-row items-baseline justify-between gap-3 num-mono text-[11px] text-muted-foreground">
        <span>© 2026 WH Studio — Todos os direitos reservados</span>
        <span>Engenharia por Walmry Netto / CNPJ sob consulta</span>
      </div>
    </div>
  </footer>
);

export default Footer;
