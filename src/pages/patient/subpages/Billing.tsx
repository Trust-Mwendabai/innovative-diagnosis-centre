import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    Download,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { API_BASE_URL as BASE } from "@/lib/config";

export default function PatientBilling() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalSettled: 0,
        pendingDues: 0,
        savedMethods: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBillingData = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`${API_BASE_URL}/billing/read.php?patient_id=${user.id}`);
                const data = await res.json();
                if (data.success) {
                    setTransactions(data.transactions || []);
                    setStats(data.stats || { totalSettled: 0, pendingDues: 0, savedMethods: 0 });
                } else {
                    toast.error(data.message || "Failed to load billing records");
                }
            } catch (error) {
                console.error("Error fetching billing data:", error);
                toast.error("Connection error. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchBillingData();
    }, [user?.id]);

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div>
                <h1 className="text-5xl font-black font-heading tracking-tighter">
                    Billing <span className="text-[hsl(var(--gold))]">Records</span>
                </h1>
                <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">View your payment history and invoices</p>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--emerald-india))]/10 to-transparent rounded-[2.5rem] p-1">
                    <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.4rem] p-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Total Settled</p>
                        {loading ? (
                            <Skeleton className="h-10 w-32 bg-white/5" />
                        ) : (
                            <h4 className="text-4xl font-black text-white tracking-tighter">ZMW {stats.totalSettled.toLocaleString()}</h4>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-[hsl(var(--emerald-india))] font-black text-[10px] uppercase tracking-widest">
                            <TrendingUp className="h-4 w-4" /> 128 bit Encrypted
                        </div>
                    </div>
                </Card>
                <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--saffron))]/10 to-transparent rounded-[2.5rem] p-1">
                    <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.4rem] p-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Pending Dues</p>
                        {loading ? (
                            <Skeleton className="h-10 w-32 bg-white/5" />
                        ) : (
                            <h4 className="text-4xl font-black text-white tracking-tighter">ZMW {stats.pendingDues.toLocaleString()}</h4>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-[hsl(var(--saffron))] font-black text-[10px] uppercase tracking-widest">
                            <Clock className="h-4 w-4" /> Scheduled Payments
                        </div>
                    </div>
                </Card>
                <Card className="glass-card border-none bg-gradient-to-br from-blue-600/10 to-transparent rounded-[2.5rem] p-1">
                    <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.4rem] p-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Saved Methods</p>
                        <h4 className="text-4xl font-black text-white tracking-tighter">02 Links</h4>
                        <div className="flex items-center gap-2 mt-4 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                            <ShieldCheck className="h-4 w-4" /> PCI-DSS Level 1
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction Table */}
            <Card className="glass-card border-white/10 rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-xl font-black font-heading text-white flex items-center gap-4 uppercase tracking-tighter">
                        <History className="h-6 w-6 text-[hsl(var(--gold))]" />
                        Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 bg-white/5">
                                    <th className="p-10">Invoice #</th>
                                    <th className="p-10">Test Name</th>
                                    <th className="p-10">Date</th>
                                    <th className="p-10">Amount</th>
                                    <th className="p-10">Status</th>
                                    <th className="p-10">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    [1, 2, 3].map((i) => (
                                        <tr key={i} className="border-b border-white/5">
                                            <td className="p-10"><Skeleton className="h-4 w-24 bg-white/5" /></td>
                                            <td className="p-10"><Skeleton className="h-4 w-48 bg-white/5" /></td>
                                            <td className="p-10"><Skeleton className="h-4 w-20 bg-white/5" /></td>
                                            <td className="p-10"><Skeleton className="h-4 w-32 bg-white/5" /></td>
                                            <td className="p-10"><Skeleton className="h-8 w-24 rounded-xl bg-white/5" /></td>
                                            <td className="p-10"><Skeleton className="h-10 w-24 bg-white/5" /></td>
                                        </tr>
                                    ))
                                ) : transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-10">
                                                <p className="font-black text-white text-sm tracking-widest">{tx.id}</p>
                                            </td>
                                            <td className="p-10">
                                                <p className="font-black text-white/60 text-sm uppercase truncate max-w-[200px]">{tx.test}</p>
                                            </td>
                                            <td className="p-10">
                                                <p className="font-black text-white/40 text-[10px] uppercase tracking-widest">{tx.date}</p>
                                            </td>
                                            <td className="p-10">
                                                <p className="font-black text-white text-lg tracking-tighter">ZMW {tx.amount.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-white/20 uppercase mt-1 tracking-tighter">{tx.method}</p>
                                            </td>
                                            <td className="p-10">
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border inline-block",
                                                    tx.status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                        tx.status === 'cancelled' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                            "bg-[hsl(var(--saffron))]/10 text-[hsl(var(--saffron))] border-[hsl(var(--saffron))]/20"
                                                )}>
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="p-10">
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                                                        <Download className="h-5 w-5 text-white/60" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                                                        <ArrowUpRight className="h-5 w-5 text-white/60" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center text-white/20 font-black uppercase tracking-widest">
                                            No transaction history found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
}
