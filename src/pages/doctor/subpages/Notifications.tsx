import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Bell, Clock, Globe, Users, User, Stethoscope,
    AlertCircle, CheckCircle2
} from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

type Category = "all" | "general" | "role_based" | "individual";

const CATEGORIES: { key: Category; label: string; icon: any; color: string; glow: string; desc: string }[] = [
    { key: "all", label: "All", icon: Bell, color: "text-white", glow: "bg-white/10 border-white/10", desc: "" },
    { key: "general", label: "General", icon: Globe, color: "text-emerald-400", glow: "bg-emerald-500/10 border-emerald-500/20", desc: "Broadcast to everyone" },
    { key: "role_based", label: "Doctors", icon: Stethoscope, color: "text-cyan-400", glow: "bg-cyan-500/10 border-cyan-500/20", desc: "Sent to all doctors" },
    { key: "individual", label: "Personal", icon: User, color: "text-violet-400", glow: "bg-violet-500/10 border-violet-500/20", desc: "Sent directly to you" },
];

function getCategoryMeta(category: string) {
    return CATEGORIES.find(c => c.key === category) ?? CATEGORIES[0];
}

function getTypeIcon(type: string) {
    switch (type) {
        case "appointment": return CheckCircle2;
        case "result": return AlertCircle;
        default: return Bell;
    }
}

export default function DoctorNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<Category>("all");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/notifications/read.php?user_id=${user?.id}&role=doctor`);
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

    const filtered = activeCategory === "all"
        ? notifications
        : notifications.filter(n => (n.category || "general") === activeCategory);

    const countFor = (cat: Category) =>
        cat === "all"
            ? notifications.length
            : notifications.filter(n => (n.category || "general") === cat).length;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">Recent Alerts</h1>
                <p className="text-white/50 font-medium mt-1">Stay updated with important case alerts and medical news.</p>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const count = countFor(cat.key);
                    const isActive = activeCategory === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={cn(
                                "group flex items-center gap-2.5 px-5 h-11 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-300",
                                isActive
                                    ? `${cat.glow} ${cat.color} shadow-lg`
                                    : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white/60"
                            )}
                        >
                            <Icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? cat.color : "")} />
                            {cat.label}
                            {count > 0 && (
                                <span className={cn(
                                    "ml-1 px-2 py-0.5 rounded-full text-[9px] font-black border",
                                    isActive ? `${cat.glow} ${cat.color}` : "bg-white/5 border-white/10 text-white/30"
                                )}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notification List */}
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8 border-b border-white/5 bg-slate-800/20">
                    <CardTitle className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Bell className="h-4 w-4 text-cyan-500" />
                        {CATEGORIES.find(c => c.key === activeCategory)?.label} Notifications
                        {activeCategory !== "all" && CATEGORIES.find(c => c.key === activeCategory)?.desc && (
                            <span className="text-white/20 font-medium normal-case text-[10px] ml-1">
                                — {CATEGORIES.find(c => c.key === activeCategory)?.desc}
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Hydrating Clinical Feed...</p>
                            </div>
                        ) : filtered.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {filtered.map((n, i) => {
                                    const cat = getCategoryMeta(n.category || "general");
                                    const CatIcon = cat.icon;
                                    const TypeIcon = getTypeIcon(n.type);
                                    return (
                                        <motion.div
                                            key={n.id || i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.97 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="p-8 hover:bg-white/5 transition-all duration-300 flex items-start gap-6 group"
                                        >
                                            {/* Icon */}
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0",
                                                cat.glow
                                            )}>
                                                <TypeIcon className={cn("h-5 w-5", cat.color)} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                    {/* Category Badge */}
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[9px] font-black uppercase tracking-widest",
                                                        cat.glow, cat.color
                                                    )}>
                                                        <CatIcon className="h-2.5 w-2.5" />
                                                        {cat.label}
                                                    </span>
                                                    {/* Sent by */}
                                                    {n.sent_by_name && (
                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1">
                                                            <Users className="h-2.5 w-2.5" /> from {n.sent_by_name}
                                                        </span>
                                                    )}
                                                </div>
                                                {n.title && (
                                                    <p className="font-black text-white/90 text-base tracking-tight mb-1">{n.title}</p>
                                                )}
                                                <p className="text-white/60 font-medium text-sm leading-relaxed">{n.message}</p>
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2 mt-3">
                                                    <Clock className="h-3 w-3" />
                                                    {n.sent_at ? new Date(n.sent_at).toLocaleString() : "Recent"}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <Bell className="h-10 w-10 text-white/10" />
                                </div>
                                <h3 className="text-white font-black text-xl italic mb-2 tracking-tight">Zero Alerts</h3>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                    {activeCategory === "all" ? "Your clinical feed is currently clear." : `No ${CATEGORIES.find(c => c.key === activeCategory)?.label.toLowerCase()} notifications.`}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
