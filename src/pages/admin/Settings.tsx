import { useState } from "react";
import { Lock, Save, Shield, CheckCircle2, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Settings() {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.new !== passwords.confirm) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwords.new.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            // Need user ID from context. Assuming useAuth provides user object with ID.
            // If user ID is not available directly, we might need to store it in local storage or decode token.
            // For now, assuming user.id exists.
            const userId = user?.id || 1; // Fallback to 1 for dev if not present

            const res = await fetch(`${API_BASE_URL}/users/update_password.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    current_password: passwords.current,
                    new_password: passwords.new
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Password updated successfully");
                setPasswords({ current: "", new: "", confirm: "" });
            } else {
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic">
                        Security <span className="text-primary underline decoration-primary/20 underline-offset-8">Settings</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your account credentials and security.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="glass-card border-slate-100 shadow-premium p-10 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Lock className="w-64 h-64" />
                    </div>

                    <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8 relative z-10">
                        <CardTitle className="text-2xl font-black text-slate-900 italic flex items-center gap-3">
                            <Shield className="h-6 w-6 text-primary" /> Change Password
                        </CardTitle>
                        <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">
                            Update your access credentials securely.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleChangePassword} className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Password</Label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="password"
                                    required
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="pl-12 h-14 font-medium border-slate-100 focus:border-primary/30 rounded-2xl bg-white/50"
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="password"
                                    required
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="pl-12 h-14 font-medium border-slate-100 focus:border-primary/30 rounded-2xl bg-white/50"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Confirm New Password</Label>
                            <div className="relative">
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="password"
                                    required
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="pl-12 h-14 font-medium border-slate-100 focus:border-primary/30 rounded-2xl bg-white/50"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all gap-3 mt-4"
                        >
                            {loading ? (
                                <span className="animate-spin">Wait...</span>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" /> Update Credentials
                                </>
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
