import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    Search,
    Filter,
    Clock,
    User,
    ChevronRight,
    CheckCircle2,
    CalendarDays
} from "lucide-react";

export default function DoctorAppointments() {
    const [searchQuery, setSearchQuery] = useState("");

    const appointments = [
        { id: "APT-1001", patient: "Trust Mwendabai", time: "09:00 AM", date: "Today", status: "Confirmed", type: "Full Body Checkup" },
        { id: "APT-1002", patient: "Chileshe Mulenga", time: "10:30 AM", date: "Today", status: "Pending", type: "Lipid Profile" },
        { id: "APT-1003", patient: "Sarah Phiri", time: "02:00 PM", date: "Tomorrow", status: "Confirmed", type: "Malaria Screening" },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">Appointments</h1>
                    <p className="text-white/60 font-bold mt-1">Manage your clinical schedule and consultations.</p>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-glow-cyan transition-all">
                    <CalendarDays className="mr-2 h-4 w-4" /> View Calendar
                </Button>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight">Consultation Registry</CardTitle>
                        <div className="flex gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="Search patients..."
                                    className="pl-12 h-12 w-64 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {appointments.map((apt) => (
                            <div key={apt.id} className="p-8 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center font-black text-2xl text-white/10 group-hover:bg-cyan-500/20 group-hover:text-cyan-500 transition-all duration-500 border border-white/5">
                                        <User className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg group-hover:text-cyan-400 transition-colors italic tracking-tight">{apt.patient}</h4>
                                        <div className="flex items-center gap-4 mt-1.5">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-cyan-500" /> {apt.time}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">{apt.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Status</p>
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            apt.status === 'Confirmed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <Button variant="ghost" className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest gap-2 text-white/40 hover:bg-white/10 hover:text-white px-6 border border-white/5">
                                        Details <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
