import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    FileText,
    Tag,
    Calendar,
    User,
    CheckCircle,
    Clock,
    MoreVertical,
    ChevronRight,
    Sparkles,
    Newspaper,
    Save,
    Undo2,
    ExternalLink,
    Image as ImageIcon,
    LayoutDashboard,
    Quote,
    Type,
    Layers,
    Send,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    status: 'draft' | 'published';
    created_at: string;
    image?: string;
}

const categories = [
    "Patient Guide",
    "Health Education",
    "Diagnostic Tech",
    "News & Events",
    "Wellness Tips"
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Patient Guide",
        status: "draft",
        image: ""
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost/IDC/api/blog/read.php");
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts);
            } else {
                toast.error("Failed to retrieve repository data");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Endpoint unreachable");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingPost
            ? "http://localhost/IDC/api/blog/update.php"
            : "http://localhost/IDC/api/blog/create.php";

        const submission = editingPost ? { id: editingPost.id, ...form } : form;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editingPost ? "Protocol Updated" : "Intelligence Published");
                setIsModalOpen(false);
                setEditingPost(null);
                fetchPosts();
            } else {
                toast.error(data.message || "Archive process failed");
            }
        } catch (error) {
            toast.error("Communication failure with persistence layer");
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Are you sure you want to decommission this article?")) return;
        try {
            const response = await fetch("http://localhost/IDC/api/blog/delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Article Decommissioned");
                fetchPosts();
            }
        } catch (error) {
            toast.error("Failed to remove record");
        }
    };

    const openEdit = (p: BlogPost) => {
        setEditingPost(p);
        setForm({
            title: p.title,
            excerpt: p.excerpt,
            content: p.content,
            category: p.category,
            status: p.status,
            image: p.image || ""
        });
        setIsModalOpen(true);
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest mb-4">
                        <Newspaper className="h-3 w-3" /> Content Management
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic">
                        Intelligence <span className="text-primary underline decoration-primary/20 underline-offset-8">Repository</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Disseminate diagnostic insights and medical protocols.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingPost(null);
                        setForm({ title: "", excerpt: "", content: "", category: "Patient Guide", status: "draft", image: "" });
                        setIsModalOpen(true);
                    }}
                    className="h-16 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all gap-3 overflow-hidden group"
                >
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="h-4 w-4" />
                    </div>
                    Draft New Analysis
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="grid md:grid-cols-12 gap-4">
                <div className="md:col-span-8 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search repository by title or category..."
                        className="pl-16 h-16 bg-white border-slate-100 text-slate-900 font-bold placeholder:text-slate-200 placeholder:font-medium rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:col-span-4 h-16 p-2 rounded-2xl bg-slate-100 flex gap-2">
                    {['Grid', 'Table'].map(view => (
                        <Button key={view} variant="ghost" className={cn("flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest", view === 'Grid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>
                            {view} View
                        </Button>
                    ))}
                </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-72 rounded-[3rem] bg-slate-50 border border-slate-100 animate-pulse" />
                    ))
                ) : filteredPosts.length === 0 ? (
                    <div className="col-span-full py-40 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center mx-auto mb-8">
                            <Newspaper className="w-10 h-10 text-slate-100" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 italic">Repository Void</h3>
                        <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Start populate the world with surgical insights and diagnostic excellence.</p>
                        <Button variant="outline" className="h-12 px-8 rounded-xl border-slate-200" onClick={() => setIsModalOpen(true)}>Initialize First Draft</Button>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredPosts.map((p, idx) => (
                            <motion.div
                                key={p.id}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="group h-full bg-white border-slate-100 hover:border-primary/20 shadow-premium hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden">
                                    <div className="flex h-full flex-col md:flex-row">
                                        <div className="flex-1 p-10 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <span className={cn(
                                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                                                        p.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                    )}>
                                                        {p.status}
                                                    </span>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-2xl bg-slate-50 hover:bg-slate-100"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="p-2 rounded-2xl border-slate-100 shadow-2xl min-w-[180px]">
                                                            <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3" onClick={() => openEdit(p)}><Edit3 className="h-4 w-4 text-primary" /> Edit Protocol</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3" onClick={() => window.open(`/blog/${p.id}`, '_blank')}><Eye className="h-4 w-4" /> Preview Live</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-2" />
                                                            <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3 text-rose-600 focus:text-rose-600" onClick={() => deletePost(p.id)}><Trash2 className="h-4 w-4" /> Decommission</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors italic mb-4">{p.title}</h3>
                                                <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">{p.excerpt || 'No summary provided.'}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-50">
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                        <Layers className="h-3.5 w-3.5 text-primary" /> {p.category}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                        <Calendar className="h-3.5 w-3.5" /> {new Date(p.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className="rounded-xl font-black text-[9px] uppercase gap-2 hover:bg-primary/5 hover:text-primary transition-all">
                                                    Analysis <ChevronRight className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/3 bg-slate-50 relative overflow-hidden group-hover:bg-slate-100 transition-colors border-l border-slate-50">
                                            {p.image ? (
                                                <img src={p.image} className="absolute inset-0 h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                            ) : (
                                                <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-slate-200" />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Premium Blog Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-5xl bg-white border-slate-200 shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-[3rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-black text-slate-900 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-primary" />
                                {editingPost ? "Refine Intelligence" : "Draft New Protocol"}
                            </div>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full" onClick={() => setIsModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <Type className="h-3 w-3" /> Intelligence Heading
                                    </Label>
                                    <Input
                                        required
                                        className="h-16 text-2xl font-black italic border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Enter definitive article title..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <FileText className="h-3 w-3" /> Analytical Content
                                    </Label>
                                    <div className="relative group">
                                        <textarea
                                            required
                                            className="w-full min-h-[400px] rounded-[2rem] border border-slate-100 bg-slate-50/50 p-8 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/30 transition-all shadow-inner leading-relaxed"
                                            value={form.content}
                                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                                            placeholder="Synthesize your findings here..."
                                        />
                                        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {form.content.length} characters
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                            <Layers className="h-3 w-3" /> Classification
                                        </Label>
                                        <select
                                            className="w-full h-14 rounded-2xl border border-slate-100 bg-white px-6 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                            <Send className="h-3 w-3" /> Visibility Status
                                        </Label>
                                        <div className="flex p-1 bg-white border border-slate-100 rounded-2xl">
                                            {['draft', 'published'].map(st => (
                                                <Button
                                                    key={st}
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => setForm({ ...form, status: st as any })}
                                                    className={cn(
                                                        "flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                        form.status === st ? "bg-slate-900 text-white shadow-xl" : "text-slate-400"
                                                    )}
                                                >
                                                    {st}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <Quote className="h-3 w-3" /> Executive Summary
                                    </Label>
                                    <textarea
                                        className="w-full min-h-[120px] rounded-[1.5rem] border border-slate-100 bg-white p-6 text-xs font-bold leading-relaxed focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                        value={form.excerpt}
                                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                        placeholder="Brief metadata for repository indexing..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <ImageIcon className="h-3 w-3" /> Neural Visualization
                                    </Label>
                                    <div className="group relative">
                                        <Input
                                            className="h-14 rounded-2xl border-slate-100 bg-white text-xs font-bold pl-6 focus:ring-4 focus:ring-primary/5 pr-12"
                                            value={form.image}
                                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                                            placeholder="Unsplash URL for extraction..."
                                        />
                                        <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    </div>
                                    <div className="h-40 rounded-[1.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center p-4">
                                        {form.image ? (
                                            <img src={form.image} className="h-full w-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <ImageIcon className="h-8 w-8 text-slate-200 mb-2" />
                                                <p className="text-[10px] font-bold text-slate-300">Image Preview Extraction</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-8 border-t border-slate-100 gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-600"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <Undo2 className="h-4 w-4 mr-2" /> Discard Analysis
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-20 rounded-[2rem] bg-primary text-white text-xl font-black italic shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all gap-4 ring-8 ring-primary/5"
                            >
                                <CheckCircle className="h-6 w-6" />
                                {editingPost ? "Finalize Updates" : "Commit to Repository"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
