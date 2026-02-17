import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Key,
    Bell,
    Save,
    Camera,
    CreditCard,
    Fingerprint,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/config";

export default function PatientProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: ""
    });

    React.useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                setProfileLoading(false);
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/patients/details.php?id=${user.id}`);
                const data = await res.json();
                if (data.success) {
                    const p = data.patient;
                    setFormData({
                        name: p.name || "",
                        email: p.email || "",
                        phone: p.phone || "",
                        address: p.address || "",
                        dob: p.dob || "",
                        gender: p.gender || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, [user?.id]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/patients/update.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user?.id,
                    ...formData
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Identity profile synchronized successfully");
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'personal', label: 'Identity', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Preferences', icon: Bell }
    ];

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div>
                <h1 className="text-5xl font-black font-heading tracking-tighter">
                    Profile <span className="text-[hsl(var(--gold))]">Control</span>
                </h1>
                <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Identity Authentication • Security Protocol Level 4</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full p-6 h-20 rounded-3xl border flex items-center gap-4 transition-all uppercase text-[10px] font-black tracking-widest",
                                activeTab === tab.id
                                    ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/40 text-white shadow-glow-gold"
                                    : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                            )}
                        >
                            <tab.icon className={cn("h-5 w-5", activeTab === tab.id ? "text-[hsl(var(--gold))]" : "text-white/10")} />
                            {tab.label}
                        </button>
                    ))}

                    <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--emerald-india))]/10 to-transparent p-6 mt-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-4">
                            <Fingerprint className="h-5 w-5 text-[hsl(var(--emerald-india))]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Trust Level</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[92%] bg-[hsl(var(--emerald-india))] shadow-[0_0_10px_rgba(0,255,100,0.5)]" />
                        </div>
                        <p className="text-[9px] font-bold text-white/30 uppercase mt-4 tracking-tighter leading-relaxed">
                            Your profile is verified and secured with end-to-end encryption.
                        </p>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    {activeTab === 'personal' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="glass-card border-white/10 rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-10 border-b border-white/5 bg-white/5 relative">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative group">
                                            <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] flex items-center justify-center border-4 border-slate-950 shadow-glow-gold">
                                                <User className="h-12 w-12 text-slate-950" />
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center hover:scale-110 transition-all border-4 border-slate-950">
                                                <Camera className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="text-center md:text-left">
                                            {profileLoading ? (
                                                <div className="space-y-3">
                                                    <Skeleton className="h-8 w-48" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{formData.name || "UNNAMED PATIENT"}</h3>
                                                    <p className="text-[10px] font-black text-[hsl(var(--gold))] uppercase tracking-[0.3em] mt-1">
                                                        Patient ID: IDC-{user?.id?.toString().padStart(6, '0') || "XXXXXX"}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Full Identity Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                                {profileLoading ? (
                                                    <Skeleton className="w-full h-16 rounded-2xl" />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Communication Link (Email)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                                {profileLoading ? (
                                                    <Skeleton className="w-full h-16 rounded-2xl" />
                                                ) : (
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Mobile Terminal (Phone)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                                {profileLoading ? (
                                                    <Skeleton className="w-full h-16 rounded-2xl" />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Geographic Node (Address)</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                                {profileLoading ? (
                                                    <Skeleton className="w-full h-16 rounded-2xl" />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={formData.address}
                                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 pt-8 flex justify-end">
                                            {profileLoading ? (
                                                <Skeleton className="h-16 w-48 rounded-2xl" />
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-slate-950 font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all"
                                                >
                                                    {loading ? "Syncing..." : "Update Identity"} <Save className="ml-3 h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <Card className="glass-card border-white/10 rounded-[3rem] overflow-hidden">
                                <CardContent className="p-10 space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Shield className="h-8 w-8 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Security Credentials</h4>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">Manage passwords and access keys</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="flex items-center justify-between p-8 rounded-3xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-6">
                                                <Key className="h-6 w-6 text-[hsl(var(--gold))]" />
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">Master Password</p>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter mt-1">Last changed 45 days ago</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest">Change</Button>
                                        </div>

                                        <div className="flex items-center justify-between p-8 rounded-3xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-6">
                                                <Shield className="h-6 w-6 text-emerald-400" />
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">Two-Factor Authentication</p>
                                                    <p className="text-[10px] font-bold text-emerald-400/40 uppercase tracking-tighter mt-1">Status: Active & Shielded</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="h-12 px-6 rounded-xl border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black uppercase tracking-widest text-emerald-400">Settings</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="glass-card border-white/10 rounded-[3rem] overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/20">
                                            <Bell className="h-8 w-8 text-[hsl(var(--gold))]" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Notification Node</h4>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">Configure alert delivery protocols</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: "Critical Priority Alerts", desc: "Results ready, urgent notifications", active: true },
                                            { label: "Temporal Reminders", desc: "Appointment schedules and preparation", active: true },
                                            { label: "Health Insights", desc: "Weekly trends and wellness data", active: false },
                                            { label: "Security Logs", desc: "Login attempts and profile changes", active: true },
                                        ].map((pref, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-[hsl(var(--gold))]/20 transition-all">
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{pref.label}</p>
                                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mt-1">{pref.desc}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-14 h-8 rounded-full p-1 cursor-pointer transition-all",
                                                    pref.active ? "bg-[hsl(var(--gold))]" : "bg-white/10"
                                                )}>
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full bg-slate-950 transition-all",
                                                        pref.active ? "translate-x-6" : "translate-x-0"
                                                    )} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
