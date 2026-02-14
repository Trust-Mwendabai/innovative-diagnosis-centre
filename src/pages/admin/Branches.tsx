import { useState, useEffect } from "react";
import {
    MapPin,
    Plus,
    Edit3,
    Trash2,
    Phone,
    Mail,
    Clock,
    ExternalLink,
    Search,
    Building2,
    Users2,
    CalendarDays,
    ChevronRight,
    Heart,
    Settings2
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    opening_hours: string;
}

export default function Branches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        opening_hours: "08:00 AM - 05:00 PM"
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await fetch("http://localhost/IDC/api/branches/read.php");
            const data = await res.json();
            if (data.success) setBranches(data.branches);
        } catch (error) {
            toast.error("Error fetching branches");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingBranch
            ? "http://localhost/IDC/api/branches/update.php"
            : "http://localhost/IDC/api/branches/create.php";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingBranch ? { id: editingBranch.id, ...form } : form),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editingBranch ? "Branch updated" : "Branch created");
                setIsModalOpen(false);
                setEditingBranch(null);
                fetchBranches();
            }
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const deleteBranch = async (id: string) => {
        if (!confirm("Are you sure? This will affect staff assigned to this branch.")) return;
        try {
            const response = await fetch("http://localhost/IDC/api/branches/delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Branch removed");
                fetchBranches();
            }
        } catch (error) {
            toast.error("Error deleting branch");
        }
    };

    const openEdit = (b: Branch) => {
        setEditingBranch(b);
        setForm({
            name: b.name,
            address: b.address,
            phone: b.phone,
            email: b.email,
            opening_hours: b.opening_hours
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Locations</h1>
                    <p className="text-muted-foreground font-medium">Manage your clinical network and site operations.</p>
                </div>
                <Button
                    className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20"
                    onClick={() => { setEditingBranch(null); setForm({ name: "", address: "", phone: "", email: "", opening_hours: "08:00 AM - 05:00 PM" }); setIsModalOpen(true); }}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Branch
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 animate-pulse" />
                    ))
                ) : branches.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white/40 border border-white/20 rounded-[2.5rem]">
                        <Building2 className="w-20 h-20 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">No Branches Registered</h3>
                        <p className="text-muted-foreground font-medium mb-6">Initialize your first location to start assigning staff.</p>
                        <Button variant="outline" onClick={() => setIsModalOpen(true)}>Create Branch Now</Button>
                    </div>
                ) : (
                    branches.map((b) => (
                        <Card key={b.id} className="glass-light border-white/20 shadow-premium group overflow-hidden rounded-[2.5rem] transition-all hover:scale-[1.02]">
                            <CardHeader className="p-8 pb-4 relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-600">
                                        <Building2 className="h-7 w-7" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-2xl hover:bg-primary/5 text-slate-400 hover:text-primary" onClick={() => openEdit(b)}>
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600" onClick={() => deleteBranch(b.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900 leading-tight">{b.name}</CardTitle>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-2">
                                    <MapPin className="h-3.5 w-3.5 text-primary" /> {b.address || 'Location Pending'}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/20">
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-bold text-slate-700">{b.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-900">{b.opening_hours || 'Closed'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Staff</p>
                                        <div className="flex items-center gap-2">
                                            <Users2 className="h-4 w-4 text-primary" />
                                            <span className="text-lg font-black text-slate-900">12</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Today's Tests</p>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-emerald-500" />
                                            <span className="text-lg font-black text-slate-900">48</span>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full py-6 rounded-2xl border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all font-bold text-sm">
                                    Management Portal <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Branch Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl glass border-white/20 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-primary/5 border-b border-white/10">
                        <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            {editingBranch ? "Edit Location" : "Initialize New Site"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Branch Name</Label>
                                <Input
                                    required
                                    className="glass-input h-12"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. IDC Lusaka Main"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Official Phone</Label>
                                <Input
                                    className="glass-input h-12"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+260..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</Label>
                                <Input
                                    type="email"
                                    className="glass-input h-12"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="branch@idc.com"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Physical Address</Label>
                                <textarea
                                    className="w-full min-h-[80px] rounded-2xl border border-white/20 bg-white/50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    placeholder="Street name, City, Landmark..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Opening Hours</Label>
                                <Input
                                    className="glass-input h-12"
                                    value={form.opening_hours}
                                    onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                                    placeholder="e.g. Mon-Fri: 08:00 - 17:00"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 gap-3">
                            <Button type="button" variant="ghost" className="py-6 px-10 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="flex-1 py-7 rounded-2xl gradient-primary shadow-xl shadow-primary/20 text-lg font-black">
                                {editingBranch ? "Update Site Data" : "Initialize Site"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
