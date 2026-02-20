import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import {
    Calendar,
    FileText,
    User,
    Settings,
    Bell,
    Search,
    Activity,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    FlaskConical,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/config";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PatientDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        results: 0
    });
    const [patientData, setPatientData] = useState<any>(null);
    const [latestMetrics, setLatestMetrics] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                // Fetch summary and notifications in parallel
                const [summaryRes, notifRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/patients/summary.php?id=${user.id}`).catch(err => {
                        console.error("Summary fetch failed:", err);
                        return null;
                    }),
                    fetch(`${API_BASE_URL}/notifications/read.php?patient_id=${user.id}`).catch(err => {
                        console.error("Notifications fetch failed:", err);
                        return null;
                    })
                ]);

                // Process Summary Data
                if (summaryRes && summaryRes.ok) {
                    try {
                        const summaryData = await summaryRes.json();
                        if (summaryData.success) {
                            setStats(summaryData.stats || { pending: 0, completed: 0, results: 0 });
                            setPatientData(summaryData.patient);
                            setLatestMetrics(summaryData.latest_metrics || []);

                            const upcoming = (summaryData.recent_bookings || []).map((h: any) => ({
                                id: h.id,
                                test: h.test_name || "Diagnostic Test",
                                date: h.date,
                                time: h.time,
                                status: h.status,
                                branch: h.branch_name || "Main Branch"
                            }));
                            setRecentBookings(upcoming);
                        }
                    } catch (e) {
                        console.error("Error parsing summary JSON:", e);
                    }
                }

                // Process Notifications Data
                if (notifRes && notifRes.ok) {
                    try {
                        const notifData = await notifRes.json();
                        if (notifData.success) {
                            setNotifications((notifData.notifications || []).map((n: any) => ({
                                id: n.id,
                                type: n.type || "alert",
                                message: n.message,
                                time: n.sent_at ? new Date(n.sent_at).toLocaleDateString() : "Recent",
                                read: n.status === 'read'
                            })));
                        }
                    } catch (e) {
                        console.error("Error parsing notifications JSON:", e);
                    }
                }

            } catch (error) {
                console.error("Critical error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.id]);

    return (
        <div className="space-y-10 pb-12">
            {/* Header with Quick Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading text-white tracking-tighter">
                        Healthy Day, <span className="text-[hsl(var(--gold))]">{user?.name}</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Integrated Diagnostic Control • Level 4 Clearance</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button asChild className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all">
                        <Link to="/patient/profile" className="flex items-center">
                            <User className="mr-3 h-5 w-5" />
                            View User Profile
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest hover:bg-white/10">
                        <Link to="/patient/appointments" className="flex items-center">
                            <FlaskConical className="mr-3 h-5 w-5 text-[hsl(var(--gold))]" />
                            Book New Test
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Notification Bar */}
            <AnimatePresence>
                {loading ? (
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-64" />
                            </div>
                        </div>
                    </div>
                ) : notifications.some(n => !n.read) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/20 rounded-[2rem] p-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--gold))] flex items-center justify-center animate-pulse">
                                <Bell className="h-6 w-6 text-slate-950" />
                            </div>
                            <div>
                                <h4 className="font-black text-white text-sm uppercase tracking-wider">Priority Alert</h4>
                                <p className="text-white/70 text-sm font-medium">{notifications.find(n => !n.read)?.message}</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--gold))] underline">
                            View Details
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <Card key={i} className="glass-card border-white/10 p-8 flex items-center justify-between">
                            <div className="space-y-3">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-10 w-12" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-16 w-16 rounded-[1.5rem]" />
                        </Card>
                    ))
                ) : (
                    [
                        { label: "Active Nodes", value: stats.pending, icon: Calendar, color: "text-[hsl(var(--saffron))]", desc: "Scheduled Visits" },
                        { label: "Data Verified", value: stats.completed, icon: CheckCircle2, color: "text-[hsl(var(--emerald-india))]", desc: "Total Diagnostics" },
                        { label: "Active Results", value: stats.results, icon: FileText, color: "text-[hsl(var(--gold))]", desc: "Unread Reports" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="premium-card group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                <CardContent className="p-8 flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{stat.label}</p>
                                        <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                                        <p className="text-[9px] font-bold text-white/20 uppercase mt-1 tracking-widest">{stat.desc}</p>
                                    </div>
                                    <div className={cn("p-5 rounded-[1.5rem] bg-white/5", stat.color)}>
                                        <stat.icon className="h-8 w-8 transition-transform group-hover:scale-110" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Bookings Table */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card border-white/10 overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black font-heading text-white flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-[hsl(var(--saffron))]" />
                                    Upcoming Diagnostics
                                </CardTitle>
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[hsl(var(--gold))] transition-colors">
                                    Full Timeline <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {loading ? (
                                    [1, 2, 3].map((i) => (
                                        <div key={i} className="p-8 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <Skeleton className="h-16 w-16 rounded-2xl" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-5 w-48" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-10 w-24 rounded-xl" />
                                        </div>
                                    ))
                                ) : recentBookings.length > 0 ? (
                                    recentBookings.map((booking) => (
                                        <div key={booking.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[hsl(var(--gold))]/30 transition-all">
                                                    <FlaskConical className="h-8 w-8 text-[hsl(var(--gold))]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-white text-lg tracking-tight">{booking.test}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-white/30 font-bold uppercase tracking-widest">{booking.branch}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                                        <span className="text-xs text-[hsl(var(--saffron))] font-black">{booking.date} at {booking.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]",
                                                    booking.status === "confirmed" ? "bg-[hsl(var(--saffron))]/10 text-[hsl(var(--saffron))] border border-[hsl(var(--saffron))]/20" : "bg-[hsl(var(--emerald-india))]/10 text-[hsl(var(--emerald-india))] border border-[hsl(var(--emerald-india))]/20"
                                                )}>
                                                    {booking.status}
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                                                    <ArrowUpRight className="h-5 w-5 text-white" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No upcoming sessions detected</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    <Card className="glass-card border-white/10 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem]">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-black font-heading text-white flex items-center gap-3">
                                <Activity className="h-6 w-6 text-[hsl(var(--emerald-india))]" />
                                Health Index
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3">
                                    <ArrowUpRight className="h-4 w-4 text-white/10 group-hover:text-[hsl(var(--gold))] transition-colors" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-white/40 mb-2 tracking-[0.2em]">Primary Blood Node</p>
                                <p className="text-2xl font-black text-white">{patientData?.blood_group || "NOT SET"}</p>
                            </div>

                            {latestMetrics.slice(0, 2).map((metric: any) => (
                                <div key={metric.metric_name} className="p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3">
                                        <ArrowUpRight className="h-4 w-4 text-white/10 group-hover:text-[hsl(var(--gold))] transition-colors" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-white/40 mb-2 tracking-[0.2em]">{metric.metric_name}</p>
                                    <p className="text-2xl font-black text-white">{metric.metric_value} <span className="text-[10px] text-white/20 uppercase">{metric.unit}</span></p>
                                </div>
                            ))}

                            {latestMetrics.length === 0 && (
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3">
                                        <ArrowUpRight className="h-4 w-4 text-white/10 group-hover:text-[hsl(var(--gold))] transition-colors" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-white/40 mb-2 tracking-[0.2em]">Latest Session</p>
                                    <p className="text-2xl font-black text-white">NO DATA</p>
                                </div>
                            )}

                            <div className="pt-4">
                                <Button className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] group">
                                    <User className="mr-3 h-5 w-5 text-[hsl(var(--gold))]" />
                                    Archive Records
                                    <ChevronRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--emerald-india))]/20 to-transparent p-1 rounded-[2.5rem]">
                        <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.4rem] p-8 space-y-4">
                            <h5 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Quick Tip</h5>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Remember to fast for at least 8 hours before any metabolic or lipid panel tests for accurate results.
                            </p>
                            <Link to="/patient/resources" className="text-[hsl(var(--gold))] text-xs font-black uppercase tracking-widest hover:underline block pt-2">
                                Preparation Guide →
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
