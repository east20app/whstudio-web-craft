import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Services from "@/components/Services";
import CTAFinal from "@/components/CTAFinal";
import { motion } from "framer-motion";
import { Globe, Bot, Settings, Server, Zap } from "lucide-react";

const details = [
  {
    icon: Globe,
    title: "Desenvolvimento de Sites",
    benefits: [
      "Sites responsivos que funcionam em qualquer dispositivo",
      "SEO otimizado para aparecer no Google",
      "Design moderno e personalizado para sua marca",
      "Carregamento ultra-rápido",
      "Integração com redes sociais",
    ],
  },
  {
    icon: Bot,
    title: "Bots para Discord",
    benefits: [
      "Moderação automática com filtros inteligentes",
      "Sistema de tickets para suporte",
      "Economia virtual com loja e ranking",
      "Comandos personalizados para sua comunidade",
      "Logs detalhados de atividades",
    ],
  },
  {
    icon: Settings,
    title: "Sistemas Personalizados",
    benefits: [
      "Dashboards com gráficos e relatórios em tempo real",
      "Sistemas de gestão completos",
      "Plataformas de delivery e pedidos online",
      "Autenticação segura de usuários",
      "Integração com APIs e serviços externos",
    ],
  },
  {
    icon: Server,
    title: "Hospedagem de Projetos",
    benefits: [
      "Uptime de 99.9% garantido",
      "Servidores otimizados para performance",
      "SSL gratuito em todos os projetos",
      "Backups automáticos diários",
      "Suporte técnico 24/7",
    ],
  },
  {
    icon: Zap,
    title: "Automações",
    benefits: [
      "Integração entre sistemas e plataformas",
      "Notificações automáticas por e-mail e WhatsApp",
      "Fluxos de trabalho automatizados",
      "Sincronização de dados em tempo real",
      "Redução de trabalho manual",
    ],
  },
];

const ServicosPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Nossos serviços</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-2">O que a WH Studio faz por você</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Conheça em detalhes cada um dos nossos serviços e descubra como podemos ajudar seu negócio a crescer.
            </p>
          </motion.div>
          <div className="space-y-8 max-w-4xl mx-auto">
            {details.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card-dark-hover p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <d.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{d.title}</h2>
                    <ul className="space-y-2">
                      {d.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default ServicosPage;
