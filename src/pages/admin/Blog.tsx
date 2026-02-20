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
    X,
    LayoutGrid,
    List as ListIcon
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
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
import { API_BASE_URL } from "@/lib/config";
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
    const [viewMode, setViewMode] = useState<'Grid' | 'Table'>('Grid');

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
            const res = await fetch(`${API_BASE_URL}/blog/read.php`);
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
            ? `${API_BASE_URL}/blog/update.php`
            : `${API_BASE_URL}/blog/create.php`;

        const submission = editingPost ? { id: editingPost.id, ...form } : form;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editingPost ? "Article Updated" : "Article Published");
                setIsModalOpen(false);
                setEditingPost(null);
                fetchPosts();
            } else {
                toast.error(data.message || "Failed to save article");
            }
        } catch (error) {
            toast.error("Failed to connect to the server");
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/blog/delete.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Article Deleted");
                fetchPosts();
            }
        } catch (error) {
            toast.error("Failed to remove article");
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-[9px] font-black uppercase tracking-widest mb-4 border border-slate-700">
                        <Newspaper className="h-3 w-3" /> Content Management
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">
                        Blog & <span className="text-emerald-400 underline decoration-emerald-400/20 underline-offset-8">Articles</span>
                    </h1>
                    <p className="text-slate-400 font-bold mt-2">Manage health articles and patient guides.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingPost(null);
                        setForm({ title: "", excerpt: "", content: "", category: "Patient Guide", status: "draft", image: "" });
                        setIsModalOpen(true);
                    }}
                    className="h-16 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-200 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all gap-3 overflow-hidden group"
                >
                    <div className="h-8 w-8 rounded-lg bg-slate-900/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="h-4 w-4" />
                    </div>
                    New Article
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="grid md:grid-cols-12 gap-4">
                <div className="md:col-span-8 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                        placeholder="Search repository by title or category..."
                        className="pl-16 h-16 bg-slate-800/50 border-slate-700 text-white font-bold placeholder:text-slate-500 placeholder:font-medium rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/20 transition-all focus:bg-slate-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:col-span-4 h-16 p-2 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex gap-2">
                    {['Grid', 'Table'].map(view => (
                        <Button
                            key={view}
                            variant="ghost"
                            onClick={() => setViewMode(view as any)}
                            className={cn(
                                "flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                viewMode === view ? "bg-white text-slate-900 shadow-xl scale-105" : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                            )}
                        >
                            {view === 'Grid' ? <LayoutGrid className="h-4 w-4 mr-2" /> : <ListIcon className="h-4 w-4 mr-2" />}
                            {view} View
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content View */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-72 rounded-[3rem] bg-slate-800/50 border border-slate-700 animate-pulse" />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="py-40 text-center bg-slate-800/30 border border-dashed border-slate-700 rounded-[3rem]">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-slate-800 shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-700">
                            <Newspaper className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic">No Articles Found</h3>
                        <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Start by creating your first health article or guide.</p>
                        <Button variant="outline" className="h-12 px-8 rounded-xl border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-bold" onClick={() => setIsModalOpen(true)}>Create First Article</Button>
                    </div>
                ) : viewMode === 'Grid' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AnimatePresence>
                            {filteredPosts.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeUp}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="group h-full bg-slate-800/40 backdrop-blur-md border-slate-700 hover:border-emerald-500/50 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden">
                                        <div className="flex h-full flex-col md:flex-row">
                                            <div className="flex-1 p-10 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <span className={cn(
                                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border",
                                                            p.status === 'published' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                        )}>
                                                            {p.status}
                                                        </span>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-2xl bg-white/5 hover:bg-white/10"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="p-2 rounded-2xl border-slate-700 bg-slate-800 text-slate-200 shadow-2xl min-w-[180px]">
                                                                <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3 focus:bg-slate-700 focus:text-white" onClick={() => openEdit(p)}><Edit3 className="h-4 w-4 text-emerald-400" /> Edit Article</DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3 focus:bg-slate-700 focus:text-white" onClick={() => window.open(`/blog/${p.id}`, '_blank')}><Eye className="h-4 w-4" /> Preview Live</DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-700" />
                                                                <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3 text-rose-500 focus:text-rose-500 focus:bg-rose-500/10" onClick={() => deletePost(p.id)}><Trash2 className="h-4 w-4" /> Delete Article</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white leading-tight group-hover:text-emerald-400 transition-colors italic mb-4">{p.title}</h3>
                                                    <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">{p.excerpt || 'No summary provided.'}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-700/50">
                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            <Layers className="h-3.5 w-3.5 text-emerald-400" /> {p.category}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            <Calendar className="h-3.5 w-3.5" /> {new Date(p.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="ghost" className="rounded-xl font-black text-[9px] uppercase gap-2 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400 transition-all">
                                                        Analysis <ChevronRight className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-1/3 bg-slate-800/50 relative overflow-hidden group-hover:bg-slate-800 transition-colors border-l border-slate-700/50">
                                                {p.image ? (
                                                    <img src={p.image} className="absolute inset-0 h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                                ) : (
                                                    <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-slate-700" />
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-2xl">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700 hover:bg-white/5 border-b">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6 px-8">Article & Category</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Published</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPosts.map((p) => (
                                    <TableRow key={p.id} className="border-slate-700 group hover:bg-white/5 transition-colors">
                                        <TableCell className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                                                    {p.image ? (
                                                        <img src={p.image} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <FileText className="h-5 w-5 text-slate-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white group-hover:text-emerald-400 transition-colors">{p.title}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                        <Tag className="h-3 w-3 text-emerald-500" /> {p.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-bold text-slate-300">
                                                {new Date(p.created_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-block border",
                                                p.status === 'published' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            )}>
                                                {p.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400" onClick={() => openEdit(p)}>
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-400" onClick={() => deletePost(p.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Premium Blog Modal - High Contrast Dark Theme */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-5xl bg-slate-900 border-white/10 shadow-2xl rounded-[3rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-slate-900 border-b border-white/5">
                        <DialogTitle className="text-2xl font-black text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-emerald-400" />
                                {editingPost ? "Edit Article" : "New Article"}
                            </div>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white/10 text-slate-400 hover:text-white" onClick={() => setIsModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-slate-900/50 backdrop-blur-xl">
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                        <Type className="h-3 w-3" /> Article Title
                                    </Label>
                                    <Input
                                        required
                                        className="h-16 text-2xl font-black italic bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl transition-all"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Enter article title..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                        <FileText className="h-3 w-3" /> Content
                                    </Label>
                                    <div className="relative group">
                                        <textarea
                                            required
                                            className="w-full min-h-[400px] rounded-[2rem] border border-white/10 bg-black/40 p-8 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-black/60 focus:border-emerald-500/30 transition-all shadow-inner leading-relaxed"
                                            value={form.content}
                                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                                            placeholder="Write your article content here..."
                                        />
                                        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {form.content.length} characters
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="p-8 rounded-[2rem] bg-black/20 border border-white/5 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                            <Layers className="h-3 w-3" /> Classification
                                        </Label>
                                        <select
                                            className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-6 text-xs font-black uppercase tracking-widest text-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c} className="bg-slate-900">{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                            <Send className="h-3 w-3" /> Visibility Status
                                        </Label>
                                        <div className="flex p-1 bg-black/40 border border-white/10 rounded-2xl">
                                            {['draft', 'published'].map(st => (
                                                <Button
                                                    key={st}
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => setForm({ ...form, status: st as any })}
                                                    className={cn(
                                                        "flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                        form.status === st ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                                                    )}
                                                >
                                                    {st}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                        <Quote className="h-3 w-3" /> Executive Summary
                                    </Label>
                                    <textarea
                                        className="w-full min-h-[120px] rounded-[1.5rem] border border-white/10 bg-black/40 p-6 text-xs font-bold leading-relaxed text-slate-300 placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                                        value={form.excerpt}
                                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                        placeholder="Brief metadata for repository indexing..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                        <ImageIcon className="h-3 w-3" /> Neural Visualization
                                    </Label>
                                    <div className="group relative">
                                        <Input
                                            className="h-14 rounded-2xl border-white/10 bg-black/40 text-xs font-bold pl-6 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/10 pr-12"
                                            value={form.image}
                                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                                            placeholder="Unsplash URL for extraction..."
                                        />
                                        <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="h-40 rounded-[1.5rem] border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center text-center p-4">
                                        {form.image ? (
                                            <img src={form.image} className="h-full w-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <ImageIcon className="h-8 w-8 text-slate-700 mb-2" />
                                                <p className="text-[10px] font-bold text-slate-600">Image Preview Extraction</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-8 border-t border-white/10 gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-white hover:bg-white/5"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <Undo2 className="h-4 w-4 mr-2" /> Discard
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-20 rounded-[2rem] bg-emerald-500 text-white text-xl font-black italic shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] transition-all gap-4 ring-8 ring-emerald-500/10 hover:bg-emerald-400"
                            >
                                <CheckCircle className="h-6 w-6" />
                                {editingPost ? "Save Changes" : "Save Article"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
