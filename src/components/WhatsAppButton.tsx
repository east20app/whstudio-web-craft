import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/5584988766134?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento!"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Contato via WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-200"
  >
    <MessageCircle className="w-7 h-7" />
  </a>
);

export default WhatsAppButton;
