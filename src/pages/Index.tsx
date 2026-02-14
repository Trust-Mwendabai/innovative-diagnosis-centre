import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Microscope, FlaskConical, MapPin, ShieldCheck, Home, Star, ChevronRight, Sparkles, Activity, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tests, healthPackages } from "@/data/tests";
import { testimonials } from "@/data/testimonials";
import heroImage from "@/assets/hero-lab.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Index() {
  const popularTests = tests.filter((t) => t.popular);

  return (
    <div className="relative">

      {/* ================== HERO ================== */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=80"
            alt="Futuristic diagnostic laboratory"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <div className="absolute inset-0 pattern-mandala opacity-10 pointer-events-none" />
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[hsl(var(--gold))]/10 rounded-full blur-[120px] animate-pulse-gentle" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[hsl(var(--saffron))]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />

        <div className="container relative py-24 md:py-36 lg:py-44">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles className="h-4 w-4 text-[hsl(var(--gold))]" />
                Zambia's Premier Strategic Diagnostics
              </div>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-white tracking-tight"
            >
              Clinical <span className="text-[hsl(var(--gold))] italic">Precision.</span>
              <br />
              Absolute <span className="bg-gradient-to-r from-[hsl(var(--saffron))] via-[hsl(var(--gold))] to-[hsl(var(--emerald-india))] bg-clip-text text-transparent">Care.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-xl text-white/80 max-w-xl leading-relaxed font-medium"
            >
              Harnessing global diagnostic innovations to provide Zambia with world-class medical testing and compassionate patient services.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-5"
            >
              <Link to="/book">
                <Button
                  size="lg"
                  className="h-16 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[11px] shadow-glow-gold hover:scale-[1.05] transition-all gap-3"
                >
                  Schedule Appointment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/recommender">
                <Button
                  size="lg"
                  className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[11px]"
                >
                  Health Assessment Quiz
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================== STATS ================== */}
      <section className="relative -mt-12 z-10 container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { stat: "50,000+", label: "Tests Analyzed", icon: FlaskConical, color: "text-[hsl(var(--saffron))]" },
            { stat: "01", label: "Strategic Hub", icon: MapPin, color: "text-[hsl(var(--gold))]" },
            { stat: "98.9%", label: "Clinical Accuracy", icon: ShieldCheck, color: "text-[hsl(var(--emerald-india))]" },
            { stat: "< 24h", label: "Turnaround Time", icon: Clock, color: "text-blue-400" },
          ].map(({ stat, label, icon: Icon, color }) => (
            <motion.div key={label} variants={scaleIn}>
              <div className="glass-card border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl group hover:border-[hsl(var(--gold))]/30 transition-all">
                <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <Icon className={cn("h-6 w-6", color)} />
                </div>
                <div className="text-3xl font-black text-foreground tracking-tighter mb-1">
                  {stat}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================== POPULAR TESTS ================== */}
      <section className="container py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[hsl(var(--emerald-india))]/5 rounded-full blur-[120px] -z-10" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--saffron))]/10 text-[hsl(var(--saffron))] text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
            <FlaskConical className="h-3.5 w-3.5" />
            Diagnostic Excellence
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground italic">
            Priority <span className="text-[hsl(var(--gold))] underline decoration-4 underline-offset-8">Analyses</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {popularTests.map((t) => (
            <motion.div key={t.id} variants={fadeUp}>
              <Card className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all duration-500 rounded-[2.5rem]">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--gold))]/10 transition-all">
                      <FlaskConical className="h-7 w-7 text-[hsl(var(--gold))]" />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Standard Rate</div>
                      <div className="text-xl font-black text-foreground">ZMW {t.price}</div>
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-black text-foreground group-hover:text-[hsl(var(--gold))] transition-all mb-3 leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8">{t.description}</p>

                  <Link to={`/book?test=${t.id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-2xl border-white/10 text-white hover:bg-[hsl(var(--gold))] hover:text-white hover:border-transparent transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      Initialize Booking <ChevronRight className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-16">
          <Link to="/services">
            <Button
              className="h-14 px-10 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Explore Full Catalog <ArrowRight className="h-4 w-4 ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ================== HEALTH PACKAGES ================== */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&q=80"
            className="h-full w-full object-cover opacity-20"
            alt="Health Screening Environment"
          />
          <div className="absolute inset-0 bg-slate-950/90" />
          <div className="absolute inset-0 pattern-mandala opacity-10" />
        </div>

        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Comprehensive Care
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-black text-white leading-tight italic">
              Signature <span className="text-[hsl(var(--gold))]">Saffron</span> Protocols
            </h2>
            <p className="text-white/50 mt-8 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Synthesizing advanced biochemical analysis into integrated health assessments for a definitive portrait of your well-being.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {healthPackages.slice(0, 3).map((pkg) => (
              <motion.div key={pkg.id} variants={fadeUp}>
                <Card className="h-full relative overflow-hidden glass-card border-white/10 group rounded-[3rem]">
                  {pkg.popular && (
                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white text-[9px] font-black uppercase tracking-widest shadow-glow-gold z-10">
                      Standard Choice
                    </div>
                  )}
                  <CardContent className="p-10">
                    <h3 className="font-heading text-2xl font-black text-white group-hover:text-[hsl(var(--gold))] transition-all mb-4">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-white/40 font-medium mb-8 leading-relaxed">{pkg.description}</p>
                    <ul className="mb-10 space-y-4">
                      {pkg.tests.slice(0, 5).map((t) => (
                        <li key={t} className="text-[11px] font-bold text-white/50 flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-3 w-3 text-[hsl(var(--gold))]" />
                          </div>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Package Fee</span>
                        <span className="text-2xl font-black text-white italic">ZMW {pkg.price}</span>
                      </div>
                      <Link to={`/book?package=${pkg.id}`}>
                        <Button className="h-12 px-6 rounded-xl bg-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[10px] shadow-glow-gold hover:scale-105 transition-all">
                          Select Protocol
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================== WHY CHOOSE US ================== */}
      <section className="container py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeLeft}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--emerald-india))]/10 text-[hsl(var(--emerald-india))] text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" />
              The IDC Advantage
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground leading-tight mb-8">
              Defining the future of <span className="italic text-[hsl(var(--emerald-india))] underline decoration-4 underline-offset-8">Diagnostics</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: "ISO Accreditation", desc: "Adhering to rigorous international standards for analytical precision.", color: "text-[hsl(var(--emerald-india))]" },
                { icon: FlaskConical, title: "Automated Tech", desc: "Minimizing human error through high-throughput robotic diagnostics.", color: "text-blue-400" },
                { icon: Home, title: "Concierge Collection", desc: "Specialized mobile teams for professional at-home sample procurement.", color: "text-[hsl(var(--saffron))]" },
                { icon: MapPin, title: "Strategic Hub", icon2: ArrowRight, desc: "Centrally located world-class facility in the heart of Lusaka.", color: "text-[hsl(var(--gold))]" },
              ].map((item) => (
                <div key={item.title} className="group">
                  <div className={cn("mb-4", item.color)}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-foreground font-black text-sm uppercase tracking-wider mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeRight}
            className="relative"
          >
            <div className="rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-2xl relative aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&q=80"
                alt="High-tech Laboratory"
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className="glass p-8 rounded-[2rem] border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--gold))] flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Innovation</div>
                      <div className="text-foreground font-bold italic">Roche Automated Systems</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-foreground/70 font-medium italic leading-relaxed">"Integrating state-of-the-art analytical platforms to deliver unprecedented speed and accuracy for our patients."</p>
                </div>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[hsl(var(--gold))]/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ================== PATIENT PORTAL ================== */}
      <section className="container py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[hsl(var(--gold))]/5 rounded-full blur-[120px] -z-10" />
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeLeft}
            className="order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Empowering Patients
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground leading-tight mb-8">
              Your Health, <br />
              <span className="italic text-[hsl(var(--gold))] underline decoration-4 underline-offset-8">Digitized & Secure</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-10">
              Join the IDC Patient Portal to manage your healthcare journey with absolute ease. Access results, track history, and communicate with specialists from any device.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {[
                "Instant Report Access",
                "Digital Health Archive",
                "SMS Result Alerts",
                "Direct Doctor Outreach",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[hsl(var(--emerald-india))]/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4 text-[hsl(var(--emerald-india))]" />
                  </div>
                  <span className="text-sm font-bold text-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-5">
              <Link to="/register">
                <Button
                  size="lg"
                  className="h-16 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[11px] shadow-glow-gold hover:scale-[1.05] transition-all"
                >
                  Create Patient Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="h-16 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5 transition-all font-black uppercase tracking-widest text-[11px]"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeRight}
            className="order-2 relative"
          >
            <div className="rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-2xl relative aspect-[4/3] bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&q=80&w=1200"
                alt="Patient Health Dashboard"
                className="h-full w-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="h-20 w-20 text-[hsl(var(--gold))]/20 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-white/5 z-20" />

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 z-30 glass p-4 rounded-2xl border-white/20 shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase text-foreground/40 tracking-widest">Lab Results</div>
                    <div className="text-[11px] font-bold text-foreground">Verified & Ready</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 z-30 glass p-5 rounded-3xl border-white/20 shadow-2xl hidden md:block"
              >
                <div className="text-center">
                  <div className="text-[24px] font-black text-[hsl(var(--gold))] italic tracking-tighter">98.4%</div>
                  <div className="text-[9px] font-black uppercase text-foreground/40 tracking-widest">Health Index</div>
                </div>
              </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[hsl(var(--gold))]/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ================== TESTIMONIALS ================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="absolute inset-0 pattern-grid-white opacity-5" />

        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl font-black text-foreground italic">Clinical <span className="text-[hsl(var(--gold))]">Testimonials</span></h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-medium">Genuine feedback from patients across our Zambian network.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.slice(0, 3).map((t) => (
              <motion.div key={t.id} variants={fadeUp}>
                <Card className="glass-card border-white/10 rounded-[3rem] h-full group">
                  <CardContent className="p-10">
                    <div className="flex gap-1 mb-6">
                      {Array(5).fill(0).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed text-foreground/60 font-medium mb-10">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-5 mt-auto">
                      <div className="relative">
                        <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-foreground/10 transition-transform group-hover:scale-110" loading="lazy" />
                        <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-lg bg-[hsl(var(--gold))] flex items-center justify-center border-2 border-background">
                          <ShieldCheck className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-heading font-black text-sm text-foreground uppercase tracking-wider">{t.name}</div>
                        <div className="text-[10px] font-black uppercase text-foreground/30 tracking-widest">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================== CTA ================== */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1532187875302-1df92a18298a?w=1600&q=80"
            className="h-full w-full object-cover opacity-30"
            alt="Medical Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="max-w-3xl"
            >
              <h2 className="font-heading text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8">
                Experience the <span className="italic text-[hsl(var(--gold))]">Modern</span> <br /> Standard of Care.
              </h2>
              <p className="text-white/80 mb-12 max-w-xl text-xl font-medium leading-relaxed">
                Don't compromise on your health. Join thousands of Zambians who trust IDC for clinical precision and absolute reliability.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/book">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[11px] shadow-glow-gold hover:scale-[1.05] transition-all gap-3"
                  >
                    Book Your Test <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-2xl bg-white/10 border border-white/20 text-white backdrop-blur-xl hover:bg-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                  >
                    Register Now
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeRight}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 p-12 glass-card border-white/10 rounded-[4rem] aspect-square flex flex-col justify-center items-center text-center overflow-hidden group">
                {/* Floating animated background shapes */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[hsl(var(--gold))]/20 rounded-full blur-3xl animate-pulse-gentle" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[hsl(var(--saffron))]/10 rounded-full blur-[100px] animate-float" />

                <div className="relative mb-10 h-32 w-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
                  <ShieldCheck className="h-16 w-16 text-[hsl(var(--gold))]" />
                </div>

                <h3 className="font-heading text-3xl font-black text-white mb-4">Quality Assured</h3>
                <p className="text-white/50 text-sm font-medium max-w-xs leading-relaxed">
                  ISO 15189:2012 Certified Laboratory.
                  <br />
                  Zambia Medical Regulatory Authority Approved.
                </p>

                <div className="mt-10 flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                      <Star className="h-5 w-5 text-[hsl(var(--gold))]/60" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative extra floating badge */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass p-6 rounded-3xl border-white/20 shadow-glow-gold z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[hsl(var(--emerald-india))] flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Rank</div>
                    <div className="text-white font-bold leading-none">Top Tier</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Final mandalas */}
        <div className="absolute top-0 right-0 w-96 h-96 pattern-mandala opacity-10 -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 pattern-mandala opacity-5 -ml-10 -mb-10 pointer-events-none" />
      </section>
    </div>
  );
}
