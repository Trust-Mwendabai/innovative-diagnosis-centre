import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen pt-24">
        <section className="container py-24 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
            <div className="h-32 w-32 mx-auto mb-10 rounded-[2.5rem] bg-gradient-to-br from-[hsl(var(--emerald-india))] to-[hsl(var(--gold))] flex items-center justify-center shadow-glow-emerald">
              <Send className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-6 italic underline decoration-[hsl(var(--emerald-india))] decoration-4">Transmission Successful</h1>
            <p className="text-white/40 text-lg max-w-md mx-auto font-medium">Your inquiry has been logged into our priority queue. Our clinical support team will mobilize within 24 hours.</p>
            <Button className="mt-12 h-14 px-10 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px]" onClick={() => setSubmitted(false)}>Initiate New Message</Button>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-indian opacity-90" />
        <div className="absolute inset-0 pattern-mandala opacity-20" />
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-[hsl(var(--gold))]/10 rounded-full blur-[120px]" />

        <div className="container relative text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              <MessageCircle className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              Direct Channel
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-black text-white leading-tight">
              Get In <span className="text-[hsl(var(--gold))] italic">Touch</span>
            </h1>
            <p className="mt-4 text-white/70 max-w-xl mx-auto text-lg font-medium">
              Our clinical and support teams are standing by to assist with your diagnostic requirements.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Card className="glass-card border-white/10 overflow-hidden rounded-[3rem]">
              <CardContent className="p-10">
                <h2 className="font-heading text-2xl font-black text-white mb-8 italic">Send Secure Message</h2>
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Full Name</Label>
                      <Input required placeholder="John Doe" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[hsl(var(--gold))]/50 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Email Address</Label>
                      <Input required type="email" placeholder="john@example.com" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[hsl(var(--gold))]/50 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Phone Number</Label>
                    <Input placeholder="+260 971 000 000" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[hsl(var(--gold))]/50 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Message Inquiry</Label>
                    <Textarea required placeholder="Describe your diagnostic requirements..." className="min-h-[160px] rounded-[2rem] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[hsl(var(--gold))]/50 transition-all font-medium p-6" />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[10px] shadow-glow-gold hover:scale-[1.02] transition-all gap-3">
                    Transmit Message <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-12">
            <div>
              <h2 className="font-heading text-2xl font-black text-white mb-8 italic">Contact Methodology</h2>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Direct Clinical Line", value: "+260 960 917 837", gradient: "from-[hsl(var(--saffron))] to-[hsl(var(--gold))]" },
                  { icon: Mail, label: "Clinical Email", value: "info@innovativediagnosiscentre.co.zm", gradient: "from-[hsl(var(--emerald-india))] to-emerald-400" },
                  { icon: MapPin, label: "Headquarters", value: "10101 Chigwilizano Rd, Lusaka", gradient: "from-blue-500 to-indigo-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-6 group p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                      item.gradient
                    )}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{item.label}</div>
                      <div className="text-white font-bold tracking-tight">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-black text-white italic">WhatsApp</h2>
                <a href="https://wa.me/260960917837?text=Hi%2C%20I%20have%20a%20question" target="_blank" rel="noopener noreferrer">
                  <Button className="h-14 w-full rounded-2xl bg-[#25D366] text-white hover:bg-[#1ebd5d] transition-all font-black uppercase tracking-widest text-[10px] shadow-glow-emerald">
                    <MessageCircle className="h-4 w-4 mr-2" /> Live Chat
                  </Button>
                </a>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading text-lg font-black text-white italic">Operating Hours</h2>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <div className="flex justify-between items-center mb-4">
                    <span>Mon - Fri</span>
                    <span className="text-white">07:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-[hsl(var(--gold))]">
                    <span>Saturday</span>
                    <span className="text-white">08:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center opacity-40">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
