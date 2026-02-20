import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Lock,
    Bell,
    Shield,
    Save,
    Stethoscope,
    Phone,
    Mail
} from "lucide-react";
import { toast } from "sonner";

export default function DoctorSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile updated successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic">Portal Settings</h1>
                <p className="text-white/60 font-bold mt-1">Configure your clinical profile and security preferences.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                            <User className="h-6 w-6 text-cyan-500" /> Professional Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                    <Input defaultValue={`Dr. ${user?.name}`} className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Medical License ID</Label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                    <Input defaultValue="ZMC-2024-8891" className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Work Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                    <Input defaultValue={user?.email} className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Emergency Contact</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                    <Input defaultValue="+260 970 000 000" className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs h-14 px-10 rounded-2xl shadow-glow-cyan transition-all"
                            >
                                <Save className="mr-2 h-4 w-4" /> {loading ? "Updating..." : "Persist Changes"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="glass-card border-white/10 shadow-2xl rounded-[3rem] overflow-hidden p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Lock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg italic tracking-tighter leading-tight">Security<br />Enforcement</h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Button variant="outline" className="w-full h-12 bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[9px] rounded-xl">
                                Rotate Credentials
                            </Button>
                            <Button variant="outline" className="w-full h-12 bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[9px] rounded-xl">
                                Setup MFA Vault
                            </Button>
                        </div>
                    </Card>

                    <Card className="gradient-primary shadow-2xl rounded-[3rem] p-10 text-white relative overflow-hidden group border-white/10">
                        <div className="relative z-10">
                            <Bell className="h-10 w-10 text-white/30 mb-6 group-hover:rotate-12 transition-transform duration-500" />
                            <h3 className="text-2xl font-black mb-4 leading-tight italic tracking-tighter">Clinical Alert<br />Protocol</h3>
                            <p className="text-white/70 text-xs font-bold leading-relaxed mb-6">Manage how you receive critical patient diagnostic alerts.</p>
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[80%] bg-white shadow-[0_0_10px_white]" />
                                </div>
                                <span className="text-[10px] font-black">80%</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    </Card>
                </div>
            </div>
        </div>
    );
}
