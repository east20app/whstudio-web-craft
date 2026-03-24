import { motion } from "framer-motion";
import { Globe, Bot, Settings, Server, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Globe, title: "Desenvolvimento de Sites", desc: "Sites institucionais, landing pages, e-commerce e portais modernos e responsivos." },
  { icon: Bot, title: "Bots para Discord", desc: "Bots completos com moderação, economia, tickets, música e comandos personalizados." },
  { icon: Settings, title: "Sistemas Personalizados", desc: "Dashboards, painéis admin, sistemas de delivery, gestão e muito mais." },
  { icon: Server, title: "Hospedagem de Projetos", desc: "Hospedagem rápida e segura com uptime de 99.9% e suporte técnico incluso." },
  { icon: Zap, title: "Automações", desc: "Automatize processos, integrações com APIs, notificações e fluxos de trabalho." },
];

const Services = () => (
  <section id="servicos" className="py-24 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary uppercase tracking-widest">O que fazemos</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Nossos Serviços</h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Soluções completas para transformar sua presença digital.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-dark-hover p-8 flex flex-col"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">{s.desc}</p>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://wa.me/5584988766134?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20servi%C3%A7o%20de%20" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
