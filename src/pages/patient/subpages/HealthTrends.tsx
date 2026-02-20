import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    Info,
    RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HealthTrends() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/health_metrics/read.php?patient_id=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                setMetrics(data.metrics || []);
            }
        } catch (error) {
            console.error("Error fetching health trends:", error);
            toast.error("Failed to sync health data stream.");
        } finally {
            setLoading(false);
        }
    };

    const seedSampleData = async () => {
        setSeeding(true);
        try {
            const res = await fetch(`${API_BASE_URL}/health_metrics/seed.php?patient_id=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                toast.success("Sample health data synchronized successfully.");
                fetchMetrics();
            }
        } catch (error) {
            toast.error("Data synchronization failed.");
        } finally {
            setSeeding(false);
        }
    };

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        fetchMetrics();
    }, [user?.id]);

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        Health <span className="text-[hsl(var(--gold))]">Trends</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Biometric Data Analytics • Temporal Health Insights</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={seedSampleData}
                        disabled={seeding}
                        variant="outline"
                        className="h-14 px-8 border-white/10 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[hsl(var(--gold))]/10 hover:border-[hsl(var(--gold))]/40 transition-all"
                    >
                        <RefreshCw className={cn("mr-2 h-4 w-4", seeding && "animate-spin")} />
                        {seeding ? "Syncing..." : "Sync Sample Data"}
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-6">
                    <div className="w-16 h-16 border-4 border-[hsl(var(--gold))]/10 border-t-[hsl(var(--gold))] rounded-full animate-spin shadow-glow-gold" />
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em] animate-pulse">Decrypting Biometric Stream...</p>
                </div>
            ) : metrics.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {metrics.map((metric, idx) => (
                        <motion.div
                            key={metric.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="glass-card border-white/10 overflow-hidden group hover:border-[hsl(var(--gold))]/30 transition-all">
                                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-black text-white uppercase tracking-tight">{metric.name}</CardTitle>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Measured in {metric.unit}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[hsl(var(--gold))]/5 group-hover:border-[hsl(var(--gold))]/20 transition-all">
                                        <Activity className="h-6 w-6 text-white/40 group-hover:text-[hsl(var(--gold))] transition-colors" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metric.data}>
                                                <defs>
                                                    <linearGradient id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--gold))" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="hsl(var(--gold))" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
                                                    dx={-10}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                        borderRadius: '16px',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                                        backdropFilter: 'blur(20px)'
                                                    }}
                                                    itemStyle={{ color: 'hsl(var(--gold))', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                                                    labelStyle={{ color: 'white', fontSize: '10px', marginBottom: '4px', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="hsl(var(--gold))"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill={`url(#gradient-${idx})`}
                                                    animationDuration={2000}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Latest Entry</p>
                                            <p className="text-xl font-black text-white">{metric.data[metric.data.length - 1].value} <span className="text-[10px] text-white/40">{metric.unit}</span></p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Status Protocol</p>
                                            <p className="text-xs font-black text-emerald-400 uppercase tracking-tighter">OPTIMIZED NODE</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                    <Activity className="h-16 w-16 text-white/10 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white/40 uppercase tracking-widest">No Biometric Flow Detected</h3>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em] mt-4 max-w-md mx-auto">
                        Your health metrics stream is currently empty. Upload test results or use the sync button above to activate sample trends.
                    </p>
                    <Button
                        onClick={seedSampleData}
                        className="mt-8 h-12 px-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest transition-all"
                    >
                        Initialize Data Stream
                    </Button>
                </div>
            )}

            {/* Premium Insight Card */}
            <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--saffron))]/20 via-transparent to-transparent p-1 rounded-[3rem]">
                <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.9rem] p-10 flex flex-col lg:flex-row items-center gap-10">
                    <div className="h-24 w-24 rounded-[2rem] bg-[hsl(var(--gold))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/20 flex-shrink-0 animate-pulse">
                        <TrendingUp className="h-12 w-12 text-[hsl(var(--gold))]" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tight">AI Diagnostic Foresight</h4>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed">
                            Our advanced analytics engine monitors your biometric fluctuations in real-time. Consistent trends within optimized parameters contribute to long-term health stabilization and early preventative detection.
                        </p>
                    </div>
                    <Button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest transition-all whitespace-nowrap">
                        Download Report <ArrowUpRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </Card>
        </div >
    );
}
