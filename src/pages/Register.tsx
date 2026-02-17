import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Account created! Please log in with your credentials.");
                navigate("/login");
            } else {
                toast.error(data.message || "Registration failed");
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
            <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-[hsl(var(--saffron))]/5 blur-[100px]" />
            <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-[hsl(var(--gold))]/5 blur-[120px]" />

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

                <Card className="glass-card border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center mb-6 shadow-glow-gold">
                            <UserPlus className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-black font-heading text-white mb-2">Create Account</CardTitle>
                        <CardDescription className="text-white/60 font-medium">Join Zambia's most innovative healthcare network today.</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-white/20 group-focus-within:text-[hsl(var(--saffron))] transition-colors" />
                                    <Input
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-[hsl(var(--saffron))]/50 focus:ring-[hsl(var(--saffron))]/20 transition-all rounded-xl"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email (Optional)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/20 group-focus-within:text-[hsl(var(--saffron))] transition-colors" />
                                    <Input
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-[hsl(var(--saffron))]/50 focus:ring-[hsl(var(--saffron))]/20 transition-all rounded-xl"
                                        placeholder="john@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-white/20 group-focus-within:text-[hsl(var(--saffron))] transition-colors" />
                                    <Input
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-[hsl(var(--saffron))]/50 focus:ring-[hsl(var(--saffron))]/20 transition-all rounded-xl"
                                        placeholder="+260 9xx xxx xxx"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/20 group-focus-within:text-[hsl(var(--saffron))] transition-colors" />
                                    <Input
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-[hsl(var(--saffron))]/50 focus:ring-[hsl(var(--saffron))]/20 transition-all rounded-xl"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-wider rounded-xl shadow-glow-gold hover:scale-[1.02] transition-all duration-300 mt-4"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Register Now"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <div className="text-center mt-6 text-sm">
                                <span className="text-white/40">Already have an account?</span>{" "}
                                <Link to="/login" className="text-[hsl(var(--gold))] font-bold hover:underline">Log In</Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-2 mt-8 text-[hsl(var(--emerald-india))] font-bold text-xs uppercase tracking-widest opacity-60">
                    <ShieldCheck className="h-4 w-4" />
                    Secure & HIPAA Compliant
                </div>
            </motion.div>
        </div>
    );
}
