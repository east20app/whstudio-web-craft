import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/site";

const WhatsAppButton = () => (
  <a
    href={whatsappLink()}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar no WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <MessageCircle className="w-7 h-7" aria-hidden="true" />
  </a>
);

export default WhatsAppButton;
