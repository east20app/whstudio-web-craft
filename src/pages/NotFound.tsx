import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl md:text-9xl mb-4">404</p>
        <h1 className="font-display text-3xl md:text-4xl mb-3">Página não encontrada.</h1>
        <p className="text-muted-foreground mb-8">
          A página{" "}
          <code className="px-1.5 py-0.5 border border-border bg-card text-xs">{location.pathname}</code>{" "}
          não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" /> Voltar ao início
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" /> Falar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
