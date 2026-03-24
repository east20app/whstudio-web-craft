const Footer = () => (
  <footer className="py-8 border-t">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>© 2026 <span className="font-semibold text-foreground">WH Studio</span>. Todos os direitos reservados.</span>
      <div className="flex gap-6">
        <a href="#servicos" className="hover:text-foreground transition-colors">Serviços</a>
        <a href="#portfolio" className="hover:text-foreground transition-colors">Portfólio</a>
        <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
      </div>
    </div>
  </footer>
);

export default Footer;
