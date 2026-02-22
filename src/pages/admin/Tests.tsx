import { useState, useEffect } from "react";
import {
    Microscope,
    Search,
    Plus,
    Settings2,
    Trash2,
    Edit3,
    CheckCircle2,
    Package,
    Tag,
    ArrowUpRight,
    Info,
    Layers,
    Archive,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

interface Test {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    preparation: string;
}

interface TestPackage {
    id: string;
    name: string;
    test_ids: string;
    price: number;
    description: string;
}

export default function Tests() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal states
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);
    const [testForm, setTestForm] = useState({
        name: "",
        category: "General",
        price: "",
        description: "",
        preparation: "Default"
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/tests/read.php?search=${search}`);
            const data = await res.json();
            if (data.success) setTests(data.tests);
        } catch (error) {
            toast.error("Error fetching tests");
        } finally {
            setLoading(false);
        }
    };



    const handleSubmitTest = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingTest
            ? `${API_BASE_URL}/tests/update.php`
            : `${API_BASE_URL}/tests/create.php`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingTest ? { id: editingTest.id, ...testForm } : testForm),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editingTest ? "Test updated" : "Test created");
                setIsTestModalOpen(false);
                setEditingTest(null);
                fetchTests();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Connection error");
        }
    };

    const deleteTest = async (id: string) => {
        if (!confirm("Are you sure you want to delete this test?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/tests/delete.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Test deleted");
                fetchTests();
            }
        } catch (error) {
            toast.error("Error deleting test");
        }
    };

    const openEditTest = (test: Test) => {
        setEditingTest(test);
        setTestForm({
            name: test.name,
            category: test.category,
            price: test.price.toString(),
            description: test.description,
            preparation: test.preparation
        });
        setIsTestModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white italic">Medical Tests</h1>
                    <p className="text-muted-foreground font-bold mt-1">Manage diagnostic test catalog and pricing.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass py-5 px-6 border-white/20 bg-white/40">
                        <Tag className="mr-2 h-4 w-4" /> Categories
                    </Button>
                    <Button
                        className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20"
                        onClick={() => { setEditingTest(null); setTestForm({ name: "", category: "General", price: "", description: "", preparation: "" }); setIsTestModalOpen(true); }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Test
                    </Button>
                </div>
            </div>

            <div className="flex bg-slate-900/40 backdrop-blur-md border border-white/10 p-1.5 h-16 rounded-[1.5rem] mb-10 w-fit mx-auto lg:mx-0">
                <div className="rounded-xl px-10 h-full bg-emerald-500 text-white shadow-lg font-black flex items-center gap-3 transition-all duration-300">
                    <Microscope className="h-4 w-4" /> Diagnostic Tests
                </div>
            </div>

            <Card className="glass-light border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-slate-900/60 dark:bg-slate-900/80">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight">Catalog <span className="text-emerald-400">Inventory</span></CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search by test name..."
                                className="pl-10 w-full sm:w-96 bg-black/40 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-slate-600 h-12 rounded-xl transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchTests()}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground font-bold animate-pulse">Loading tests...</p>
                        </div>
                    ) : tests.length === 0 ? (
                        <div className="text-center py-32 bg-white/20">
                            <Archive className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white italic">No Tests Found</h3>
                            <Button variant="link" className="font-bold text-primary" onClick={() => setIsTestModalOpen(true)}>Add your first test now</Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-800/60 border-b border-white/5">
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableHead className="py-6 px-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Diagnostic Title</TableHead>
                                        <TableHead className="py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Classification</TableHead>
                                        <TableHead className="py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 text-center">Price (USD)</TableHead>
                                        <TableHead className="py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Preparation Guidance</TableHead>
                                        <TableHead className="py-6 px-8 text-right text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Management</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.map((test) => (
                                        <TableRow key={test.id} className="group hover:bg-slate-800/60 transition-colors border-white/5">
                                            <TableCell className="py-7 px-8">
                                                <div>
                                                    <div className="font-black text-white group-hover:text-emerald-400 transition-colors text-lg italic tracking-tight">{test.name}</div>
                                                    <div className="text-sm text-slate-400 font-bold line-clamp-1 mt-1">{test.description}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <span className="inline-flex items-center px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                                                    {test.category || 'General'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-6 text-center font-black text-white text-base">
                                                ${parseFloat(test.price).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                                    <Info className="h-4 w-4 text-emerald-400" /> {test.preparation || 'No specific prep'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl" onClick={() => openEditTest(test)}>
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => deleteTest(test.id)}>
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
                </CardContent>
            </Card>

            {/* Test Create/Edit Modal */}
            <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
                <DialogContent className="sm:max-w-md glass-light border-white/10 shadow-3xl rounded-[2.5rem] p-0 overflow-hidden dark:bg-slate-900">
                    <DialogHeader className="p-6 bg-slate-950/40 border-b border-white/5">
                        <DialogTitle className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                            {editingTest ? <Edit3 className="h-5 w-5 text-emerald-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
                            {editingTest ? "Edit Test Definition" : "Register Diagnostic Test"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitTest} className="p-6 space-y-5 bg-slate-900/40">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Diagnostic Name</Label>
                                <Input
                                    required
                                    className="h-11 bg-slate-950/50 border-white/10 text-white rounded-xl font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all px-4"
                                    value={testForm.name}
                                    onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                                    placeholder="e.g. Complete Blood Count (CBC)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</Label>
                                <select
                                    className="w-full h-11 rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all"
                                    value={testForm.category}
                                    onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                                >
                                    <option value="General" className="bg-slate-900">General</option>
                                    <option value="Radiology" className="bg-slate-900">Radiology</option>
                                    <option value="Pathology" className="bg-slate-900">Pathology</option>
                                    <option value="Cardiology" className="bg-slate-900">Cardiology</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price ($)</Label>
                                <Input
                                    type="number"
                                    required
                                    className="h-11 bg-slate-950/50 border-white/10 text-white rounded-xl font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all px-4"
                                    value={testForm.price}
                                    onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</Label>
                                <textarea
                                    className="w-full min-h-[80px] rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                                    value={testForm.description}
                                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                                    placeholder="Describe the clinical purpose of this test..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Preparation Required</Label>
                                <Input
                                    className="h-11 bg-slate-950/50 border-white/10 text-white rounded-xl font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 transition-all px-4"
                                    value={testForm.preparation}
                                    onChange={(e) => setTestForm({ ...testForm, preparation: e.target.value })}
                                    placeholder="e.g. Fasting for 12 hours..."
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 gap-3">
                            <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-black text-slate-400 hover:bg-white/5 hover:text-white transition-all" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="flex-1 h-12 rounded-xl gradient-primary shadow-lg shadow-primary/20 text-sm font-black uppercase tracking-widest transition-all active:scale-95">
                                {editingTest ? "Update Changes" : "Create Test"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}
