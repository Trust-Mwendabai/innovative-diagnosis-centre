import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Clock,
    FileText,
    Shield,
    Calendar,
    Settings,
    Search,
    Trash2,
    MailOpen,
    ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

import { API_BASE_URL } from "@/lib/config";

export default function PatientNotifications() {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    React.useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`${API_BASE_URL}/notifications/read.php?patient_id=${user.id}`);
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications.map((n: any) => ({
                        id: n.id,
                        type: n.type || 'alert',
                        title: n.type === 'sms' ? 'SMS Alert' : n.type === 'email' ? 'Email Alert' : 'Notification',
                        message: n.message,
                        time: new Date(n.sent_at).toLocaleDateString(),
                        read: n.status === 'read',
                        priority: n.status === 'failed' ? 'high' : 'medium'
                    })));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user?.id]);

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.read === (filter === 'read'));

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'result': return FileText;
            case 'appointment': return Calendar;
            case 'security': return Shield;
            case 'billing': return CheckCircle2;
            default: return Bell;
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        Alert <span className="text-[hsl(var(--gold))]">Hub</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Integrated Notification Node • Priority Stream</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={markAllRead}
                        className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                    >
                        <MailOpen className="mr-3 h-5 w-5" />
                        Clear Priority
                    </Button>
                    <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/10 bg-white/5">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                {['all', 'unread', 'read'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === f
                                ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n, i) => {
                            const Icon = getIcon(n.type);
                            return (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className={cn(
                                        "glass-card border-white/10 transition-all group overflow-hidden relative",
                                        !n.read && "border-l-4 border-l-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                                    )}>
                                        <CardContent className="p-8">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex items-start gap-6">
                                                    <div className={cn(
                                                        "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all",
                                                        !n.read ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold" : "bg-white/5 text-white/40 border-white/10"
                                                    )}>
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className={cn("text-lg font-black uppercase tracking-tight", !n.read ? "text-white" : "text-white/60")}>
                                                                {n.title}
                                                            </h4>
                                                            {n.priority === 'high' && (
                                                                <span className="bg-red-500/20 text-red-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter animate-pulse">Critical</span>
                                                            )}
                                                        </div>
                                                        <p className={cn("text-[11px] font-medium leading-relaxed max-w-2xl", !n.read ? "text-white/80" : "text-white/30")}>
                                                            {n.message}
                                                        </p>
                                                        <div className="flex items-center gap-4 pt-2">
                                                            <div className="flex items-center gap-2 text-white/20">
                                                                <Clock className="h-3 w-3" />
                                                                <span className="text-[9px] font-black uppercase tracking-widest">{n.time}</span>
                                                            </div>
                                                            {!n.read && (
                                                                <button className="text-[9px] font-black uppercase tracking-widest text-[hsl(var(--gold))] hover:underline">Mark Read</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white">
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                            <Bell className="h-16 w-16 text-white/5 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-white/20 uppercase tracking-widest">Priority Stream Empty</h3>
                            <p className="text-white/10 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">All system protocols are synchronized</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--gold))]/20 to-transparent p-1 rounded-[3rem]">
                <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-[2rem] bg-[hsl(var(--gold))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/20">
                            <Settings className="h-10 w-10 text-[hsl(var(--gold))]" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Protocol Preferences</h4>
                            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1">Configure how you receive critical health data nodes</p>
                        </div>
                    </div>
                    <Button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        Alert Settings <ChevronRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
