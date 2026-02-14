import { useState, useEffect } from "react";
import {
    Layout,
    Save,
    RefreshCw,
    Globe,
    Eye,
    Smartphone,
    Monitor,
    Type,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle,
    Undo2,
    Settings2,
    Edit2,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CMSItem {
    id: string;
    section_name: string;
    content_key: string;
    content_value: string;
    updated_at: string;
}

export default function Content() {
    const [content, setContent] = useState<CMSItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeLayer, setActiveLayer] = useState("Hero");

    // Local modifications state
    const [changes, setChanges] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("http://localhost/IDC/api/cms/read.php");
            const data = await res.json();
            if (data.success) {
                setContent(data.content);
                // Default to first section found
                if (data.content.length > 0) setActiveLayer(data.content[0].section_name);
            }
        } catch (error) {
            toast.error("Error fetching content");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (id: string, value: string) => {
        setChanges(prev => ({ ...prev, [id]: value }));
    };

    const saveChanges = async (id: string) => {
        if (!changes[id]) return;

        try {
            const response = await fetch("http://localhost/IDC/api/cms/update.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, content_value: changes[id] }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Content published successfully");
                // Clear change for this ID
                const newChanges = { ...changes };
                delete newChanges[id];
                setChanges(newChanges);
                fetchContent();
            }
        } catch (error) {
            toast.error("Publishing fail");
        }
    };

    const sections = Array.from(new Set(content.map(c => c.section_name)));
    const currentItems = content.filter(c => c.section_name === activeLayer);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Content Manager</h1>
                    <p className="text-muted-foreground font-medium">Control live website content and structural elements.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 rounded-lg text-[10px] font-black uppercase text-emerald-700">
                        <Globe className="h-3 w-3" /> Live Production
                    </span>
                    <Button variant="outline" className="glass py-5 px-6 border-white/20 bg-white/40">
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Layout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-1 glass-light border-white/20 shadow-premium p-4 rounded-[2rem] h-fit">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4 mb-4">Page Sections</p>
                    <div className="space-y-1">
                        {sections.map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveLayer(s)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                                    activeLayer === s
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-600 hover:bg-white/50"
                                )}
                            >
                                {s}
                                {activeLayer === s && <ChevronRight className="h-4 w-4" />}
                            </button>
                        ))}
                    </div>
                </Card>

                <div className="lg:col-span-3 space-y-6">
                    <Card className="glass-light border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/10 bg-white/40">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black text-slate-900">{activeLayer} Editor</CardTitle>
                                        <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Direct Live Editing Enabled</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-xl"><Monitor className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-xl"><Smartphone className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm font-bold text-slate-400">Loading Section Data...</p>
                                </div>
                            ) : (
                                currentItems.map(item => (
                                    <div key={item.id} className="space-y-3 group">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                                {item.content_key.replace('_', ' ')}
                                            </Label>
                                            <span className="text-[10px] text-slate-300 font-bold">Ref: #{item.id}</span>
                                        </div>
                                        <div className="relative">
                                            {item.content_value.length > 60 ? (
                                                <textarea
                                                    className="w-full min-h-[100px] rounded-2xl border border-white/20 bg-white/50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all group-hover:border-primary/30"
                                                    value={changes[item.id] !== undefined ? changes[item.id] : item.content_value}
                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                />
                                            ) : (
                                                <Input
                                                    className="glass-input h-14 pr-32"
                                                    value={changes[item.id] !== undefined ? changes[item.id] : item.content_value}
                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                />
                                            )}
                                            {changes[item.id] !== undefined && (
                                                <div className="mt-2 flex items-center justify-end gap-2 animate-in fade-in slide-in-from-top-1">
                                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase" onClick={() => {
                                                        const newChanges = { ...changes };
                                                        delete newChanges[item.id];
                                                        setChanges(newChanges);
                                                    }}>Discard</Button>
                                                    <Button size="sm" className="h-8 rounded-lg px-4 gap-2 text-[10px] font-black uppercase gradient-primary" onClick={() => saveChanges(item.id)}>
                                                        <Save className="h-3 w-3" /> Save Changes
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass-light border-white/20 shadow-premium p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900">Media Library</h4>
                                    <p className="text-xs text-muted-foreground font-medium">Manage images and icons used in this section.</p>
                                </div>
                                <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-bold border border-slate-100">Browse</Button>
                            </div>
                        </Card>
                        <Card className="glass-light border-white/20 shadow-premium p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                    <Settings2 className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900">SEO Settings</h4>
                                    <p className="text-xs text-muted-foreground font-medium">Optimize section for search engines.</p>
                                </div>
                                <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-bold border border-slate-100">Config</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
