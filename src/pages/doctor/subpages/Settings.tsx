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
    Phone,
    Mail,
    Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

export default function DoctorSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Info saved successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">My Info & Settings</h1>
                <p className="text-white/60 font-medium mt-1">Check your details and change how the app works for you.</p>
            </div>

            <div className="grid gap-8">
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl rounded-[3rem]">
                    <CardHeader className="p-10 border-b border-white/5 bg-slate-800/20">
                        <CardTitle className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                            <User className="h-4 w-4 text-cyan-500" /> My Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <User className="h-3 w-3" /> Full Name
                                </Label>
                                <div className="relative group">
                                    <Input defaultValue={`Dr. ${user?.name}`} className="pl-4 h-14 bg-slate-950/50 border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/50 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Shield className="h-3 w-3" /> My Doctor ID
                                </Label>
                                <div className="relative group">
                                    <Input defaultValue="ZMC-2024-8891" className="pl-4 h-14 bg-slate-950/50 border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/50 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> My Email
                                </Label>
                                <div className="relative group">
                                    <Input defaultValue={user?.email} className="pl-4 h-14 bg-slate-950/50 border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/50 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Phone className="h-3 w-3" /> Emergency Number
                                </Label>
                                <div className="relative group">
                                    <Input defaultValue="+260 970 000 000" className="pl-4 h-14 bg-slate-950/50 border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/50 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs h-14 px-10 rounded-2xl shadow-glow-cyan transition-all border-none"
                            >
                                <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save My Info"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
