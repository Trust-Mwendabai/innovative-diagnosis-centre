import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
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
import { toast } from "sonner";

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
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now - in a real app, fetch from /api/patient/dashboard.php
        setTimeout(() => {
            setRecentBookings([
                { id: "1", test: "Full Body Checkup", date: "2024-03-20", time: "10:30", status: "confirmed" },
                { id: "2", test: "COVID-19 PCR", date: "2024-03-15", time: "14:00", status: "completed" }
            ]);
            setStats({ pending: 1, completed: 5, results: 4 });
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-12 pt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-heading text-white">
                        Welcome, <span className="text-[hsl(var(--gold))]">{user?.name}</span>
                    </h1>
                    <p className="text-white/40 mt-1 font-medium tracking-wide uppercase text-xs">Healthcare Dashboard • {new Date().toLocaleDateString('en-ZM', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button className="rounded-xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-bold px-6 shadow-glow-gold">
                        Book a New Test
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Bookings", value: stats.pending, icon: Calendar, color: "text-[hsl(var(--saffron))]" },
                    { label: "Tests Completed", value: stats.completed, icon: CheckCircle2, color: "text-[hsl(var(--emerald-india))]" },
                    { label: "New Results", value: stats.results, icon: FileText, color: "text-[hsl(var(--gold))]" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="glass-card border-white/10 hover:border-white/20 transition-all hover:translate-y-[-4px]">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-white">{stat.value}</p>
                                </div>
                                <div className={cn("p-4 rounded-2xl bg-white/5", stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bookings Table */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card border-white/10 overflow-hidden">
                        <CardHeader className="border-b border-white/5 bg-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black font-heading text-white flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-[hsl(var(--saffron))]" />
                                    Upcoming Appointments
                                </CardTitle>
                                <Button variant="link" className="text-[hsl(var(--gold))] font-bold text-xs uppercase px-0">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {recentBookings.map((booking) => (
                                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                                                <FlaskConical className="h-5 w-5 text-[hsl(var(--gold))]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{booking.test}</h4>
                                                <p className="text-xs text-white/40">{booking.date} at {booking.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full",
                                                booking.status === "confirmed" ? "bg-[hsl(var(--saffron))]/20 text-[hsl(var(--saffron))]" : "bg-[hsl(var(--emerald-india))]/20 text-[hsl(var(--emerald-india))]"
                                            )}>
                                                {booking.status}
                                            </span>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowUpRight className="h-4 w-4 text-white/40" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    <Card className="glass-card border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                        <CardHeader>
                            <CardTitle className="text-lg font-black font-heading text-white flex items-center gap-2">
                                <Activity className="h-5 w-5 text-[hsl(var(--emerald-india))]" />
                                Health Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-black uppercase text-white/40 mb-2">Blood Type</p>
                                <p className="text-xl font-black text-white">O Positive</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-black uppercase text-white/40 mb-2">Last Checkup</p>
                                <p className="text-xl font-black text-white">15 Mar 2024</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold group rounded-2xl">
                        <User className="mr-2 h-5 w-5 text-[hsl(var(--gold))]" />
                        My Health Profile
                        <ArrowUpRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
