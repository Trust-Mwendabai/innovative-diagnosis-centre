import { useState, useEffect } from "react";
import { CalendarDays, Filter, Search, MoreVertical, X, Check, Clock } from "lucide-react";
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointments Manager</h1>
                    <p className="text-muted-foreground font-medium">Schedule and manage patient consultations.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="gradient-primary shadow-lg shadow-primary/20">
                        <CalendarDays className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                </div>
            </div>

            <Card className="glass-card border-white/20 shadow-premium">
                <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-black text-slate-900">All Appointments</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-9 bg-white/50 border-white/20" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">Loading appointments...</TableCell>
                                </TableRow>
                            ) : appointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No appointments found.</TableCell>
                                </TableRow>
                            ) : (
                                appointments.map((apt) => (
                                    <TableRow key={apt.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium">{apt.patient_name || `Patient #${apt.patient_id}`}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700">{apt.date}</span>
                                                <span className="text-xs text-muted-foreground">{apt.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{apt.doctor_name || 'Unassigned'}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                apt.status === 'confirmed' ? "bg-emerald-100 text-emerald-600" :
                                                    apt.status === 'pending' ? "bg-amber-100 text-amber-600" :
                                                        "bg-slate-100 text-slate-600"
                                            )}>
                                                {apt.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
