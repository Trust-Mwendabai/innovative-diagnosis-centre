import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { blogPosts as staticPosts } from "@/data/blog";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    status: string;
    created_at: string;
    image?: string;
    readTime?: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

export default function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Attempt to fetch from API
                const res = await fetch(`http://localhost/IDC/api/blog/read.php`);
                const data = await res.json();

                if (data.success && data.posts && data.posts.length > 0) {
                    const found = data.posts.find((p: BlogPost) => p.id === id);
                    if (found) {
                        setPost(found);
                    } else {
                        // Check static data if not in API results
                        const staticFound = staticPosts.find(p => p.id === id);
                        if (staticFound) {
                            setPost({ ...staticFound, status: 'published', created_at: staticFound.date });
                        } else {
                            toast.error("Article not found");
                        }
                    }
                } else {
                    // Check static data if API is empty or fails
                    const staticFound = staticPosts.find(p => p.id === id);
                    if (staticFound) {
                        setPost({ ...staticFound, status: 'published', created_at: staticFound.date });
                    } else {
                        toast.error("Article not found");
                    }
                }
            } catch (error) {
                console.error("Error fetching blog post:", error);
                // Fallback to static data on error
                const staticFound = staticPosts.find(p => p.id === id);
                if (staticFound) {
                    setPost({ ...staticFound, status: 'published', created_at: staticFound.date });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 container flex flex-col items-center justify-center">
                <div className="h-20 w-20 rounded-[2rem] bg-foreground/5 border border-border animate-pulse flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-[hsl(var(--gold))] animate-spin-slow" />
                </div>
                <p className="mt-6 text-muted-foreground font-black uppercase tracking-widest text-[10px]">Retrieving Analysis...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 container text-center">
                <h1 className="text-4xl font-black text-foreground italic mb-8">Article Displaced</h1>
                <Link to="/blog">
                    <Button variant="outline" className="rounded-2xl border-border text-foreground gap-2">
                        <ArrowLeft className="h-4 w-4" /> Return to Repository
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32">
            {/* Header / Hero */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-end pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={post.image || "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=80"}
                        className="h-full w-full object-cover"
                        alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    <div className="absolute inset-0 pattern-mandala opacity-20 pointer-events-none" />
                </div>

                <div className="container relative">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-[hsl(var(--gold))] font-black uppercase tracking-widest text-[10px] mb-8 hover:translate-x-[-4px] transition-transform">
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-[hsl(var(--gold))] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/80">
                                <Calendar className="h-4 w-4 text-[hsl(var(--gold))]" /> {new Date(post.created_at || Date.now()).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/80">
                                <Clock className="h-4 w-4 text-[hsl(var(--gold))]" /> {post.readTime || "5 min read"}
                            </div>
                        </div>

                        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight italic">
                            {post.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mt-16">
                <div className="grid lg:grid-cols-12 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8"
                    >
                        <div className="glass-card border-border/50 rounded-[3rem] p-10 md:p-16">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-xl text-foreground font-semibold mb-12 italic leading-relaxed border-l-4 border-[hsl(var(--gold))] pl-8">
                                    {post.excerpt}
                                </p>
                                <div className="text-muted-foreground text-lg leading-relaxed space-y-8 font-medium whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </div>

                            <div className="mt-20 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] p-[2px]">
                                        <div className="h-full w-full rounded-[14px] overflow-hidden bg-background">
                                            <img src="/logo.png" className="h-full w-full object-contain p-2" alt="IDC Logo" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Published By</div>
                                        <div className="text-foreground font-bold italic">IDC Clinical Research Team</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mr-2">Disseminate</span>
                                    {[Facebook, Twitter, Linkedin, Share2].map((Icon, i) => (
                                        <Button key={i} variant="outline" className="h-12 w-12 rounded-xl border-border bg-foreground/5 text-muted-foreground hover:text-[hsl(var(--gold))] hover:border-[hsl(var(--gold))]/30 transition-all p-0">
                                            <Icon className="h-5 w-5" />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-4 space-y-12"
                    >
                        <div className="glass-card border-border/50 rounded-[2.5rem] p-8">
                            <h3 className="font-heading text-xl font-black text-foreground italic mb-6">Expert Consultation</h3>
                            <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">
                                Have specific questions about the insights discussed in this article? Connect with our diagnostics team today.
                            </p>
                            <Link to="/contact">
                                <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[10px] shadow-glow-gold">
                                    Request Coordination
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-heading text-xl font-black text-foreground italic px-4">Further Intelligence</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="glass-card border-border/50 p-4 rounded-[1.5rem] flex gap-4 group cursor-pointer hover:border-[hsl(var(--gold))]/30 transition-all">
                                        <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-foreground/5 border border-border/50">
                                            <img src={`https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&q=80&sig=${i}`} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--gold))] mb-1">Related</div>
                                            <div className="text-foreground font-bold text-sm leading-tight group-hover:text-foreground transition-colors line-clamp-2 italic">Diagnostic Advances in Molecular Screening</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </section>
        </div>
    );
}
