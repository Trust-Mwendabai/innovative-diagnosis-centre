import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Smartphone, Send, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PatientLogin() {
    const [step, setStep] = useState(1); // 1: Identifier, 2: OTP
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost/IDC/api/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("OTP sent! Check your phone/email.");
                if (data.otp_simulated) {
                    toast.info(`Simulated OTP: ${data.otp_simulated}`, { duration: 8000 });
                }
                setStep(2);
            } else {
                toast.error(data.message || "User not found");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost/IDC/api/auth/verify.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, otp })
            });
            const data = await res.json();

            if (data.success) {
                login(data.token, data.user);
                toast.success(`Welcome back, ${data.user.name}!`);

                // Route based on role
                if (data.user.role === 'admin' || data.user.role === 'staff') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/patient/dashboard");
                }
            } else {
                toast.error(data.message || "Invalid OTP");
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
                <Card className="glass-card border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center mb-6 shadow-glow-gold rotate-3">
                            <ShieldCheck className="h-10 w-10 text-white -rotate-3" />
                        </div>
                        <CardTitle className="text-3xl font-black font-heading text-white mb-2 tracking-tight">Patient Login</CardTitle>
                        <CardDescription className="text-white/60 font-medium">Access your health records securely via OTP.</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleRequestOTP}
                                    className="space-y-6"
                                >
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

                                    <Button
                                        className="w-full h-14 bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest rounded-2xl shadow-glow-gold hover:scale-[1.02] transition-all duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Request Access OTP"}
                                        <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleVerifyOTP}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2 text-center mb-4">
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Entering OTP for</p>
                                        <p className="text-sm text-[hsl(var(--gold))] font-black">{identifier}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 text-center block">6-Digit Verification Code</label>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-[hsl(var(--gold))] transition-colors" />
                                            <Input
                                                className="pl-12 h-14 bg-white/5 border-white/10 text-white text-center text-2xl font-black tracking-[0.5em] placeholder:text-white/10 focus:border-[hsl(var(--gold))]/50 focus:ring-[hsl(var(--gold))]/20 transition-all rounded-2xl"
                                                placeholder="000000"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setStep(1)}
                                            className="h-14 text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white"
                                        >
                                            Change Contact
                                        </Button>
                                        <Button
                                            className="h-14 bg-gradient-to-r from-[hsl(var(--emerald-india))] to-[hsl(var(--accent))] text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300"
                                            disabled={loading}
                                        >
                                            {loading ? "Verifying..." : "Secure Login"}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

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
