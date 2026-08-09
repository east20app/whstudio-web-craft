import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import CTAFinal from "@/components/CTAFinal";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { services } from "@/config/site";

const ServicosPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <section className="py-20 border-b border-border bg-secondary/30">
        <div className="container text-center max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-primary uppercase tracking-widest"
          >
            O que a gente faz
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-extrabold mt-3 mb-5"
          >
            Site, bot, sistema — <span className="text-gradient">o que você precisar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Da landing page à plataforma completa: cada serviço é desenvolvido do zero, com foco em
            funcionar bem, carregar rápido e atendimento direto pelo WhatsApp.
          </motion.p>
        </div>
      </section>

      <Services />

      {/* Detailed list */}
      <section className="py-24 bg-secondary">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Detalhes de cada serviço</h2>
            <p className="text-muted-foreground mt-3">Veja o que está incluído em cada solução.</p>
          </motion.div>

          <div className="space-y-5">
            {services.map((s, i) => (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card-dark-hover p-7 md:p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <s.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{s.short}</p>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <CTAFinal />
    </main>
    <Footer />
  </>
);

export default ServicosPage;
