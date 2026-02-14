import { motion } from "framer-motion";
import { Sparkles, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { branches } from "@/data/branches";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function Locations() {
    const locations = branches;

    return (
        <div className="min-h-screen pb-32">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32">
                <div className="absolute inset-0 gradient-indian opacity-90" />
                <div className="absolute inset-0 pattern-mandala opacity-20" />
                <div className="absolute top-1/2 -left-20 w-96 h-96 bg-[hsl(var(--gold))]/10 rounded-full blur-[120px]" />

                <div className="container relative text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                            Strategic Network
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black text-white leading-tight">
                            Our <span className="text-[hsl(var(--gold))] italic">Presence</span>
                        </h1>
                        <p className="mt-4 text-white/70 max-w-lg mx-auto text-lg font-medium">
                            Locate your nearest Innovative Diagnosis Centre for precision care.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Locations List */}
            <section className="container py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        {locations.map((loc) => (
                            <motion.div key={loc.name} variants={fadeUp}>
                                <Card className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all duration-500 rounded-[2.5rem]">
                                    <CardContent className="p-8 md:p-10 flex gap-8 items-start">
                                        <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[hsl(var(--gold))]/20 transition-all duration-500">
                                            <MapPin className="h-8 w-8 text-[hsl(var(--gold))]" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black text-white italic group-hover:text-[hsl(var(--gold))] transition-colors">
                                                {loc.name}
                                            </h3>
                                            <p className="text-white/40 font-medium leading-relaxed">
                                                {loc.address}
                                            </p>
                                            <div className="flex flex-wrap gap-6 pt-2">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                                                    <Phone className="h-4 w-4 text-[hsl(var(--gold))]" /> {loc.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                                                    <Clock className="h-4 w-4 text-[hsl(var(--gold))]" /> {loc.hours}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:sticky lg:top-32"
                    >
                        <div className="glass-card border-white/10 rounded-[4rem] overflow-hidden aspect-[4/5] relative">
                            <img
                                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80"
                                className="absolute inset-0 h-full w-full object-cover grayscale opacity-50"
                                alt="Map Placeholder"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                            <div className="absolute inset-0 pattern-mandala opacity-10" />

                            <div className="absolute bottom-0 left-0 right-0 p-12">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                                    National Coordinator
                                </div>
                                <h3 className="text-3xl font-black text-white italic mb-4 leading-tight">
                                    Seamless Diagnostic <span className="text-[hsl(var(--gold))]">Integration</span> Across Zambia
                                </h3>
                                <p className="text-white/40 text-sm font-medium leading-relaxed">
                                    Our network spans major medical hubs, ensuring world-class diagnostics are accessible within 30 minutes of major urban populations.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
