import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    Activity,
    Calendar,
    Clock,
    Users,
    FileText,
    Microscope,
    ArrowRight,
    Search,
    Filter,
    FlaskConical,
    ChevronRight,
    Stethoscope,
    Bell,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/config";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DoctorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [notifLoading, setNotifLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = user?.id || '';
                const res = await fetch(`${API_BASE_URL}/notifications/read.php?user_id=${userId}&role=doctor`);
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications || []);
                }
            } catch (error) {
                console.error("Error fetching doctor notifications:", error);
            } finally {
                setNotifLoading(false);
            }
        };
        fetchNotifications();
    }, [user?.id]);

    const stats = [
        { label: "Visiting Today", value: "8", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "New Tasks", value: "14", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Total Tests", value: "124", icon: Microscope, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Records Signed", value: "98", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-white italic">
                        Doctor's <span className="text-cyan-500 underline decoration-[hsl(var(--gold))] underline-offset-8 uppercase">Assistant</span>
                    </h1>
                    <p className="text-white/60 font-bold mt-3 text-base italic">Welcome back, Dr. {user?.name}. Here is what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 tracking-widest">IDC Status</p>
                        <p className="text-xs font-black text-emerald-500 flex items-center justify-end gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            Active & Secure
                        </p>
                    </div>
                </div>
            </div>

            {/* Notifications Banner */}
            {!notifLoading && notifications.length > 0 && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[2.5rem] p-8 flex items-center justify-between backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-700" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-cyan-500 flex items-center justify-center shadow-glow-cyan rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Bell className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-black text-white text-base uppercase tracking-widest mb-1">
                                {notifications.length} New Update{notifications.length > 1 ? 's' : ''}
                            </h4>
                            <p className="text-white/60 text-sm font-bold italic">{notifications[0]?.message}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/doctor/notifications')}
                        variant="ghost"
                        className="relative z-10 h-12 px-6 rounded-2xl bg-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-cyan-700 transition-all border border-white/10"
                    >
                        See All Updates
                    </Button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.05] transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("p-4 rounded-2xl bg-slate-800/50 group-hover:bg-cyan-500/20 transition-colors duration-500", stat.color)}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-white/20 tracking-widest mt-1">Updates</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-5xl font-black text-white tracking-tighter">{stat.value}</h3>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Consultations */}
                <Card className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5 flex flex-row items-center justify-between bg-white/5">
                        <div>
                            <CardTitle className="text-3xl font-black text-white italic tracking-tighter uppercase">My Schedule</CardTitle>
                            <p className="text-white/40 text-sm font-bold mt-1">Confirmed visits for today.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Find patient..." className="pl-9 h-10 w-48 bg-white/50 border-white/10 rounded-xl text-xs" />
                            </div>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/20 bg-white/30">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-8 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer border-l-4 border-transparent hover:border-cyan-500">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center font-black text-2xl text-white/10 group-hover:bg-cyan-500/20 group-hover:text-cyan-500 transition-all duration-500 border border-white/5">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white text-lg group-hover:text-cyan-400 transition-colors italic tracking-tight uppercase">Patient Record #{1000 + i}</h4>
                                            <p className="text-[10px] font-black text-white/40 flex items-center gap-2 uppercase tracking-widest mt-1">
                                                <Activity className="h-3 w-3 text-cyan-500" /> Molecular Report
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="hidden md:block text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Time</p>
                                            <p className="text-sm font-black text-white tracking-widest">09:30 AM</p>
                                        </div>
                                        <Button
                                            onClick={() => navigate('/doctor/results')}
                                            variant="ghost"
                                            className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest gap-3 text-cyan-500 hover:bg-cyan-500/10 px-8 border border-white/5 bg-white/5"
                                        >
                                            Check Report <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-slate-950/20 text-center border-t border-white/10">
                            <Button
                                onClick={() => navigate('/doctor/appointments')}
                                variant="link"
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground gap-2 hover:text-cyan-400 transition-colors"
                            >
                                See All Appointments <ArrowRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements / Live Feed */}
                <div className="space-y-8">
                    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-white flex items-center gap-3 italic uppercase tracking-widest text-xs">
                                <Bell className="h-4 w-4 text-cyan-500" />
                                Updates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {notifLoading ? (
                                <div className="flex flex-col items-center gap-3 py-8">
                                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Refreshing...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.slice(0, 5).map((n, i) => (
                                    <div key={n.id || i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-white/5 last:before:bottom-6">
                                        <div className="absolute left-[-3px] top-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-glow-cyan" />
                                        <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1.5">
                                            {n.sent_at ? new Date(n.sent_at).toLocaleDateString() : 'Just Now'}
                                        </p>
                                        <p className="text-sm font-bold text-white/80 leading-relaxed italic">{n.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Bell className="h-8 w-8 text-white/10" />
                                    </div>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No updates found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-900 to-cyan-950 border-white/5 shadow-2xl rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <Stethoscope className="h-10 w-10 text-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-3xl font-black mb-4 leading-tight italic tracking-tighter uppercase">Helpful<br />Tips</h3>
                            <p className="text-white/60 text-sm font-bold mb-8 leading-relaxed">Advice to help you care for your patients better.</p>
                            <Button
                                onClick={() => toast.info("Expert tips coming soon")}
                                className="w-full bg-cyan-500 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-glow-cyan hover:bg-cyan-600 hover:-translate-y-1 transition-all border-none"
                            >
                                Get Expert Tips
                            </Button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                    </Card>
                </div>
            </div>
        </div>
    );
}
