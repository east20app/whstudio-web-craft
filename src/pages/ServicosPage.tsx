import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Services from "@/components/Services";
import CTAFinal from "@/components/CTAFinal";
import PageHeader from "@/components/PageHeader";
import SupportGuarantee from "@/components/SupportGuarantee";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { services } from "@/config/site";

const ServicosPage = () => (
  <>
    <Header />
    <main className="pt-16">
      <PageHeader
        eyebrow="O que a gente faz"
        title={<>Site, bot, sistema — <span className="text-gradient">o que resolver o problema</span></>}
        description="Se está dando trabalho manual, retrabalho ou atendimento perdido, dá para transformar em uma ferramenta simples de usar."
      />

      <Services />

      <section className="py-24 bg-secondary">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display">Onde isso entra na prática</h2>
            <p className="text-muted-foreground mt-3">
              Sem nome bonito para coisa simples. É ferramenta para tirar trabalho da rotina.
            </p>
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
                  <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 relative">
                    <span className="absolute -top-2 -right-2 text-2xl font-extrabold text-primary/10 font-display select-none leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <s.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold font-display mb-2">{s.title}</h3>
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

      <SupportGuarantee />
      <CTAFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default ServicosPage;
