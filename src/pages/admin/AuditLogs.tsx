import { useState, useEffect } from "react";
import { Shield, Search, User, Activity, Clock, Terminal, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import { format } from "date-fns";

interface AuditLog {
    id: string;
    user_id: string;
    user_name: string;
    user_role: string;
    action: string;
    target_type: string;
    target_id: string;
    details: any;
    ip_address: string;
    created_at: string;
}

export default function AuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [actionFilter, setActionFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/audit_logs.php`);
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs);
            } else {
                toast.error(data.message || "Failed to fetch logs");
            }
        } catch (error) {
            toast.error("Error connecting to audit service");
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.user_name?.toLowerCase().includes(search.toLowerCase()) ||
            log.action?.toLowerCase().includes(search.toLowerCase()) ||
            log.target_type?.toLowerCase().includes(search.toLowerCase());

        const matchesRole = roleFilter === "all" || log.user_role?.toLowerCase() === roleFilter.toLowerCase();
        const matchesAction = actionFilter === "all" || log.action?.includes(actionFilter);

        const matchesDate = () => {
            if (dateFilter === "all") return true;
            const logDate = new Date(log.created_at);
            const today = new Date();
            if (dateFilter === "today") return logDate.toDateString() === today.toDateString();
            if (dateFilter === "week") return (today.getTime() - logDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
            return true;
        };

        return matchesSearch && matchesRole && matchesAction && matchesDate();
    });

    const getActionColor = (action: string) => {
        if (action.includes("CREATE")) return "text-emerald-500 bg-emerald-500/10";
        if (action.includes("DELETE")) return "text-rose-500 bg-rose-500/10";
        if (action.includes("UPDATE")) return "text-amber-500 bg-amber-500/10";
        return "text-indigo-500 bg-indigo-500/10";
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Shield className="h-8 w-8 text-indigo-500" />
                        System Audit Logs
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium italic">Tracking medical data access & administrative actions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={fetchLogs} className="border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white">
                        Refresh Logs
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 shadow-2xl backdrop-blur-xl">
                <CardHeader className="border-b border-slate-800/50 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-indigo-400" />
                            Activity Stream
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                className="h-10 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="doctor">Doctors</option>
                                <option value="patient">Patients</option>
                            </select>
                            <select
                                className="h-10 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                            >
                                <option value="all">Actions</option>
                                <option value="LOGIN">Logins</option>
                                <option value="CREATE">Creation</option>
                                <option value="UPDATE">Updates</option>
                                <option value="DELETE">Deletions</option>
                            </select>
                            <select
                                className="h-10 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="all">Any Time</option>
                                <option value="today">Today</option>
                                <option value="week">Past Week</option>
                            </select>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search by user or action..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-11 bg-slate-950 border-slate-800 text-white rounded-xl focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px] pl-6">Timestamp</TableHead>
                                    <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Security Actor</TableHead>
                                    <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Action Performed</TableHead>
                                    <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Target Resource</TableHead>
                                    <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Origin IP</TableHead>
                                    <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px] pr-6 text-right">Context</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-slate-800 h-16 animate-pulse">
                                            <TableCell colSpan={6}><div className="h-4 bg-slate-800 rounded w-full"></div></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-slate-500 italic">No audit records found matching your filters.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="border-slate-800 hover:bg-white/5 transition-colors group">
                                            <TableCell className="pl-6 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm tracking-tight">{format(new Date(log.created_at), "MMM d, HH:mm:ss")}</span>
                                                    <span className="text-slate-500 text-[10px]">{format(new Date(log.created_at), "yyyy")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-slate-300" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold text-sm">{log.user_name || "System/Guest"}</span>
                                                        <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{log.user_role}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    getActionColor(log.action)
                                                )}>
                                                    {log.action.replace(/_/g, " ")}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs font-medium">{log.target_type || "General"}</span>
                                                    {log.target_id && <span className="text-slate-500 text-[10px]">ID: {log.target_id}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-400 font-mono text-xs">{log.ip_address}</span>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {log.details && Object.entries(log.details).slice(0, 2).map(([k, v]: [string, any]) => (
                                                        <span key={k} className="text-[9px] text-slate-500">
                                                            <strong className="text-slate-400 uppercase tracking-tighter mr-1">{k}:</strong> {String(v)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
