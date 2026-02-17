import { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Shield,
    Database,
    Save,
    RefreshCw,
    Lock,
    Users,
    Globe,
    Bell,
    Smartphone,
    CheckCircle2,
    AlertTriangle,
    Download,
    Key,
    Eye,
    LogOut,
    Mail,
    Plus,
    Trash2,
    Edit3,
    Building2,
    Phone,
    MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'technician' | 'billing';
    phone: string;
    branch_id: string;
    branch_name?: string;
}

export default function Settings() {
    const [settings, setSettings] = useState<any>({
        clinic_name: "International Diagnostic Centre",
        support_email: "support@idc.co.zm",
        sms_gateway: "Twilio",
        maintenance_mode: false,
        backup_frequency: "Daily"
    });
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [backingUp, setBackingUp] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: "",
        email: "",
        role: "staff" as any,
        phone: "",
        branch_id: ""
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [settingsRes, staffRes, branchesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/settings/read.php`),
                fetch(`${API_BASE_URL}/staff/read.php`),
                fetch(`${API_BASE_URL}/branches/read.php`)
            ]);

            const settingsData = await settingsRes.json();
            const staffData = await staffRes.json();
            const branchesData = await branchesRes.json();

            if (settingsData.success) setSettings(settingsData.settings);
            if (staffData.success) setStaff(staffData.staff);
            if (branchesData.success) setBranches(branchesData.branches);
        } catch (error) {
            toast.error("Error loading system configuration");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch("http://localhost/IDC/api/settings/update.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("System configuration updated successfully");
            } else {
                toast.error(data.message || "Failed to update settings");
            }
        } catch (error) {
            toast.error("Communication failure with persistence layer");
        } finally {
            setSaving(false);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost/IDC/api/staff/create.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStaff)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Intelligence Personnel Enlisted");
                setIsStaffModalOpen(false);
                setNewStaff({ name: "", email: "", role: "staff", phone: "", branch_id: "" });
                fetchInitialData();
            } else {
                toast.error(data.message || "Enlistment failed");
            }
        } catch (error) {
            toast.error("Persistence error");
        }
    };

    const handleDeleteStaff = async (id: string) => {
        if (!confirm("Decommission this personnel record?")) return;
        try {
            const res = await fetch("http://localhost/IDC/api/staff/delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Record Decommissioned");
                fetchInitialData();
            }
        } catch (error) {
            toast.error("Failed to remove personnel");
        }
    };

    const handleBackup = async () => {
        setBackingUp(true);
        try {
            const res = await fetch("http://localhost/IDC/api/settings/backup.php");
            const data = await res.json();
            if (data.success) {
                toast.success(`Encrypted Snapshot Created: ${data.filename}`);
            }
        } catch (error) {
            toast.error("Backup snapshot failed");
        } finally {
            setBackingUp(false);
        }
    };

    if (loading) return (
        <div className="p-40 text-center space-y-4">
            <RefreshCw className="h-10 w-10 text-primary animate-spin mx-auto opacity-20" />
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-300">Synchronizing System Protocols...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest mb-4">
                        <SettingsIcon className="h-3 w-3" /> Core Configuration
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic">
                        Control <span className="text-primary underline decoration-primary/20 underline-offset-8">Terminal</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Manage global identity, access nodes, and system integrity.</p>
                </div>
                <Button
                    className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all gap-3 group"
                    onClick={handleSaveSettings}
                    disabled={saving}
                >
                    <Save className={cn("h-4 w-4 transition-transform group-hover:scale-110", saving && "animate-spin")} />
                    {saving ? "Commiting..." : "Commit All Changes"}
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-10">
                <TabsList className="bg-slate-100/50 p-2 rounded-2xl border border-slate-200 gap-2 h-auto">
                    <TabsTrigger value="general" className="rounded-xl font-black uppercase tracking-widest text-[9px] py-3.5 px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all">
                        <SettingsIcon className="h-3.5 w-3.5 mr-2" /> Identity & General
                    </TabsTrigger>
                    <TabsTrigger value="staff" className="rounded-xl font-black uppercase tracking-widest text-[9px] py-3.5 px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all">
                        <Users className="h-3.5 w-3.5 mr-2" /> Personnel Nodes
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl font-black uppercase tracking-widest text-[9px] py-3.5 px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all">
                        <Shield className="h-3.5 w-3.5 mr-2" /> RBAC Security
                    </TabsTrigger>
                    <TabsTrigger value="maintenance" className="rounded-xl font-black uppercase tracking-widest text-[9px] py-3.5 px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all">
                        <Database className="h-3.5 w-3.5 mr-2" /> Maintenance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-10 animate-fade-in-up">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[3rem]">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8">
                                <CardTitle className="text-2xl font-black text-slate-900 italic">Clinic Identity</CardTitle>
                                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">Global metadata used for reports and patient communications.</CardDescription>
                            </CardHeader>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinic Primary Label</Label>
                                    <Input
                                        value={settings.clinic_name}
                                        onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                                        className="h-16 text-xl font-black italic border-slate-100 focus:border-primary/30 rounded-2xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Persistence Support Node (Email)</Label>
                                    <Input
                                        value={settings.support_email}
                                        onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                                        className="h-16 font-bold border-slate-100 focus:border-primary/30 rounded-2xl"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Language</Label>
                                        <select className="w-full h-16 rounded-2xl border border-slate-100 bg-white px-6 text-sm font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5">
                                            <option>English (UK)</option>
                                            <option>English (US)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Temporal Zone</Label>
                                        <select className="w-full h-16 rounded-2xl border border-slate-100 bg-white px-6 text-sm font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5">
                                            <option>Central African Time (CAT)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[3rem]">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8">
                                <CardTitle className="text-2xl font-black text-slate-900 italic">Communication nodes</CardTitle>
                                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">Management of SMS and SMTP encrypted channels.</CardDescription>
                            </CardHeader>
                            <div className="space-y-6">
                                {[
                                    { icon: Smartphone, label: "SMS Node (Twilio)", status: "Operational", color: "blue" },
                                    { icon: Mail, label: "Email Node (SMTP)", status: "Active Pulse", color: "purple" }
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={cn("p-4 rounded-2xl shadow-xl transition-transform group-hover:scale-110", `bg-${node.color}-500 text-white`)}>
                                                <node.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 italic">{node.label}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Link Status: {node.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-white">Configure Node</Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="staff" className="space-y-10 animate-fade-in-up">
                    <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[3rem]">
                        <CardHeader className="px-0 pt-0 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 mb-10">
                            <div>
                                <CardTitle className="text-3xl font-black text-slate-900 italic">Personnel Intelligence Nodes</CardTitle>
                                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-2">Manage encrypted access levels for medical and administrative staff.</CardDescription>
                            </div>
                            <Button
                                onClick={() => setIsStaffModalOpen(true)}
                                className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[9px] shadow-xl hover:scale-105 transition-all gap-3"
                            >
                                <Plus className="h-4 w-4" /> Enlist Personnel
                            </Button>
                        </CardHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {staff.map((member) => (
                                <motion.div
                                    layout
                                    key={member.id}
                                    className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 rounded-full hover:bg-slate-100"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="p-2 rounded-2xl shadow-2xl border-slate-100 min-w-[160px]">
                                                <DropdownMenuItem className="rounded-xl font-black text-[9px] uppercase py-3 gap-3"><Edit3 className="h-4 w-4 text-primary" /> Modify Node</DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem
                                                    className="rounded-xl font-black text-[9px] uppercase py-3 gap-3 text-rose-600 focus:text-rose-600"
                                                    onClick={() => handleDeleteStaff(member.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Decommission
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-black text-slate-400 italic shadow-inner">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-black text-slate-900 italic leading-none mb-2">{member.name}</h5>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                member.role === 'admin' ? "bg-rose-50 text-rose-500" :
                                                    member.role === 'technician' ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-500"
                                            )}>
                                                {member.role} node
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                                            <Mail className="h-4 w-4" />
                                            <span className="text-xs font-bold truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                                            <Building2 className="h-4 w-4" />
                                            <span className="text-xs font-bold">{member.branch_name || 'Global Node'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-10 animate-fade-in-up">
                    <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[3rem]">
                        <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-10">
                            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-4 italic">
                                <Shield className="h-8 w-8 text-primary" /> Role-Based Access Control (RBAC)
                            </CardTitle>
                            <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-2">Configuration of global security protocols and role permission matrices.</CardDescription>
                        </CardHeader>

                        <div className="space-y-8">
                            <div className="p-10 rounded-[2.5rem] bg-slate-950 text-white flex items-center justify-between shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-none" />
                                <div className="flex items-center gap-8 relative z-10">
                                    <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-glow-gold">
                                        <Lock className="h-10 w-10 text-primary animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black italic">Two-Factor Authentication (2FA)</p>
                                        <p className="text-sm text-slate-400 font-medium max-w-md mt-1">Enforce biometric or secondary mobile verification for all personnel enlisting in the admin sector.</p>
                                    </div>
                                </div>
                                <Switch className="scale-150 data-[state=checked]:bg-primary relative z-10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="p-8 rounded-[2.5rem] bg-slate-50 border-slate-100 border-2 border-dashed">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Key className="h-6 w-6 text-slate-400" /></div>
                                        <h4 className="font-black text-slate-900 italic text-xl">API Keys</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">Manage authentication tokens for third-party integrations and internal automation services.</p>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[9px] uppercase tracking-widest border-slate-200">Rotate Primary Keys</Button>
                                </Card>
                                <Card className="p-8 rounded-[2.5rem] bg-slate-50 border-slate-100 border-2 border-dashed">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Eye className="h-6 w-6 text-slate-400" /></div>
                                        <h4 className="font-black text-slate-900 italic text-xl">Global Audit Log</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">Monitor real-time system interactions and administrative modifications for internal auditing.</p>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[9px] uppercase tracking-widest border-slate-200">Initialize Audit Report</Button>
                                </Card>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-10 animate-fade-in-up">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[3rem] lg:col-span-2">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-10">
                                <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-4 italic">
                                    <Database className="h-8 w-8 text-amber-500" /> Persistence & Archives
                                </CardTitle>
                            </CardHeader>
                            <div className="space-y-10">
                                <div className="flex items-center justify-between p-10 rounded-[2.5rem] bg-amber-50/50 border border-amber-100 group">
                                    <div className="flex gap-6">
                                        <div className="h-16 w-16 rounded-2xl bg-white border border-amber-100 flex items-center justify-center shadow-premium transition-transform group-hover:rotate-12">
                                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-slate-900 italic leading-none mb-2">Maintenance Override</p>
                                            <p className="text-xs text-slate-500 font-medium max-w-sm">Place the public front-end portal into read-only mode for architectural updates.</p>
                                        </div>
                                    </div>
                                    <Switch className="scale-125 data-[state=checked]:bg-amber-500" />
                                </div>

                                <div className="p-10 rounded-[3rem] border border-slate-100 space-y-8 bg-slate-50 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xl font-black text-slate-900 italic">Database Encrypted Snapshot</h5>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white px-4 py-2 rounded-full shadow-sm">Frequency: {settings.backup_frequency}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Button
                                            className="h-24 rounded-3xl bg-white text-slate-900 hover:bg-slate-900 hover:text-white font-black gap-4 transition-all shadow-premium group"
                                            onClick={handleBackup}
                                            disabled={backingUp}
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                                <RefreshCw className={cn("h-5 w-5", backingUp && "animate-spin")} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black italic">Initialize Backup</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Local Redundancy</p>
                                            </div>
                                        </Button>
                                        <Button className="h-24 rounded-3xl bg-white text-slate-900 hover:bg-slate-900 hover:text-white font-black gap-4 transition-all shadow-premium group" variant="outline">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                                <Download className="h-5 w-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-black italic">Export SQL Schema</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">External Archive</p>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-10">
                            <Card className="glass-card border-rose-100 shadow-2xl p-10 rounded-[3rem] bg-rose-50/20">
                                <div className="p-5 rounded-3xl bg-rose-600 text-white mb-6 h-fit w-fit shadow-xl shadow-rose-200">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 italic leading-none mb-3">Red Zone</h4>
                                <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">System-wide decommissioning and laboratory result purging. Irreversible protocol execution.</p>
                                <Button variant="destructive" className="w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-xl shadow-rose-200">
                                    <LogOut className="h-4 w-4" /> Purge Global Data
                                </Button>
                            </Card>

                            <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[2.5rem] bg-white flex flex-col items-center text-center">
                                <div className="h-16 w-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                                    <Globe className="h-8 w-8 text-slate-400" />
                                </div>
                                <h6 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] mb-2">Core Kernel Version</h6>
                                <p className="text-2xl font-black text-slate-900 italic tracking-tighter">IDC <span className="text-primary">PRO</span> v4.2.0-stable</p>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Staff Enlistment Modal */}
            <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
                <DialogContent className="sm:max-w-xl bg-white border-slate-200 shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-[3rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                            <Users className="h-7 w-7 text-primary" /> Enlist New Personnel
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAddStaff} className="p-10 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Name</Label>
                            <Input
                                required
                                className="h-14 font-bold rounded-2xl border-slate-100"
                                value={newStaff.name}
                                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                placeholder="Personnel's full legal name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Email</Label>
                                <Input
                                    required
                                    type="email"
                                    className="h-14 font-bold rounded-2xl border-slate-100"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                                    placeholder="work@idc.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile Node</Label>
                                <Input
                                    required
                                    className="h-14 font-bold rounded-2xl border-slate-100"
                                    value={newStaff.phone}
                                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                                    placeholder="+260..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Role</Label>
                                <select
                                    className="w-full h-14 rounded-2xl border border-slate-100 bg-white px-4 text-xs font-black uppercase tracking-widest"
                                    value={newStaff.role}
                                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                                >
                                    <option value="admin">Super Admin</option>
                                    <option value="staff">Administrative Staff</option>
                                    <option value="technician">Lab Technician</option>
                                    <option value="billing">Billing Officer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Branch</Label>
                                <select
                                    className="w-full h-14 rounded-2xl border border-slate-100 bg-white px-4 text-xs font-black uppercase tracking-widest"
                                    value={newStaff.branch_id}
                                    onChange={(e) => setNewStaff({ ...newStaff, branch_id: e.target.value })}
                                >
                                    <option value="">Global/Home Office</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50 flex gap-4">
                            <Button variant="ghost" type="button" className="flex-1 h-16 rounded-2xl font-black uppercase text-[10px]" onClick={() => setIsStaffModalOpen(false)}>Discard</Button>
                            <Button type="submit" className="flex-[2] h-16 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] shadow-2xl">Confirm Enlistment</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}

