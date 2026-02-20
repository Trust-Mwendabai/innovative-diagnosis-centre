import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    History,
    Calendar,
    FlaskConical,
    FileText,
    Activity,
    Clock,
    ChevronRight,
    MapPin,
    ArrowUpRight,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

export default function PatientHistory() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/patients/details.php?id=${user?.id}`);
                const data = await res.json();
                if (data.success) {
                    // Combine appointments and results into a timeline
                    const appointments = (data.history || []).map(a => ({
                        id: `app-${a.id}`,
                        type: 'appointment',
                        title: a.test_name || 'Diagnostic Session',
                        date: a.date,
                        time: a.time,
                        status: a.status,
                        branch: a.branch_name,
                        icon: Calendar
                    }));

                    const results = (data.results || []).map(r => ({
                        id: `res-${r.id}`,
                        type: 'result',
                        title: r.test_name || 'Lab Report Verified',
                        date: r.uploaded_at.split(' ')[0],
                        time: r.uploaded_at.split(' ')[1],
                        status: r.status,
                        icon: FileText
                    }));

                    const combined = [...appointments, ...results].sort((a, b) => {
                        const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`).getTime();
                        const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`).getTime();
                        return dateB - dateA;
                    });

                    setEvents(combined);
                }
                setLoading(false);
            } catch (error) {
                console.error("Temporal synchronization failed:", error);
                setLoading(false);
            }
        };

        if (!user?.id) {
            setLoading(false);
            return;
        }
        fetchHistory();
    }, [user?.id]);

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        My Health <span className="text-[hsl(var(--gold))]">History</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Past appointments and test results</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="FILTER BY DATE OR EVENT..."
                        className="bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all w-72"
                    />
                </div>
            </div>

            {/* Timeline View */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[hsl(var(--gold))] via-white/5 to-transparent hidden md:block" />

                <div className="space-y-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[hsl(var(--gold))]/20 border-t-[hsl(var(--gold))] rounded-full animate-spin" />
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative md:pl-24 group"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 md:left-8 md:-translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-[hsl(var(--gold))] z-10 group-hover:scale-150 transition-transform group-hover:shadow-glow-gold hidden md:block" />

                                <Card className="glass-card border-white/10 group-hover:border-[hsl(var(--gold))]/30 transition-all overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Event Meta Sidebar */}
                                        <div className="w-full md:w-48 bg-white/5 p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/5">
                                            <p className="text-[10px] font-black text-[hsl(var(--gold))] uppercase tracking-widest mb-1">{event.type}</p>
                                            <p className="text-xl font-black text-white">{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter mt-1">{new Date(event.date).getFullYear()}</p>
                                        </div>

                                        {/* Event Content */}
                                        <CardContent className="p-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                                                    event.type === 'result' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                                                )}>
                                                    <event.icon className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{event.title}</h4>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-2 text-white/40">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{event.time}</span>
                                                        </div>
                                                        {event.branch && (
                                                            <div className="flex items-center gap-2 text-white/40">
                                                                <MapPin className="h-3 w-3" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">{event.branch}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border",
                                                    event.status === 'completed' || event.status === 'Normal' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                        event.status === 'confirmed' ? "bg-[hsl(var(--saffron))]/10 text-[hsl(var(--saffron))] border-[hsl(var(--saffron))]/20" :
                                                            "bg-white/5 text-white/30 border-white/10"
                                                )}>
                                                    {event.status}
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                                                    <ArrowUpRight className="h-5 w-5 text-white" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[3rem] md:ml-24">
                            <History className="h-12 w-12 text-white/10 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-white/40 uppercase tracking-widest">Temporal Stream Silent</h3>
                            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em] mt-2">No historical health events detected in the system</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Export Action */}
            <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--gold))]/20 to-transparent p-1 rounded-[3rem]">
                <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-[2rem] bg-[hsl(var(--gold))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/20">
                            <FileText className="h-10 w-10 text-[hsl(var(--gold))]" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Full Medical Record</h4>
                            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1">Export your complete diagnostic history as a single document</p>
                        </div>
                    </div>
                    <Button className="h-16 px-10 rounded-2xl bg-[hsl(var(--gold))] text-slate-950 font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all">
                        Generate Export <ChevronRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
