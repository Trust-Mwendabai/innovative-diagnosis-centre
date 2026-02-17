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
    const [packages, setPackages] = useState<TestPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("tests");

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
        fetchPackages();
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

    const fetchPackages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/packages/read.php`);
            const data = await res.json();
            if (data.success) setPackages(data.packages);
        } catch (error) {
            console.error("Error fetching packages", error);
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
                    <p className="text-muted-foreground font-medium">Manage diagnostic test catalog and pricing bundles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass py-5 px-6 border-white/20 bg-white/40">
                        <Tag className="mr-2 h-4 w-4" /> Categories
                    </Button>
                    <Button
                        className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20"
                        onClick={() => { setEditingTest(null); setTestForm({ name: "", category: "General", price: "", description: "", preparation: "" }); setIsTestModalOpen(true); }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Item
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="tests" onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white/40 border border-white/20 p-1 h-14 rounded-2xl mb-8">
                    <TabsTrigger value="tests" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold flex gap-2">
                        <Microscope className="h-4 w-4" /> Diagnostic Tests
                    </TabsTrigger>
                    <TabsTrigger value="packages" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold flex gap-2">
                        <Package className="h-4 w-4" /> Service Packages
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tests" className="mt-0">
                    <Card className="glass-light border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/10 bg-white/40">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <CardTitle className="text-xl font-black text-slate-900">Diagnostic Catalog</CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by test name..."
                                        className="pl-9 w-full sm:w-80 bg-white/50 border-white/30 focus:bg-white h-11 rounded-xl"
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
                                    <p className="text-muted-foreground font-bold animate-pulse">Loading Catalog...</p>
                                </div>
                            ) : tests.length === 0 ? (
                                <div className="text-center py-32 bg-white/20">
                                    <Archive className="w-20 h-20 text-slate-100 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800">Catalogue Empty</h3>
                                    <Button variant="link" onClick={() => setIsTestModalOpen(true)}>Add your first test now</Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="hover:bg-transparent border-white/10">
                                                <TableHead className="py-6 px-8 text-xs font-bold uppercase tracking-widest">Test Name</TableHead>
                                                <TableHead className="py-6 text-xs font-bold uppercase tracking-widest">Category</TableHead>
                                                <TableHead className="py-6 text-xs font-bold uppercase tracking-widest text-center">Price ($)</TableHead>
                                                <TableHead className="py-6 text-xs font-bold uppercase tracking-widest">Instructions</TableHead>
                                                <TableHead className="py-6 px-8 text-right text-xs font-bold uppercase tracking-widest">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tests.map((test) => (
                                                <TableRow key={test.id} className="group hover:bg-white/60 transition-colors border-white/5">
                                                    <TableCell className="py-6 px-8">
                                                        <div>
                                                            <div className="font-black text-slate-900 group-hover:text-primary transition-colors text-base">{test.name}</div>
                                                            <div className="text-xs text-muted-foreground font-medium line-clamp-1">{test.description}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase border border-blue-100">
                                                            {test.category}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-6 text-center font-black text-slate-900">
                                                        {test.price}
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                            <Info className="h-3.5 w-3.5 text-slate-400" /> {test.preparation || 'No specific prep'}
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
                </TabsContent>

                <TabsContent value="packages" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <Card key={pkg.id} className="glass-light border-white/20 shadow-xl rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-transform">
                                <CardHeader className="p-8 pb-0">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <span className="text-2xl font-black text-slate-900">${pkg.price}</span>
                                    </div>
                                    <CardTitle className="text-xl font-black text-slate-900 mt-6">{pkg.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <p className="text-sm text-muted-foreground font-medium mb-6 line-clamp-2">{pkg.description}</p>
                                    <div className="space-y-3">
                                        {JSON.parse(pkg.test_ids || '[]').length} Included Tests
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-white/50 border border-white/20 rounded-lg text-[10px] font-black uppercase text-slate-500">Full Access</span>
                                            <span className="px-3 py-1 bg-white/50 border border-white/20 rounded-lg text-[10px] font-black uppercase text-slate-500">Fast Results</span>
                                        </div>
                                    </div>
                                    <div className="pt-8 flex gap-2">
                                        <Button className="flex-1 rounded-xl font-bold border-slate-200">View Bundle</Button>
                                        <Button variant="ghost" className="w-11 h-11 p-0 rounded-xl group-hover:bg-rose-50 group-hover:text-rose-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <button className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all group">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                                <Plus className="h-8 w-8" />
                            </div>
                            <span className="font-bold">Create New Bundle</span>
                        </button>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Test Create/Edit Modal */}
            <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
                <DialogContent className="sm:max-w-xl glass border-white/20 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-primary/5 border-b border-white/10">
                        <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            {editingTest ? <Edit3 className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
                            {editingTest ? "Edit Test Item" : "New Diagnostic Item"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitTest} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Test Name</Label>
                                <Input
                                    required
                                    className="glass-input h-12"
                                    value={testForm.name}
                                    onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                                    placeholder="e.g. Complete Blood Count (CBC)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</Label>
                                <select
                                    className="w-full h-12 rounded-xl border border-white/20 bg-white/50 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    value={testForm.category}
                                    onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Pathology">Pathology</option>
                                    <option value="Cardiology">Cardiology</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Price ($)</Label>
                                <Input
                                    type="number"
                                    required
                                    className="glass-input h-12"
                                    value={testForm.price}
                                    onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</Label>
                                <textarea
                                    className="w-full min-h-[100px] rounded-2xl border border-white/20 bg-white/50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={testForm.description}
                                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                                    placeholder="Describe the clinical purpose of this test..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Preparation Required</Label>
                                <Input
                                    className="glass-input h-12"
                                    value={testForm.preparation}
                                    onChange={(e) => setTestForm({ ...testForm, preparation: e.target.value })}
                                    placeholder="e.g. Fasting for 12 hours..."
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 gap-3">
                            <Button type="button" variant="ghost" className="py-6 px-10 rounded-2xl font-bold" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="flex-1 py-7 rounded-2xl gradient-primary shadow-xl shadow-primary/20 text-lg font-black">
                                {editingTest ? "Update Changes" : "Create Test Record"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
