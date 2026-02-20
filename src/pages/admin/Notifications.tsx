import { useState, useEffect } from "react";
import {
    Bell,
    Send,
    Search,
    Filter,
    CheckCircle2,
    History,
    Layout,
    Users,
    Type,
    Trash2,
    Edit,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

interface Notification {
    id: string;
    patient_id: string;
    patient_name: string;
    title: string;
    type: string;
    recipient: string; // This usually maps to recipient_group in DB
    recipient_group: string;
    message: string;
    status: string;
    sent_at: string;
}

export default function Notifications() {
    const [logs, setLogs] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const [broadcastForm, setBroadcastForm] = useState({
        subject: "",
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
            if (data.success) {
                // Ensure we map recipient_group securely if needed, 
                // though read.php returns raw DB columns usually.
                setLogs(data.notifications);
            }
        } catch (error) {
            toast.error("Error fetching logs");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!broadcastForm.message || !broadcastForm.subject) {
            toast.error("Subject and Message are required");
            return;
        }

        const isEdit = !!editingId;
        const endpoint = isEdit ? 'update.php' : 'create.php';
        const method = "POST";
        const actionText = isEdit ? "Updating..." : "Sending announcement...";

        toast.info(actionText);

        try {
            const payload: any = {
                recipient_group: broadcastForm.recipient_group,
                title: broadcastForm.subject,
                message: broadcastForm.message,
                type: "system"
            };

            if (isEdit) {
                payload.id = editingId;
            }

            const res = await fetch(`${API_BASE_URL}/notifications/${endpoint}`, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(isEdit ? "Announcement updated" : "Announcement sent successfully");
                setBroadcastForm({ recipient_group: "all_patients", message: "", subject: "" });
                setEditingId(null);
                fetchLogs();
            } else {
                toast.error(data.message || "Failed to process request");
            }
        } catch (error) {
            console.error("Broadcast failed:", error);
            toast.error("Connection error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/notifications/delete.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Announcement deleted");
                fetchLogs();
                // If we were editing this one, cancel edit
                if (editingId === id) cancelEdit();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Connection error");
        }
    };

    const handleEdit = (log: Notification) => {
        setEditingId(log.id);
        setBroadcastForm({
            subject: log.title || "",
            message: log.message || "",
            recipient_group: log.recipient_group || "all_patients"
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setBroadcastForm({
            subject: "",
            message: "",
            recipient_group: "all_patients"
        });
    };

    const filteredLogs = logs.filter(l =>
        (l.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (l.title?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (l.message?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (l.recipient_group?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Announcements</h1>
                    <p className="text-slate-400 font-medium">Send important updates to patients, doctors, or staff.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="p-8 pb-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <History className="h-5 w-5 text-emerald-400" /> History
                                </CardTitle>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                        <Input
                                            placeholder="Search history..."
                                            className="h-10 pl-10 w-64 bg-black/20 border-white/10 text-white placeholder:text-slate-600 rounded-xl text-xs focus:bg-black/40 transition-all"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="p-20 flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-slate-500">Loading...</p>
                                    </div>
                                ) : filteredLogs.length === 0 ? (
                                    <div className="p-20 text-center text-slate-500">
                                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-sm font-bold">No announcements sent yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {filteredLogs.map((log) => (
                                            <div key={log.id} className={cn("p-6 hover:bg-white/5 transition-colors group", editingId === log.id && "bg-emerald-500/5")}>
                                                <div className="flex gap-4">
                                                    <div className="p-3 rounded-2xl shrink-0 h-fit bg-emerald-500/10 text-emerald-400">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm">
                                                                    {log.recipient_group || 'Everyone'}
                                                                </h4>
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                    {new Date(log.sent_at).toLocaleDateString()} at {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(log)}
                                                                    className="h-8 w-8 p-0 rounded-full hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(log.id)}
                                                                    className="h-8 w-8 p-0 rounded-full hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                                                            {log.title && (
                                                                <h5 className="text-emerald-400 font-bold text-xs uppercase tracking-wide border-b border-white/5 pb-2 mb-2">
                                                                    {log.title}
                                                                </h5>
                                                            )}
                                                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                                {log.message}
                                                            </p>
                                                        </div>
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

                <div className="space-y-8 order-1 lg:order-2">
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl p-8 rounded-[2.5rem] sticky top-8">
                        <CardHeader className="px-0 pt-0 pb-6 border-b border-white/5 mb-6">
                            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                {editingId ? (
                                    <>
                                        <Edit className="h-5 w-5 text-emerald-400" /> Edit Announcement
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 text-emerald-400" /> New Announcement
                                    </>
                                )}
                            </CardTitle>
                            <p className="text-xs text-slate-400 font-medium">
                                {editingId ? "Update the details of the selected announcement." : "Draft a message to send to users."}
                            </p>
                        </CardHeader>
                        <form onSubmit={handleSend} className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Send To</Label>
                                <div className="relative">
                                    <select
                                        className="w-full h-14 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-colors"
                                        value={broadcastForm.recipient_group}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, recipient_group: e.target.value })}
                                    >
                                        <option value="all_patients" className="bg-slate-900 text-white">All Patients</option>
                                        <option value="all_doctors" className="bg-slate-900 text-white">All Doctors</option>
                                        <option value="all_staff" className="bg-slate-900 text-white">All Staff</option>
                                        <option value="everyone" className="bg-slate-900 text-white">Everyone</option>
                                    </select>
                                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subject</Label>
                                <div className="relative">
                                    <Input
                                        required
                                        placeholder="e.g. System Maintenance"
                                        className="h-14 pl-12 rounded-2xl border border-white/10 bg-black/40 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                                        value={broadcastForm.subject}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                                    />
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Message</Label>
                                <textarea
                                    required
                                    placeholder="Type your announcement here..."
                                    className="w-full min-h-[180px] rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-medium text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                                    value={broadcastForm.message}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 text-md font-bold gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editingId ? <Edit className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                                    {editingId ? "Update Announcement" : "Send Announcement"}
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={cancelEdit}
                                        className="w-full h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
