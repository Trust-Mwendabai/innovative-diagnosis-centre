import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, CheckCircle2, Clock, FileText, Calendar, Trash2,
    MailOpen, Globe, Stethoscope, User, Users, AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

type Category = "all" | "general" | "role_based" | "individual";


const CATEGORIES: { key: Category; label: string; icon: any; color: string; bg: string; border: string; glow: string; desc: string }[] = [
    {
        key: "all", label: "All", icon: Bell,
        color: "text-white", bg: "bg-[hsl(var(--gold))]/20", border: "border-[hsl(var(--gold))]/40",
        glow: "bg-white/5 border-white/10", desc: ""
    },
    {
        key: "general", label: "General", icon: Globe,
        color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
        glow: "bg-emerald-500/5 border-emerald-500/10", desc: "Announcements for everyone"
    },
    {
        key: "role_based", label: "Patient Info", icon: Users,
        color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20",
        glow: "bg-sky-500/5 border-sky-500/10", desc: "Sent to all patients"
    },
    {
        key: "individual", label: "Personal", icon: User,
        color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20",
        glow: "bg-violet-500/5 border-violet-500/10", desc: "Sent directly to you"
    },
];

const TYPE_ICONS: Record<string, any> = {
    result: FileText,
    appointment: Calendar,
    billing: CheckCircle2,
    alert: AlertCircle,
};

export default function PatientNotifications() {
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const [readIds, setReadIds] = useState<Set<number>>(new Set());
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = user?.id || "";
                const res = await fetch(`${API_BASE_URL}/notifications/read.php?user_id=${userId}&role=patient`);
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications || []);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user?.id]);

    const markAllRead = () => {
        setReadIds(new Set(notifications.map(n => n.id)));
    };

    const markRead = (id: number) => {
        setReadIds(prev => new Set([...prev, id]));
    };

    const filtered = activeCategory === "all"
        ? notifications
        : notifications.filter(n => (n.category || "general") === activeCategory);

    const unreadCount = (cat: Category) => {
        const pool = cat === "all" ? notifications : notifications.filter(n => (n.category || "general") === cat);
        return pool.filter(n => !readIds.has(n.id) && n.status !== "read").length;
    };

    const totalUnread = unreadCount("all");

    return (
        <div className="space-y-8 pb-20 animate-fade-in text-white pt-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-heading tracking-tight">
                        My <span className="text-[hsl(var(--gold))]">Notifications</span>
                    </h1>
                    <p className="text-white/40 mt-1 text-sm font-medium">
                        Stay up to date with your latest announcements and updates.
                    </p>
                    {totalUnread > 0 && (
                        <p className="text-xs font-bold text-[hsl(var(--gold))]/80 mt-1">
                            {totalUnread} unread notification{totalUnread > 1 ? "s" : ""}
                        </p>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={markAllRead}
                    className="h-11 px-6 rounded-2xl border-white/10 bg-white/5 text-xs font-bold hover:bg-white/10 shrink-0"
                >
                    <MailOpen className="mr-2 h-4 w-4" />
                    Mark All as Read
                </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const count = unreadCount(cat.key);
                    const isActive = activeCategory === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={cn(
                                "group flex items-center gap-2.5 px-5 h-11 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-300",
                                isActive
                                    ? `${cat.bg} ${cat.border} ${cat.color}`
                                    : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-white/60"
                            )}
                        >
                            <Icon className={cn("h-3.5 w-3.5", isActive ? cat.color : "")} />
                            {cat.label}
                            {count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[9px] font-black",
                                    isActive ? `${cat.bg} ${cat.color} border ${cat.border}` : "bg-white/10 text-white/40"
                                )}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Category Description */}
            {activeCategory !== "all" && CATEGORIES.find(c => c.key === activeCategory)?.desc && (
                <p className={cn("text-xs font-bold -mt-2", CATEGORIES.find(c => c.key === activeCategory)?.color, "opacity-60")}>
                    {CATEGORIES.find(c => c.key === activeCategory)?.desc}
                </p>
            )}

            {/* Notification List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-8 h-8 border-2 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/30 text-sm">Loading notifications...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        filtered.map((n, i) => {
                            const cat = CATEGORIES.find(c => c.key === (n.category || "general")) ?? CATEGORIES[1];
                            const CatIcon = cat.icon;
                            const TypeIcon = TYPE_ICONS[n.type] ?? Bell;
                            const isRead = readIds.has(n.id) || n.status === "read";

                            return (
                                <motion.div
                                    key={n.id ?? i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => markRead(n.id)}
                                    className="cursor-pointer"
                                >
                                    <Card className={cn(
                                        "border transition-all group overflow-hidden relative",
                                        !isRead
                                            ? `${cat.glow} ${cat.border} border-l-4 border-l-[${cat.color}]`
                                            : "bg-white/5 border-white/5"
                                    )}>
                                        {!isRead && (
                                            <div className={cn("absolute top-0 left-0 w-1 h-full", cat.bg)} />
                                        )}
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-xl flex items-center justify-center border transition-all shrink-0",
                                                        !isRead ? `${cat.bg} ${cat.border}` : "bg-white/5 border-white/10"
                                                    )}>
                                                        <TypeIcon className={cn("h-5 w-5", !isRead ? cat.color : "text-white/30")} />
                                                    </div>

                                                    <div className="space-y-1 min-w-0">
                                                        {/* Badges row */}
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className={cn(
                                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl border text-[9px] font-black uppercase tracking-widest",
                                                                cat.bg, cat.border, cat.color
                                                            )}>
                                                                <CatIcon className="h-2.5 w-2.5" />
                                                                {cat.label}
                                                            </span>
                                                            {!isRead && (
                                                                <span className="bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[hsl(var(--gold))]/20">
                                                                    New
                                                                </span>
                                                            )}
                                                            {n.sent_by_name && (
                                                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                                                    From {n.sent_by_name}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Title */}
                                                        <h4 className={cn(
                                                            "text-base font-bold",
                                                            !isRead ? "text-white" : "text-white/50"
                                                        )}>
                                                            {n.title || "Notification"}
                                                        </h4>

                                                        {/* Message */}
                                                        <p className={cn(
                                                            "text-sm leading-relaxed max-w-2xl",
                                                            !isRead ? "text-white/70" : "text-white/30"
                                                        )}>
                                                            {n.message}
                                                        </p>

                                                        {/* Time */}
                                                        <div className="flex items-center gap-2 pt-1 text-white/20">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="text-xs">
                                                                {n.sent_at ? new Date(n.sent_at).toLocaleString() : "Recent"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions (hover) */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    {!isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                                                            onClick={e => { e.stopPropagation(); markRead(n.id); }}
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
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
                            <p className="text-white/10 text-sm mt-1">
                                {activeCategory === "all"
                                    ? "You're all caught up! Check back later for updates."
                                    : `No ${CATEGORIES.find(c => c.key === activeCategory)?.label.toLowerCase()} notifications yet.`}
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
