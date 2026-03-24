import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-gradient">WH</span> STUDIO
          </Link>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm">
            Transformando ideias em sistemas reais. Desenvolvimento de sites, bots, sistemas e muito mais.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Navegação</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Início</Link>
            <Link to="/servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Serviços</Link>
            <Link to="/planos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Planos</Link>
            <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfólio</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Contato</h4>
          <div className="flex flex-col gap-2">
            <a href="https://wa.me/5584988766134" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a>
            <a href="mailto:contato@whstudio.com.br" className="text-sm text-muted-foreground hover:text-foreground transition-colors">E-mail</a>
            <Link to="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Formulário</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
        © 2026 <span className="font-semibold text-foreground">WH STUDIO</span>. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
