import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Smartphone, Send, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PatientLogin() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            });
            const data = await res.json();

            if (data.success) {
                // Restricted portal to patients only
                if (data.user.role === 'patient') {
                    login(data.token, data.user);
                    toast.success(`Welcome back, ${data.user.name}!`);
                    navigate("/patient/dashboard");
                } else {
                    toast.error("Invalid credentials for this portal.");
                }
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container relative py-20 min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 -right-10 w-72 h-72 rounded-full bg-[hsl(var(--gold))]/5 blur-[100px]" />
            <div className="absolute bottom-1/4 -left-10 w-96 h-96 rounded-full bg-[hsl(var(--saffron))]/5 blur-[120px]" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex justify-center mb-10 mt-4">
                    <Link
                        to="/"
                        className="group flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[hsl(var(--gold))]/30 transition-all duration-300 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center shadow-glow-gold transition-transform group-hover:-translate-x-1">
                            <ArrowRight className="h-4 w-4 text-white rotate-180" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                            Return to Homepage
                        </span>
                    </Link>
                </div>

                <Card className="glass-card border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center mb-6 shadow-glow-gold rotate-3">
                            <ShieldCheck className="h-10 w-10 text-white -rotate-3" />
                        </div>
                        <CardTitle className="text-3xl font-black font-heading text-white mb-2 tracking-tight">Portal Login</CardTitle>
                        <CardDescription className="text-white/60 font-medium">Access your health records securely.</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Phone or Email</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[hsl(var(--gold))] transition-colors" />
                                    <Input
                                        className="pl-12 h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/20 focus:border-[hsl(var(--gold))]/50 focus:ring-[hsl(var(--gold))]/20 transition-all rounded-2xl"
                                        placeholder="e.g., +260 96xxx"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Password</label>
                                    <Link to="#" className="text-[9px] font-black uppercase text-[hsl(var(--gold))] hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[hsl(var(--gold))] transition-colors" />
                                    <Input
                                        type="password"
                                        className="pl-12 h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/20 focus:border-[hsl(var(--gold))]/50 focus:ring-[hsl(var(--gold))]/20 transition-all rounded-2xl"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest rounded-2xl shadow-glow-gold hover:scale-[1.02] transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Secure Login"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <div className="text-center mt-8 text-sm">
                            <span className="text-white/40">New to IDC?</span>{" "}
                            <Link to="/register" className="text-[hsl(var(--gold))] font-bold hover:underline">Create Account</Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                    Trusted by 50,000+ patients in Zambia
                </p>
            </motion.div>
        </div>
    );
}
