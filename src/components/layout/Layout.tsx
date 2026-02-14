import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { InteractiveBackground } from "@/components/InteractiveBackground";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <InteractiveBackground />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
