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
    LogOut
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Settings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [backingUp, setBackingUp] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("http://localhost/IDC/api/settings/read.php");
            const data = await res.json();
            if (data.success) setSettings(data.settings);
        } catch (error) {
            toast.error("Error loading settings");
        } finally {
            setLoading(false);
        }
    };

    const handleBackup = async () => {
        setBackingUp(true);
        try {
            const res = await fetch("http://localhost/IDC/api/settings/backup.php");
            const data = await res.json();
            if (data.success) {
                toast.success(`Backup Created: ${data.filename}`);
            }
        } catch (error) {
            toast.error("Backup failed");
        } finally {
            setBackingUp(false);
        }
    };

    const saveSettings = () => {
        toast.success("Settings updated successfully");
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Initializing System Configuration...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Settings</h1>
                    <p className="text-muted-foreground font-medium">Global configuration, security protocols, and maintenance.</p>
                </div>
                <Button className="gradient-primary h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 gap-2" onClick={saveSettings}>
                    <Save className="h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-8">
                <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 gap-2">
                    <TabsTrigger value="general" className="rounded-xl font-bold gap-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <SettingsIcon className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl font-bold gap-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Shield className="h-4 w-4" /> RBAC & Security
                    </TabsTrigger>
                    <TabsTrigger value="maintenance" className="rounded-xl font-bold gap-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Database className="h-4 w-4" /> Maintenance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem]">
                            <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-100 mb-6">
                                <CardTitle className="text-xl font-black text-slate-900">Clinic Identity</CardTitle>
                                <CardDescription className="font-medium text-slate-400">Basic information used across reports and portal.</CardDescription>
                            </CardHeader>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-500">Clinic Name</Label>
                                    <Input defaultValue={settings.clinic_name} className="glass-input h-14 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-500">Support Email</Label>
                                    <Input defaultValue={settings.support_email} className="glass-input h-14 font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase text-slate-500">Language</Label>
                                        <select className="w-full h-14 rounded-2xl border border-white/20 bg-white/50 px-4 text-sm font-bold">
                                            <option>English (UK)</option>
                                            <option>English (US)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase text-slate-500">Timezone</Label>
                                        <select className="w-full h-14 rounded-2xl border border-white/20 bg-white/50 px-4 text-sm font-bold">
                                            <option>Central African Time (CAT)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem]">
                            <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-100 mb-6">
                                <CardTitle className="text-xl font-black text-slate-900">Communication Gateways</CardTitle>
                                <CardDescription className="font-medium text-slate-400">Manage SMS and Email provider keys.</CardDescription>
                            </CardHeader>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Smartphone className="h-5 w-5" /></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">SMS Gateway (Twilio)</p>
                                            <p className="text-[10px] font-bold text-slate-400">Status: Active</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase">Configure</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Mail className="h-5 w-5" /></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Email (SMTP)</p>
                                            <p className="text-[10px] font-bold text-slate-400">Status: Verified</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase">Configure</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem]">
                        <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-100 mb-6">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" /> Role-Based Access Control
                            </CardTitle>
                            <CardDescription className="font-medium">Define what each staff category can see and do.</CardDescription>
                        </CardHeader>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { role: 'Super Admin', access: 'Complete System', users: 2, color: 'primary' },
                                { role: 'Technician', access: 'Tests & Results', users: 12, color: 'blue' },
                                { role: 'Billing', access: 'Accounting & Patients', users: 4, color: 'emerald' },
                                { role: 'Staff', access: 'Appointments Only', users: 8, color: 'slate' }
                            ].map((r, i) => (
                                <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-white/50 group hover:border-primary transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn("p-3 rounded-2xl", `text-${r.color}-500 bg-${r.color}-50`)}>
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <MoreVertical className="h-4 w-4 text-slate-300" />
                                    </div>
                                    <h5 className="font-black text-slate-900 mb-1">{r.role}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 mb-4">{r.access}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                                        <Users className="h-3 w-3" /> {r.users} Active
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 rounded-[2rem] bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Lock className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-black">Two-Factor Authentication (2FA)</p>
                                    <p className="text-xs text-slate-400 font-medium">Require mobile verification for all admin logins.</p>
                                </div>
                            </div>
                            <Switch />
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem] lg:col-span-2">
                            <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-100 mb-6">
                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Database className="h-5 w-5 text-amber-500" /> Maintenance & Backups
                                </CardTitle>
                            </CardHeader>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-amber-50 border border-amber-100">
                                    <div>
                                        <p className="font-black text-slate-900">Maintenance Mode</p>
                                        <p className="text-xs text-slate-500 font-medium">Take the public portal offline for updates.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h5 className="font-black text-slate-900">Database Snapshot</h5>
                                        <span className="text-[10px] font-bold text-slate-400 italic">Last backup: 2 hours ago</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            className="py-10 rounded-3xl bg-slate-100 text-slate-900 hover:bg-slate-200 font-black gap-2 transition-all active:scale-95"
                                            onClick={handleBackup}
                                            disabled={backingUp}
                                        >
                                            <RefreshCw className={cn("h-5 w-5 text-primary", backingUp && "animate-spin")} />
                                            {backingUp ? "Generating..." : "Run Backup Now"}
                                        </Button>
                                        <Button className="py-10 rounded-3xl bg-slate-100 text-slate-900 hover:bg-slate-200 font-black gap-2" variant="outline">
                                            <Download className="h-5 w-5" /> Download SQL
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-8">
                            <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem] border-rose-100">
                                <div className="p-4 rounded-3xl bg-rose-50 text-rose-500 mb-4 h-fit w-fit shadow-sm">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-2">Danger Zone</h4>
                                <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">System-wide data purging and factory resets. Use with extreme caution. This action cannot be undone.</p>
                                <Button variant="destructive" className="w-full py-6 rounded-2xl font-black gap-2 shadow-xl shadow-rose-200">
                                    <Lock className="h-4 w-4" /> Purge System Data
                                </Button>
                            </Card>

                            <Card className="glass-light border-white/20 shadow-premium p-6 rounded-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-2xl"><RefreshCw className="h-5 w-5 text-slate-400" /></div>
                                    <div>
                                        <h6 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Version</h6>
                                        <p className="text-sm font-black text-slate-900">IDC Core v2.4.0</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
