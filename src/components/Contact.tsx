import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";

const Contact = () => (
  <section id="contato" className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">Fale conosco</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Entre em Contato</h2>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input placeholder="Seu nome" className="h-12 bg-card border-border" />
          <Input placeholder="Seu e-mail" type="email" className="h-12 bg-card border-border" />
          <Textarea placeholder="Descreva seu projeto..." className="min-h-[120px] bg-card border-border" />
          <Button size="lg" className="w-full glow">Enviar Mensagem</Button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-semibold mb-4">Prefere falar diretamente?</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Entre em contato pelo WhatsApp ou Discord e receba um orçamento personalizado em até 24 horas.
            </p>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-3 h-14" asChild>
              <a
                href="https://wa.me/5584988766134?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento!"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">(84) 98876-6134</p>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-14" asChild>
              <a href="mailto:contato@whstudio.com.br">
                <Mail className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">E-mail</p>
                  <p className="text-xs text-muted-foreground">contato@whstudio.com.br</p>
                </div>
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Contact;
