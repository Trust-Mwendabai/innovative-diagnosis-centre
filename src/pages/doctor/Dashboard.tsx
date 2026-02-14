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
    Stethoscope
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DoctorDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Today's Consultations", value: "8", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Pending Reviews", value: "14", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Tests Analyzed", value: "124", icon: Microscope, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Reports Generated", value: "98", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Expert <span className="text-primary italic underline decoration-[hsl(var(--gold))] underline-offset-8">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-2">Welcome back, Dr. {user?.name}. Here is your clinical summary.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Status</p>
                        <p className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live & Encrypted
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="glass-light border-white/20 shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Real-time</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Consultations */}
                <Card className="lg:col-span-2 glass-light border-white/20 shadow-2xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/10 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 italic">Active Queue</CardTitle>
                            <p className="text-muted-foreground text-sm font-medium">Prioritized patient assessments for today.</p>
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
                        <div className="divide-y divide-slate-100">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors italic">Patient #{1000 + i}</h4>
                                            <p className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                <Activity className="h-3 w-3 text-[hsl(var(--gold))]" /> Lipid Profile Analysis
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="hidden md:block text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time Assigned</p>
                                            <p className="text-sm font-black text-slate-900">09:30 AM</p>
                                        </div>
                                        <Button variant="ghost" className="rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 text-primary hover:bg-primary/5 px-6">
                                            Review Data <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-slate-50/50 text-center border-t border-white/10">
                            <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground gap-2">
                                View Full Clinical Queue <ArrowRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Bulletins / Recent Actions */}
                <div className="space-y-8">
                    <Card className="glass-light border-white/20 shadow-2xl rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                <Activity className="h-5 w-5 text-primary" />
                                Lab Feed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 last:before:bottom-6">
                                    <div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full bg-[hsl(var(--gold))]" />
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">14 mins ago</p>
                                    <p className="text-sm font-bold text-slate-900 leading-snug">New molecular data available for Patient #8821</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="gradient-primary shadow-2xl rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <Stethoscope className="h-12 w-12 text-white/20 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-2xl font-black mb-4 leading-tight italic">Diagnostic<br />Guidance</h3>
                            <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">Access the latest protocol updates for molecular screening across Zambia.</p>
                            <Button className="w-full bg-white text-primary font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl hover:bg-slate-50 hover:-translate-y-1 transition-all">
                                Open Protocols
                            </Button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                    </Card>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
