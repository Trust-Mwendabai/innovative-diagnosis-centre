import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Search, Filter } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function DoctorNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic">Recent Alerts</h1>
                <p className="text-white/60 font-bold mt-1">Stay updated with important case alerts and medical news.</p>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight">Latest Notifications</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Hydrating Clinical Feed...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((n, i) => (
                                <div key={n.id || i} className="p-8 hover:bg-white/5 transition-all duration-300 flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-glow-cyan/10 shrink-0">
                                        <Bell className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="h-3 w-3" /> {n.sent_at ? new Date(n.sent_at).toLocaleString() : 'Recent'}
                                            </span>
                                        </div>
                                        <p className="text-white/80 font-bold text-lg leading-tight tracking-tight mb-1">{n.message}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                            <span className="text-[9px] font-black text-cyan-500/60 uppercase tracking-widest">Protocol Update</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <Bell className="h-10 w-10 text-white/10" />
                                </div>
                                <h3 className="text-white font-black text-xl italic mb-2 tracking-tight">Zero Alerts</h3>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Your clinical feed is currently clear.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
