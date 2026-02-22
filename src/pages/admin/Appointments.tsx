import { useState, useEffect } from "react";
import { CalendarDays, Filter, Search, MoreVertical, X, Check, Clock, User, Calendar, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Appointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/appointments/read.php`);
            const data = await res.json();
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error("Failed to fetch appointments");
            toast.error("Network error fetching appointments");
        } finally {
            setLoading(false);
        }
    };

    // Filter logic could be added here similar to Patients page

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments Manager</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Schedule and manage patient consultations.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="gradient-primary shadow-lg shadow-primary/20 py-6 px-6 rounded-xl font-bold">
                        <CalendarDays className="mr-2 h-5 w-5" /> New Appointment
                    </Button>
                </div>
            </div>

            <Card className="glass-light border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/10 bg-slate-100/50 dark:bg-slate-900/60">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white">All Appointments</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    placeholder="Search details..."
                                    className="pl-9 w-full sm:w-80 bg-white/80 dark:bg-slate-800/80 border-white/30 focus:bg-white text-slate-900 dark:text-white h-11 rounded-xl placeholder:text-slate-500 font-bold outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2 h-11 rounded-xl border-white/20 bg-white/40 text-slate-700 dark:text-slate-300 hover:bg-white/60">
                                <Filter className="h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 bg-white/40 dark:bg-slate-950/40">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-200/50 dark:bg-slate-800/50">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Patient</TableHead>
                                    <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Date & Time</TableHead>
                                    <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Doctor</TableHead>
                                    <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-center text-slate-700 dark:text-slate-300">Status</TableHead>
                                    <TableHead className="py-6 px-8 text-right text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-600 dark:text-slate-300 font-bold animate-pulse">Loading appointments...</TableCell>
                                    </TableRow>
                                ) : appointments.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-500 dark:text-slate-400 font-bold">No appointments found.</TableCell>
                                    </TableRow>
                                ) : (
                                    appointments.map((apt) => (
                                        <TableRow key={apt.id} className="group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors border-white/5">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{apt.patient_name || `Patient #${apt.patient_id}`}</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">ID: {apt.patient_id}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                        <Calendar className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-700 dark:text-slate-300">{apt.date}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-500 font-bold flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {apt.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                        <Stethoscope className="h-5 w-5" />
                                                    </div>
                                                    <div className="font-bold text-slate-700 dark:text-slate-300">{apt.doctor_name || 'Unassigned'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 text-center">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                    apt.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800" :
                                                        apt.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800" :
                                                            "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800"
                                                )}>
                                                    {apt.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
