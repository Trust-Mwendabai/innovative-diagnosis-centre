import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Search,
    FlaskConical,
    Heart,
    Zap,
    ChevronRight,
    ArrowUpRight,
    Play,
    Clock,
    User,
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

export default function PatientResources() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/blog/read.php`);
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.blogs || []);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const categories = [
        { name: "All Articles", icon: BookOpen },
        { name: "Prep Guides", icon: FlaskConical },
        { name: "Heart Health", icon: Heart },
        { name: "Vitality", icon: Zap }
    ];

    const prepGuides = [
        { title: "Metabolic Fasting 101", duration: "5 min read", type: "Guide" },
        { title: "Hydration Protocols", duration: "3 min read", type: "Guide" },
        { title: "Post-Scan Recovery", duration: "4 min read", type: "Expert Tip" },
    ];

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        Health <span className="text-[hsl(var(--gold))]">Tips</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Learn how to stay healthy and prepare for tests</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH HEALTH NODES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-4">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        className={cn(
                            "px-8 h-14 rounded-2xl border flex items-center gap-3 transition-all group",
                            i === 0
                                ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold border-transparent"
                                : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        )}
                    >
                        <cat.icon className={cn("h-4 w-4", i === 0 ? "text-slate-900" : "text-white/20 group-hover:text-[hsl(var(--gold))]")} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content: Blog Feed */}
                <div className="lg:col-span-8 space-y-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Zap className="h-6 w-6 text-[hsl(var(--gold))]" />
                        Latest Health Articles
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-96 rounded-[2.5rem] bg-white/5 animate-pulse" />
                            ))
                        ) : blogs.map((blog) => (
                            <Card key={blog.id} className="glass-card border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all cursor-pointer">
                                <div className="h-56 bg-white/5 relative overflow-hidden">
                                    <img
                                        src={blog.image_url || "/placeholder-blog.jpg"}
                                        alt={blog.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                        <p className="text-[8px] font-black text-[hsl(var(--gold))] uppercase tracking-widest">{blog.category || "Intelligence"}</p>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/30">
                                        <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> 5 Min Read</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="flex items-center gap-2"><User className="h-3 w-3" /> Dr. IDC</span>
                                    </div>
                                    <h4 className="text-xl font-black text-white leading-tight uppercase tracking-tighter group-hover:text-[hsl(var(--gold))] transition-colors">{blog.title}</h4>
                                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 uppercase font-bold tracking-tight">
                                        {blog.excerpt || "Unlock the secrets of digital wellness and advanced diagnostics with our latest expert briefing."}
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 text-[hsl(var(--gold))] text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                        Read Article <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Prep Guides & Tips */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="glass-card border-white/10 rounded-[2.5rem] p-8 space-y-8">
                        <CardTitle className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <FlaskConical className="h-6 w-6 text-[hsl(var(--saffron))]" />
                            Test Preparation
                        </CardTitle>
                        <div className="space-y-4">
                            {prepGuides.map((guide, i) => (
                                <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[8px] font-black text-[hsl(var(--saffron))] uppercase tracking-widest">{guide.type}</span>
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{guide.duration}</span>
                                    </div>
                                    <h5 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[hsl(var(--gold))] transition-colors">{guide.title}</h5>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[9px] hover:bg-white/10">
                            Download Complete Handbook
                        </Button>
                    </Card>

                    <Card className="glass-card border-none bg-gradient-to-br from-purple-600/20 to-transparent p-1 rounded-[2.5rem]">
                        <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.4rem] p-8 space-y-6">
                            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Play className="h-6 w-6 text-purple-400 fill-purple-400" />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">Virtual Lab<br />Experience</h4>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                See how our high-precision diagnostic machinery operates in this 3D walkthrough of the Main Hub.
                            </p>
                            <Button className="w-full h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black uppercase tracking-widest text-[9px] hover:bg-purple-500/20">
                                Launch Simulation →
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
