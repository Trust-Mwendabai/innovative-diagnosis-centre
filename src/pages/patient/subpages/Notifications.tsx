import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    CheckCircle2,
    Clock,
    FileText,
    Calendar,
    Trash2,
    MailOpen,
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
            try {
                const userId = user?.id || '';
                const res = await fetch(`${API_BASE_URL}/notifications/read.php?user_id=${userId}&role=patient`);
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications.map((n: any) => ({
                        id: n.id,
                        type: n.type || 'alert',
                        title: n.title || 'Notification',
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

    const getIcon = (type: string) => {
        switch (type) {
            case 'result': return FileText;
            case 'appointment': return Calendar;
            case 'billing': return CheckCircle2;
            default: return Bell;
        }
    };

    return (
        <div className="space-y-8 pb-20 animate-fade-in text-white pt-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-heading tracking-tight">
                        My <span className="text-[hsl(var(--gold))]">Notifications</span>
                    </h1>
                    <p className="text-white/40 mt-1 text-sm font-medium">Stay up to date with your latest announcements and updates.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={markAllRead}
                    className="h-12 px-6 rounded-2xl border-white/10 bg-white/5 text-xs font-bold hover:bg-white/10"
                >
                    <MailOpen className="mr-2 h-4 w-4" />
                    Mark All as Read
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3">
                {['all', 'unread', 'read'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-6 h-10 rounded-xl text-xs font-bold capitalize transition-all",
                            filter === f
                                ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-8 h-8 border-2 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/30 text-sm">Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
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
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-xl flex items-center justify-center border transition-all shrink-0",
                                                        !n.read ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold" : "bg-white/5 text-white/40 border-white/10"
                                                    )}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className={cn("text-base font-bold", !n.read ? "text-white" : "text-white/60")}>
                                                                {n.title}
                                                            </h4>
                                                            {!n.read && (
                                                                <span className="bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
                                                            )}
                                                        </div>
                                                        <p className={cn("text-sm leading-relaxed max-w-2xl", !n.read ? "text-white/70" : "text-white/30")}>
                                                            {n.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 pt-1 text-white/20">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="text-xs">{n.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
                            <Bell className="h-14 w-14 text-white/10 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white/20">No Notifications</h3>
                            <p className="text-white/10 text-sm mt-1">You're all caught up! Check back later for updates.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
