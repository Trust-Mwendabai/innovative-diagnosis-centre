import { useState, useEffect } from "react";
import { Stethoscope, Search, UserPlus, Trash2, Mail, Phone, Calendar, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

interface Doctor {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
}

export default function Doctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDoctor, setNewDoctor] = useState({ name: "", email: "", phone: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/doctors.php`);
            const data = await res.json();
            if (data.success) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            toast.error("Error fetching doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/doctors.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDoctor)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Doctor created successfully");
                setIsAddModalOpen(false);
                setNewDoctor({ name: "", email: "", phone: "", password: "" });
                fetchDoctors();
            } else {
                toast.error(data.message || "Failed to create doctor");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteDoctor = async (id: string) => {
        if (!confirm("Are you sure you want to remove this doctor?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/doctors.php?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Doctor removed");
                fetchDoctors();
            } else {
                toast.error(data.message || "Failed to remove doctor");
            }
        } catch (error) {
            toast.error("Error removing doctor");
        }
    };

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        (d.phone && d.phone.includes(search))
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white italic">Doctors</h1>
                    <p className="text-muted-foreground font-bold mt-1">Manage clinical staff and doctors.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Doctor
                </Button>
            </div>

            <Card className="glass-light border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/10 bg-white/40">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-2xl font-black text-slate-900 dark:text-white italic">Medical Staff</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 w-full sm:w-80 bg-white/50 border-white/30 focus:bg-white h-11 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground font-bold animate-pulse">Loading doctors...</p>
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="text-center py-32 bg-white/20">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Stethoscope className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white italic">No Doctors Found</h3>
                            <p className="text-muted-foreground font-bold max-w-md mx-auto mt-2">
                                Manage your medical team by adding new doctors to the system.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-white/10">
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Doctor Name</TableHead>
                                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Contact Details</TableHead>
                                        <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 text-center">Joined</TableHead>
                                        <TableHead className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDoctors.map((d) => (
                                        <TableRow key={d.id} className="group hover:bg-white/60 transition-colors border-white/5">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-lg">
                                                        <Stethoscope className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 dark:text-slate-200 group-hover:text-primary transition-colors text-lg italic">Dr. {d.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                                                            <UserCheck className="h-3 w-3 text-emerald-500" /> Verified Practitioner
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        <Mail className="h-4 w-4 text-primary" /> {d.email}
                                                    </div>
                                                    {d.phone && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold italic">
                                                            <Phone className="h-4 w-4 text-emerald-500" /> {d.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 text-center text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                                {new Date(d.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                                                    onClick={() => handleDeleteDoctor(d.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Doctor Dialog */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem] border-white/20 glass-light backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">Add New Doctor</DialogTitle>
                        <DialogDescription className="font-medium">
                            Register a new medical professional to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDoctor} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <Input
                                placeholder="e.g. Kelvin Bwalya"
                                className="h-12 rounded-xl bg-white/50 border-white/20 focus:bg-white"
                                value={newDoctor.name}
                                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <Input
                                type="email"
                                placeholder="dr.kelvin@idc.zm"
                                className="h-12 rounded-xl bg-white/50 border-white/20 focus:bg-white"
                                value={newDoctor.email}
                                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone (Optional)</label>
                            <Input
                                placeholder="+260..."
                                className="h-12 rounded-xl bg-white/50 border-white/20 focus:bg-white"
                                value={newDoctor.phone}
                                onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporary Password</label>
                            <Input
                                type="password"
                                placeholder="doctor123"
                                className="h-12 rounded-xl bg-white/50 border-white/20 focus:bg-white"
                                value={newDoctor.password}
                                onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                            />
                        </div>
                        <DialogFooter className="pt-6">
                            <Button type="submit" className="w-full h-12 rounded-xl gradient-primary font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20" disabled={submitting}>
                                {submitting ? "Processing..." : "Add Doctor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
