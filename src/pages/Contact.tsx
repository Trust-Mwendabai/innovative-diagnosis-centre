import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, MessageCircle, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { branches } from "@/data/branches";

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

      <section className="container py-24 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Info */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-16">
            <div className="text-center">
              <h2 className="font-heading text-3xl font-black text-white mb-12 italic underline decoration-[hsl(var(--gold))] decoration-4 underline-offset-8">Contact Methodology</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Phone, label: "Direct Clinical Line", value: "+260 960 917 837", gradient: "from-[hsl(var(--saffron))] to-[hsl(var(--gold))]" },
                  { icon: Mail, label: "Clinical Email", value: "info@innovativediagnosiscentre.co.zm", gradient: "from-[hsl(var(--emerald-india))] to-emerald-400" },
                  { icon: MapPin, label: "Headquarters", value: "10101 Chigwilizano Rd, Lusaka", gradient: "from-blue-500 to-indigo-500" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className={cn(
                      "h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                      item.gradient
                    )}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{item.label}</div>
                      <div className="text-white font-bold tracking-tight text-sm">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
              <div className="space-y-6 text-center">
                <h2 className="font-heading text-xl font-black text-white italic">WhatsApp Support</h2>
                <a href="https://wa.me/260960917837?text=Hi%2C%20I%20have%20a%20question" target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="h-16 w-full rounded-2xl bg-[#25D366] text-white hover:bg-[#1ebd5d] transition-all font-black uppercase tracking-widest text-[10px] shadow-glow-emerald">
                    <MessageCircle className="h-5 w-5 mr-2" /> Start Live Chat
                  </Button>
                </a>
              </div>

              <div className="space-y-6">
                <h2 className="font-heading text-xl font-black text-white italic text-center">Operating Hours</h2>
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Mon - Fri</span>
                    <span className="text-white">07:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-[hsl(var(--gold))]">
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

      {/* Locations Network */}
      <section className="container py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              Strategic Network
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black text-white italic">
              Our <span className="text-[hsl(var(--gold))]">Presence</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto text-sm font-medium">
              Find your nearest Innovative Diagnosis Centre across our growing national footprint.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch min-h-[600px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-6 flex flex-col justify-center">
            {branches.map((loc) => (
              <motion.div key={loc.name} variants={fadeUp}>
                <Card className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all duration-500 rounded-[2.5rem] bg-white/2 backdrop-blur-sm">
                  <CardContent className="p-8 flex gap-8 items-center">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[hsl(var(--gold))]/20 transition-all duration-500 shadow-lg">
                      <MapPin className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white italic group-hover:text-[hsl(var(--gold))] transition-colors tracking-tight">{loc.name}</h3>
                      <p className="text-white/40 font-medium text-xs leading-relaxed max-w-xs">{loc.address}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                          <Phone className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> {loc.phone}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                          <Clock className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> {loc.hours}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-full min-h-[500px]">
            <div className="glass-card border-white/10 rounded-[3rem] overflow-hidden h-full relative shadow-2xl">
              <iframe
                src="https://maps.google.com/maps?q=10101%20Chigwilizano%20Rd,%20Lusaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale invert contrast-[1.2] opacity-80"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none">
                <h3 className="text-xl font-black text-white italic mb-2 tracking-tight">
                  High-Precision <span className="text-[hsl(var(--gold))]">Diagnostic Hub</span>
                </h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest max-w-sm">
                  Our headquarters is positioned for rapid response and clinical excellence in Central Lusaka.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
