import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "260960917837";
const MESSAGE = "Hi, I'd like to make an appointment at Innovative Diagnosis Centre.";

export default function WhatsAppWidget() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      <MessageCircle className="h-7 w-7 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
    </a>
  );
}
