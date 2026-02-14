import { motion } from "framer-motion";
import { ShieldCheck, Award, Users, Microscope, Heart, Target, Zap, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const team = [
  { name: "Dr. Mwila Chanda", role: "Medical Director", initials: "MC", gradient: "from-blue-500 to-cyan-500" },
  { name: "Grace Njobvu", role: "Lab Manager", initials: "GN", gradient: "from-emerald-500 to-teal-500" },
  { name: "Peter Tembo", role: "Chief Technologist", initials: "PT", gradient: "from-violet-500 to-purple-500" },
  { name: "Sarah Banda", role: "Quality Assurance", initials: "SB", gradient: "from-rose-500 to-pink-500" },
  { name: "James Phiri", role: "Client Relations", initials: "JP", gradient: "from-amber-500 to-orange-500" },
  { name: "Mary Mulenga", role: "Operations Lead", initials: "MM", gradient: "from-sky-500 to-blue-500" },
];

export default function About() {
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
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              Our Legacy of Trust
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight">
              Pioneering <span className="text-[hsl(var(--gold))] italic">Diagnostics</span>
            </h1>
            <p className="mt-4 text-foreground/70 max-w-xl mx-auto text-lg font-medium">
              A decade of precision, innovation, and commitment to the health of Zambia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container py-24 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--saffron))]/10 text-[hsl(var(--saffron))] text-[10px] font-black uppercase tracking-widest mb-6">
              <Heart className="h-3.5 w-3.5" />
              The IDC Journey
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight">
              Empowering Lives Through <span className="text-[hsl(var(--gold))]">Clinical Excellence</span>
            </h2>
            <div className="space-y-6 text-foreground/60 text-lg leading-relaxed font-medium">
              <p>Innovative Diagnosis Centre was founded with a singular, powerful vision: to democratize access to world-class diagnostic testing in Zambia. We believe that every clinical decision should be backed by absolute certainty.</p>
              <p>Our flagship laboratory in Lusaka is a testament to this belief, housing the most advanced automated analyzers and a team of clinical experts dedicated to surgical precision.</p>
              <p>Beyond the technology, we are a people-first organization. Every sample we process represents a life we are helping to safeguard.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/5 hover:border-[hsl(var(--gold))]/20 transition-all group">
                <p className="text-3xl font-black text-[hsl(var(--gold))] mb-1 group-hover:scale-110 transition-transform origin-left">50K+</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-foreground/30">Annual Patients</p>
              </div>
              <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/5 hover:border-[hsl(var(--emerald-india))]/20 transition-all group">
                <p className="text-3xl font-black text-[hsl(var(--emerald-india))] mb-1 group-hover:scale-110 transition-transform origin-left">24/7</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-foreground/30">Clinical Support</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl skew-y-1">
              <img
                src="https://images.unsplash.com/photo-1579154238328-341ef948923a?w=800&h=1000&fit=crop"
                alt="Medical Innovation"
                className="w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[hsl(var(--saffron))]/5 rounded-full blur-[100px] -z-1" />

            {/* Overlay Stamp */}
            <div className="absolute -bottom-6 -left-6 bg-slate-950/90 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-glow-gold z-20 max-w-[240px]">
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <p className="font-heading font-black text-lg text-white leading-tight underline decoration-[hsl(var(--gold))] decoration-4">ISO 15189 Certified Quality</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section className="relative py-24 bg-slate-950/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp}>
              <Card className="h-full glass-card border-white/10 group hover:border-[hsl(var(--gold))]/30 transition-all duration-500 rounded-[2.5rem]">
                <CardContent className="p-10">
                  <div className="h-16 w-16 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-8 shadow-lg group-hover:bg-[hsl(var(--gold))]/20 transition-all">
                    <Target className="h-8 w-8 text-[hsl(var(--gold))]" />
                  </div>
                  <h3 className="font-heading text-3xl font-black text-foreground mb-4 italic">Our Mission</h3>
                  <p className="text-foreground/50 text-lg leading-relaxed">To provide precise, clinical-grade diagnostic insights that empower medical decisions and transform health outcomes across the Republic of Zambia.</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="h-full glass-card border-white/10 group hover:border-[hsl(var(--emerald-india))]/30 transition-all duration-500 rounded-[2.5rem]">
                <CardContent className="p-10">
                  <div className="h-16 w-16 rounded-2xl bg-[hsl(var(--emerald-india))]/10 flex items-center justify-center mb-8 shadow-lg group-hover:bg-[hsl(var(--emerald-india))]/20 transition-all">
                    <Zap className="h-8 w-8 text-[hsl(var(--emerald-india))]" />
                  </div>
                  <h3 className="font-heading text-3xl font-black text-foreground mb-4 italic">Our Vision</h3>
                  <p className="text-foreground/50 text-lg leading-relaxed">To be the undisputed leader in laboratory medicine, setting the gold standard for diagnostic innovation and patient-centric healthcare in Sub-Saharan Africa.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight italic">Our Clinical Leadership</h2>
          <p className="text-foreground/40 max-w-lg mx-auto font-medium">World-class specialists driving the future of medicine.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-8 grid-cols-2 md:grid-cols-3">
          {team.map((m) => (
            <motion.div key={m.name} variants={fadeUp}>
              <Card className="glass-card border-white/5 text-center group hover:border-[hsl(var(--gold))]/20 transition-all duration-500 rounded-[2rem] overflow-hidden">
                <CardContent className="p-10">
                  <div className={cn(
                    "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br font-heading text-2xl font-black text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    m.gradient
                  )}>
                    {m.initials}
                  </div>
                  <h3 className="font-heading font-black text-lg text-foreground group-hover:text-[hsl(var(--gold))] transition-all">{m.name}</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-foreground/30 mt-2">{m.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Certifications Row */}
      <section className="relative py-20 bg-slate-900/50">
        <div className="container overflow-hidden">
          <motion.div
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center gap-16 opacity-30 whitespace-nowrap"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <span className="font-heading font-black text-4xl text-white italic tracking-tighter">CERTIFIED EXCELLENCE</span>
                <div className="h-4 w-4 rounded-full bg-[hsl(var(--gold))]" />
                <span className="font-heading font-black text-4xl text-white italic tracking-tighter uppercase">NHIMA PARTNER</span>
                <div className="h-4 w-4 rounded-full bg-[hsl(var(--emerald-india))]" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
