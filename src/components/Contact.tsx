import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

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
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Solicite seu Orçamento</h2>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input placeholder="Seu nome" className="h-12" />
          <Input placeholder="Seu e-mail" type="email" className="h-12" />
          <Input placeholder="Seu telefone" className="h-12" />
          <Textarea placeholder="Descreva seu projeto..." className="min-h-[120px]" />
          <Button size="lg" className="w-full">Enviar Mensagem</Button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-xl font-semibold mb-4">Informações de Contato</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Entre em contato e receba um orçamento personalizado para o seu projeto. Respondemos em até 24 horas.
            </p>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-hero-gradient flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm">contato@whstudio.com.br</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-hero-gradient flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm">(00) 00000-0000</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-hero-gradient flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm">Brasil</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Contact;
