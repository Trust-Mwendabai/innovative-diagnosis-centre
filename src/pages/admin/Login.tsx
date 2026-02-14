import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, ChevronRight, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost/IDC/api/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);

                if (data.user.role === 'doctor') {
                    toast.success(`Welcome, Dr. ${data.user.name}!`);
                    navigate("/doctor/dashboard");
                } else {
                    toast.success("Welcome back, Admin!");
                    navigate("/admin/dashboard");
                }
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error("Connection error. Check your backend server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />

            <div className="w-full max-w-md px-4 relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                        <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white font-heading">IDC Admin</h1>
                    <p className="text-slate-400 mt-2">Access the diagnostic management center</p>
                </div>

                <Card className="glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="pt-8 px-8 pb-4">
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Secure Login
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@idc.zm"
                                        className="h-14 pl-12 glass-input border-white/5 bg-white/5 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" title="" className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</Label>
                                    <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="h-14 pl-12 glass-input border-white/5 bg-white/5 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 gradient-primary rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Sign In</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-500 text-sm mt-8 font-medium">
                    &copy; {new Date().getFullYear()} Innovative Diagnosis Centre
                </p>
            </div>
        </div>
    );
}

