import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FlaskConical, Clock, ChevronRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

interface Test {
  id: string;
  name: string;
  category: string;
  description: string;
  preparation: string;
  price: string;
}

export default function Services() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tests/read.php`);
      const data = await res.json();
      if (data.success) {
        setTests(data.tests);
      }
    } catch (error) {
      toast.error("Error loading clinical services");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(tests.map(t => t.category));
    return Array.from(cats).filter(Boolean);
  }, [tests]);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || t.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, tests]);

  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-indian opacity-70" />
        <div className="absolute inset-0 pattern-mandala opacity-20" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[hsl(var(--gold))]/10 rounded-full blur-[120px] animate-pulse" />

        <div className="container relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-black mb-6 uppercase tracking-[0.2em] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
              Premium Diagnostics
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight">
              Our Clinical <span className="text-[hsl(var(--gold))]">Services</span>
            </h1>
            <p className="mt-4 text-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Experience Zambia's most innovative diagnostic technology with our comprehensive catalog of specialized tests.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container relative z-20 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
              <Input
                placeholder="Search for tests or diagnostic categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--gold))]/50 transition-all rounded-2xl text-lg"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {["All", ...categories].map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "outline"}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300",
                    category === c
                      ? "bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white border-0 shadow-glow-gold scale-105"
                      : "bg-foreground/5 border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                  )}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tests Grid */}
      <section className="container py-20 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/40 font-black uppercase tracking-widest text-xs animate-pulse">Syncing catalog...</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((t) => (
              <motion.div key={t.id} variants={fadeUp}>
                <Card className="h-full glass-card border-white/10 group overflow-hidden hover:border-[hsl(var(--gold))]/30 transition-all duration-500 rounded-3xl">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="px-3 py-1 rounded-lg bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] text-[10px] font-black uppercase tracking-widest border border-[hsl(var(--gold))]/20">
                        {t.category || 'General'}
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/20 group-hover:text-[hsl(var(--gold))] group-hover:bg-[hsl(var(--gold))]/10 transition-all duration-500">
                        <FlaskConical className="h-6 w-6" />
                      </div>
                    </div>

                    <h3 className="font-heading font-black text-xl text-foreground group-hover:text-[hsl(var(--gold))] transition-colors duration-300 mb-2 leading-tight">
                      {t.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">
                        Prep Advice
                      </div>
                      <p className="text-muted-foreground text-xs mt-1 italic">{t.preparation || 'Follow standard clinical procedures.'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Test Price</p>
                        <span className="font-heading font-black text-2xl text-[hsl(var(--gold))]">ZMW {parseFloat(t.price).toFixed(2)}</span>
                      </div>
                      <Link to={`/book?test=${t.id}`}>
                        <Button className="h-12 w-12 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground hover:bg-gradient-to-r hover:from-[hsl(var(--saffron))] hover:to-[hsl(var(--gold))] hover:border-0 hover:shadow-glow-gold transition-all duration-500 p-0">
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-white/10" />
            </div>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">No clinical results found</p>
            <p className="text-foreground/20 text-xs mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </section>
    </>
  );
}
