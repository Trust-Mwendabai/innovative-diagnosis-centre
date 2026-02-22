import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    Info,
    RefreshCw,
    BookOpen,
    FlaskConical,
    Heart,
    Zap,
    Play,
    Clock,
    User,
    Lightbulb,
    Target,
    ShieldCheck,
    ChevronRight,
    Snowflake,
    Moon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HealthInsight() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState("articles"); // articles, education

    const fetchMetrics = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/health_metrics/read.php?patient_id=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                setMetrics(data.metrics || []);
            }
        } catch (error) {
            console.error("Error fetching health trends:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/blog/read.php`);
            const data = await res.json();
            if (data.success) {
                setBlogs(data.blogs || []);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const seedSampleData = async () => {
        setSeeding(true);
        try {
            const res = await fetch(`${API_BASE_URL}/health_metrics/seed.php?patient_id=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                toast.success("Biometric stream synchronized.");
                fetchMetrics();
            }
        } catch (error) {
            toast.error("Sync failed.");
        } finally {
            setSeeding(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        fetchBlogs();
    }, [user?.id]);

    const staticTips = [
        {
            title: "Optimize Vitamin D Absorption",
            content: "Take your Vitamin D supplement with a meal containing healthy fats for 32% better absorption rates.",
            icon: Lightbulb,
            color: "text-amber-400"
        },
        {
            title: "Diagnostic Fasting",
            content: "Water-only fasting for 12 hours before metabolic panels ensures the highest accuracy in lipid profiles.",
            icon: FlaskConical,
            color: "text-blue-400"
        },
        {
            title: "Hydration Protocol",
            content: "Consuming 500ml of water 30 minutes before a blood draw can significantly improve vein visibility and comfort.",
            icon: Zap,
            color: "text-[hsl(var(--gold))]"
        },
        {
            title: "Sleep & Glucose",
            content: "Less than 6 hours of sleep can temporarily spike fasting glucose levels due to cortisol elevation.",
            icon: Heart,
            color: "text-red-400"
        },
        {
            title: "Post-Scan Mobility",
            content: "Light walking after a contrast MRI helps the body eliminate the contrast agent faster through the renal system.",
            icon: Activity,
            color: "text-emerald-400"
        },
        {
            title: "Caffeine & BP",
            content: "Avoid caffeine for 2 hours before a blood pressure check to ensure your reading isn't artificially inflated.",
            icon: TrendingUp,
            color: "text-purple-400"
        },
        {
            title: "Iron Intake",
            content: "Vitamin C triples iron absorption. Pair your iron-rich meals with citrus for maximum benefit.",
            icon: Target,
            color: "text-orange-400"
        },
        {
            title: "Magnesium Timing",
            content: "Take Magnesium Glycinate 1 hour before bed to support muscle relaxation and improve sleep depth.",
            icon: Clock,
            color: "text-indigo-400"
        },
        {
            title: "Stress & Gut",
            content: "High stress activates the sympathetic nervous system, which can inhibit digestion and cause bloating.",
            icon: ShieldCheck,
            color: "text-cyan-400"
        },
        {
            title: "Protein Pacing",
            content: "Spacing protein intake every 3-4 hours supports optimal muscle synthesis throughout the day.",
            icon: Zap,
            color: "text-yellow-400"
        },
        {
            title: "Probiotic Timing",
            content: "Take your probiotics 30 minutes before breakfast to ensure the greatest survival rate through the acidic stomach environment.",
            icon: Heart,
            color: "text-rose-400"
        },
        {
            title: "Omega-3 Potency",
            content: "Keep fish oil in the fridge to prevent oxidation. Rancid oils can increase systemic inflammation rather than reducing it.",
            icon: Snowflake,
            color: "text-blue-300"
        },
        {
            title: "Blue Light Block",
            content: "Blocking blue light for 90 minutes before sleep increases melatonin production by up to 58%.",
            icon: Moon,
            color: "text-indigo-300"
        },
        {
            title: "Cold Exposure",
            content: "A 30-second cold shower can increase white blood cell count over time, boosting immune resilience.",
            icon: Zap,
            color: "text-cyan-300"
        },
        {
            title: "Fiber Synergy",
            content: "Increase water intake whenever you add fiber to your diet to prevent digestive discomfort and optimize colon health.",
            icon: Activity,
            color: "text-emerald-300"
        }
    ];

    const educationalModules = [
        {
            title: "MRI Safety Excellence",
            desc: "Understand our multi-layer safety screening protocols for resonant imaging, including metal detection and field strength protocols.",
            tag: "Radiology",
            icon: ShieldCheck
        },
        {
            title: "Pathology Insights",
            desc: "How IDC utilizes molecular pathology and genetic sequencing for high-precision diagnostic reporting and cancer screening.",
            tag: "Clinical Labs",
            icon: Target
        },
        {
            title: "Cardiac Monitoring",
            desc: "Learn about Holter monitoring, stress tests, and how we track your heart's electrical activity over extended periods.",
            tag: "Cardiology",
            icon: Heart
        },
        {
            title: "Metabolic Mapping",
            desc: "A deep dive into thyroid function, glucose metabolism, and hormonal balance through advanced blood analysis.",
            tag: "Endocrinology",
            icon: Activity
        },
        {
            title: "Pharmacogenomics",
            desc: "Understand how your DNA affects your response to medications, allowing for personalized drug selection and dosing.",
            tag: "Genetics",
            icon: FlaskConical
        },
        {
            title: "Nutritional Biochemistry",
            desc: "The science of how micronutrients interact with your metabolic pathways to optimize energy and immunity.",
            tag: "Metabolism",
            icon: Zap
        }
    ];

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        Health <span className="text-[hsl(var(--gold))]">Insights</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Clinical Wisdom • Educational Hub • Expert Guidance</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        {["articles", "education"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold" : "text-white/40 hover:text-white"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main>
                <AnimatePresence mode="wait">
                    {activeTab === "articles" && (
                        <motion.div
                            key="articles"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            {/* Quick Insights Cards - Now specifically for Articles */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {staticTips.map((tip, i) => (
                                    <Card key={i} className="glass-card border-white/10 p-6 space-y-4 hover:border-[hsl(var(--gold))]/30 transition-all cursor-default group">
                                        <div className="flex items-center justify-between font-black uppercase text-[8px] tracking-[0.2em] text-white/30">
                                            <span>Expert Wisdom</span>
                                            <tip.icon className={cn("h-4 w-4", tip.color)} />
                                        </div>
                                        <h4 className="text-sm font-black text-white group-hover:text-[hsl(var(--gold))] transition-colors">{tip.title}</h4>
                                        <p className="text-[11px] text-white/40 leading-relaxed font-medium">{tip.content}</p>
                                    </Card>
                                ))}
                            </div>

                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 pt-4">
                                <BookOpen className="h-6 w-6 text-[hsl(var(--gold))]" />
                                Health Guru Articles
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogs.map((blog) => (
                                    <Card key={blog.id} className="glass-card border-white/10 rounded-[2rem] overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all cursor-pointer">
                                        <div className="h-40 bg-white/5 relative overflow-hidden">
                                            <img
                                                src={blog.image_url || "/placeholder-blog.jpg"}
                                                alt={blog.title}
                                                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                                <p className="text-[7px] font-black text-[hsl(var(--gold))] uppercase tracking-[0.2em]">{blog.category || "Health"}</p>
                                            </div>
                                        </div>
                                        <CardContent className="p-6 space-y-3">
                                            <h4 className="text-base font-black text-white leading-tight group-hover:text-[hsl(var(--gold))] transition-colors">{blog.title}</h4>
                                            <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2">{blog.excerpt || "Expert insights for your wellbeing."}</p>
                                            <div className="pt-2 flex items-center gap-2 text-[hsl(var(--gold))] text-[9px] font-black uppercase tracking-widest">
                                                Read Article <ArrowUpRight className="h-3 w-3" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Featured Research (Static Depth) */}
                            <div className="pt-10 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-1">Featured Medical Perspectives</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {[
                                        {
                                            title: "The Microbiome-Brain Axis",
                                            author: "Dr. Sarah Phiri",
                                            time: "12 min read",
                                            desc: "New clinical data suggests that gut bacteria equilibrium plays a 40% larger role in serotonin synthesis than previously estimated."
                                        },
                                        {
                                            title: "Precision Oncology at IDC",
                                            author: "Clinical Research Team",
                                            time: "15 min read",
                                            desc: "How liquid biopsies and circulating tumor DNA (ctDNA) analysis are revolutionizing early-stage cancer detection in Zambia."
                                        }
                                    ].map((res, i) => (
                                        <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-white/2 hover:border-white/20 transition-all group flex flex-col md:flex-row gap-6 items-start">
                                            <div className="h-12 w-12 rounded-xl bg-[hsl(var(--gold))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/20 flex-shrink-0">
                                                <Target className="h-6 w-6 text-[hsl(var(--gold))]" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest">
                                                    <span className="text-[hsl(var(--gold))]">{res.author}</span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="text-white/40">{res.time}</span>
                                                </div>
                                                <h5 className="text-lg font-black text-white group-hover:text-[hsl(var(--gold))] transition-colors tracking-tight">{res.title}</h5>
                                                <p className="text-[11px] text-white/30 leading-relaxed font-medium">{res.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "education" && (
                        <motion.div
                            key="education"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <Lightbulb className="h-6 w-6 text-[hsl(var(--gold))]" />
                                Diagnostic Excellence Hub
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {educationalModules.map((mod, i) => (
                                    <Card key={i} className="glass-card border-white/10 p-10 flex gap-8 items-start hover:bg-white/5 transition-all">
                                        <div className="h-16 w-16 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/20 flex-shrink-0">
                                            <mod.icon className="h-8 w-8 text-[hsl(var(--gold))]" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-black text-[hsl(var(--gold))] uppercase tracking-widest bg-[hsl(var(--gold))]/10 px-3 py-1 rounded-full border border-[hsl(var(--gold))]/20 ">{mod.tag}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-white tracking-tight">{mod.title}</h4>
                                            <p className="text-xs text-white/40 leading-relaxed font-medium">{mod.desc}</p>
                                            <Button variant="ghost" className="p-0 text-[hsl(var(--gold))] hover:text-white hover:bg-transparent font-black uppercase text-[10px] tracking-widest gap-2">
                                                Explore Course <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <Card className="glass-card border-none bg-gradient-to-br from-blue-600/20 to-transparent p-1 rounded-[3rem]">
                                <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.9rem] p-10 flex flex-col lg:flex-row items-center gap-10">
                                    <Play className="h-16 w-16 text-blue-400 fill-blue-400 opacity-20" />
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Virtual Lab Tour</h4>
                                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed">
                                            Experience the IDC standard of excellence through our virtual facility walkthrough. See our high-precision apparatus in action.
                                        </p>
                                    </div>
                                    <Button disabled className="h-14 px-10 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400/50 font-black uppercase text-[10px] tracking-widest cursor-not-allowed">
                                        Coming Soon
                                    </Button>
                                </div>
                            </Card>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div >
    );
}
