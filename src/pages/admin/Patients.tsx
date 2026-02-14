import { useState, useEffect } from "react";
import { Users, Search, UserPlus, Filter, Phone, Mail, Calendar, Eye, Activity, History, FileText, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    total_appointments: number;
    last_test_date: string;
    created_at: string;
}

export default function Patients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [patientHistory, setPatientHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchPatients();
    }, [search]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost/IDC/api/patients/read.php?search=${search}`);
            const data = await res.json();
            if (data.success) setPatients(data.patients);
        } catch (error) {
            toast.error("Error fetching patients");
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (id: string) => {
        try {
            const res = await fetch(`http://localhost/IDC/api/patients/details.php?id=${id}`);
            const data = await res.json();
            if (data.success) {
                setSelectedPatient(data.patient);
                setPatientHistory(data.history);
                setIsDetailsOpen(true);
            }
        } catch (error) {
            toast.error("Error fetching patient details");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patients</h1>
                    <p className="text-muted-foreground font-medium">Manage patient records and clinical history.</p>
                </div>
                <Button className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Patient
                </Button>
            </div>

            <Card className="glass-light border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/10 bg-white/40">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-xl font-black text-slate-900">Patient Database</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search name, phone or email..."
                                    className="pl-9 w-full sm:w-80 bg-white/50 border-white/30 focus:bg-white h-11 rounded-xl"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2 h-11 rounded-xl border-white/20 bg-white/30">
                                <Filter className="h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && patients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground font-bold animate-pulse">Accessing Secure Records...</p>
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="text-center py-32 bg-white/20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No Patient Records</h3>
                            <p className="text-muted-foreground font-medium max-w-md mx-auto">
                                Patients will appear here automatically after their first appointment booking.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-white/10">
                                        <TableHead className="py-6 px-8 text-xs font-bold uppercase tracking-widest">Patient Name</TableHead>
                                        <TableHead className="py-6 text-xs font-bold uppercase tracking-widest">Contact Info</TableHead>
                                        <TableHead className="py-6 text-xs font-bold uppercase tracking-widest text-center">Tests</TableHead>
                                        <TableHead className="py-6 text-xs font-bold uppercase tracking-widest">Last Activity</TableHead>
                                        <TableHead className="py-6 px-8 text-right text-xs font-bold uppercase tracking-widest">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patients.map((p) => (
                                        <TableRow key={p.id} className="group hover:bg-white/60 transition-colors border-white/5">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 group-hover:text-primary transition-colors text-base">{p.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Registered: {new Date(p.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {p.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                        <Mail className="h-3.5 w-3.5" /> {p.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-black border border-slate-200">
                                                    {p.total_appointments}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                    {p.last_test_date ? p.last_test_date : "Never"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 px-4 gap-2 text-primary hover:bg-primary/5 rounded-xl font-bold transition-all transform active:scale-95"
                                                    onClick={() => viewDetails(p.id)}
                                                >
                                                    <Eye className="h-4 w-4" /> View Portal
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

            {/* Patient Details Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-2xl overflow-y-auto w-full p-0 border-l border-white/20 glass-light backdrop-blur-3xl">
                    <div className="p-8 space-y-8 animate-fade-in-right">
                        <SheetHeader className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/20">
                                    {selectedPatient?.name.charAt(0)}
                                </div>
                                <div>
                                    <SheetTitle className="text-3xl font-black text-slate-900">{selectedPatient?.name}</SheetTitle>
                                    <SheetDescription className="text-slate-500 font-medium text-base">Patient ID: #PNT-{selectedPatient?.id.padStart(4, '0')}</SheetDescription>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 rounded-2xl bg-white/40 border border-white/20">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Appointments</p>
                                    <p className="text-2xl font-black text-slate-900">{patientHistory.length}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/40 border border-white/20">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Registration Date</p>
                                    <p className="text-sm font-black text-slate-900">{new Date(selectedPatient?.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                <History className="h-5 w-5 text-primary" />
                                <h3 className="text-xl font-black text-slate-900">Medical History</h3>
                            </div>

                            {patientHistory.length === 0 ? (
                                <div className="text-center py-12 p-8 rounded-3xl bg-slate-50/50 border border-slate-100">
                                    <p className="text-slate-500 font-bold">No historical data available.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {patientHistory.map((apt) => (
                                        <div key={apt.id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border",
                                                            apt.status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-100"
                                                        )}>
                                                            {apt.status}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase text-slate-400">{apt.location_type}</span>
                                                    </div>
                                                    <h4 className="text-lg font-black text-slate-900 mt-1">{apt.test_id || 'General Diagnostic'}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-slate-900">{new Date(apt.date).toLocaleDateString()}</p>
                                                    <p className="text-xs text-slate-400 font-bold">{apt.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                        <MapPin className="h-3.5 w-3.5" /> {apt.branch_name || 'Main Branch'}
                                                    </div>
                                                    {apt.staff_name && (
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                            <Activity className="h-3.5 w-3.5" /> {apt.staff_name}
                                                        </div>
                                                    )}
                                                </div>
                                                {apt.status === 'completed' && (
                                                    <Button size="sm" variant="outline" className="h-8 rounded-lg gap-2 font-bold text-xs border-slate-200">
                                                        <FileText className="h-3.5 w-3.5 text-primary" /> Report
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-white/20">
                            <Button className="w-full py-7 rounded-2xl gradient-primary shadow-xl shadow-primary/20 text-lg font-black">
                                Schedule New Appointment
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
