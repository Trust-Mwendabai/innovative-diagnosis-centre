import { useState, useEffect } from "react";
import {
    Bell,
    Send,
    Search,
    Filter,
    MessageSquare,
    Smartphone,
    Mail,
    Clock,
    CheckCircle2,
    Users,
    ChevronRight,
    MoreVertical,
    AlertCircle,
    FileText,
    History,
    Layout
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

interface Notification {
    id: string;
    patient_id: string;
    patient_name: string;
    type: 'SMS' | 'Email';
    recipient: string;
    message: string;
    status: string;
    sent_at: string;
}

export default function Notifications() {
    const [logs, setLogs] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [broadcastForm, setBroadcastForm] = useState({
        type: "SMS",
        message: "",
        recipient_group: "all_patients"
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/notifications/read.php`);
            const data = await res.json();
            if (data.success) setLogs(data.notifications);
        } catch (error) {
            toast.error("Error fetching notification logs");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!broadcastForm.message) return;

        toast.info("Preparing broadcast...");

        // In a real app we'd trigger a bulk job. Mocking for now.
        setTimeout(() => {
            toast.success("Broadcast dispatched successfully");
            setBroadcastForm({ ...broadcastForm, message: "" });
            fetchLogs();
        }, 1500);
    };

    const filteredLogs = logs.filter(l =>
        l.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications Hub</h1>
                    <p className="text-muted-foreground font-medium">Manage automated alerts and manual patient communications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass h-12 px-6 rounded-2xl border-white/20">
                        <Layout className="mr-2 h-4 w-4" /> Templates
                    </Button>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Gateway: Ready</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-light border-white/20 shadow-premium overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" /> Transmission History
                                </CardTitle>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search logs..."
                                            className="h-10 pl-10 w-64 glass-input rounded-xl text-xs"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl"><Filter className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[600px] overflow-y-auto">
                                {loading ? (
                                    <div className="p-20 flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-slate-400">Syncing logs...</p>
                                    </div>
                                ) : filteredLogs.length === 0 ? (
                                    <div className="p-20 text-center text-slate-400">
                                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        <p className="text-sm font-bold">No records found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {filteredLogs.map((log) => (
                                            <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                                                <div className="flex gap-4">
                                                    <div className={cn(
                                                        "p-3 rounded-2xl shrink-0 h-fit",
                                                        log.type === 'SMS' ? "bg-blue-50 text-blue-500" : "bg-purple-50 text-purple-500"
                                                    )}>
                                                        {log.type === 'SMS' ? <Smartphone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-black text-slate-900 text-sm">
                                                                    {log.patient_name || 'System Broadcast'}
                                                                </h4>
                                                                <p className="text-[10px] font-bold text-slate-400">{log.recipient}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                                    <CheckCircle2 className="h-2.5 w-2.5" /> Sent
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-300">
                                                                    {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white/40 p-3 rounded-xl border border-slate-50">
                                                            {log.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem]">
                        <CardHeader className="px-0 pt-0 pb-6">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Send className="h-5 w-5 text-primary" /> New Broadcast
                            </CardTitle>
                            <p className="text-xs text-muted-foreground font-medium">Send bulk messages to patient groups.</p>
                        </CardHeader>
                        <form onSubmit={handleSend} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recipient Group</Label>
                                <select
                                    className="w-full h-12 rounded-2xl border border-slate-100 bg-white/50 px-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none"
                                    value={broadcastForm.recipient_group}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, recipient_group: e.target.value })}
                                >
                                    <option value="all_patients">All Registered Patients</option>
                                    <option value="pending_appointments">Pending Appointments</option>
                                    <option value="completed_today">Today's Completed Cases</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Channel Type</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setBroadcastForm({ ...broadcastForm, type: 'SMS' })}
                                        className={cn(
                                            "flex items-center justify-center gap-2 h-12 rounded-2xl font-bold transition-all border",
                                            broadcastForm.type === 'SMS'
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <Smartphone className="h-4 w-4" /> SMS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBroadcastForm({ ...broadcastForm, type: 'Email' })}
                                        className={cn(
                                            "flex items-center justify-center gap-2 h-12 rounded-2xl font-bold transition-all border",
                                            broadcastForm.type === 'Email'
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <Mail className="h-4 w-4" /> Email
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Message Content</Label>
                                <textarea
                                    required
                                    placeholder="Type your message here..."
                                    className="w-full min-h-[150px] rounded-2xl border border-slate-100 bg-white/50 p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                                    value={broadcastForm.message}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                                />
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-slate-400">Total: {broadcastForm.message.length} chars</span>
                                    <span className="text-[10px] font-bold text-primary">1 SMS Segment</span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full py-7 rounded-2xl gradient-primary shadow-xl shadow-primary/20 text-lg font-black gap-3">
                                <Send className="h-5 w-5" /> Dispatch Pulse
                            </Button>
                        </form>
                    </Card>

                    <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex gap-4">
                        <div className="p-3 rounded-2xl bg-white text-amber-500 shrink-0 h-fit shadow-sm">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h5 className="text-sm font-black text-slate-900 mb-1">Quota Warning</h5>
                            <p className="text-xs font-medium text-slate-500">You have used 85% of your SMS credits for this month. 12,400 remaining.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
