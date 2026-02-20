import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FlaskConical,
    Search,
    Filter,
    FileCheck,
    AlertCircle,
    Download
} from "lucide-react";

import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function DoctorResults() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/results/read.php`);
                const data = await res.json();
                if (data.success) {
                    setResults(data.results);
                }
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const filteredResults = results.filter(res =>
        res.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.id?.toString().includes(searchQuery) ||
        res.test_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApprove = (id: string) => {
        setResults(prev => prev.map(res =>
            res.id === id ? { ...res, status: "Approved" } : res
        ));
        toast.success(`Report #${id} has been signed off.`);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">My Reports</h1>
                    <p className="text-white/60 font-medium mt-1">Check and sign off on reports from the lab.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => toast.info("Exporting logs...")}
                        variant="outline"
                        className="h-12 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl px-6"
                    >
                        <Download className="mr-2 h-4 w-4" /> Save Copy
                    </Button>
                    <Button
                        onClick={() => toast.info("Signing all reports...")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-glow-emerald transition-all"
                    >
                        <FileCheck className="mr-2 h-4 w-4" /> Sign All
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8 border-b border-white/5 bg-slate-800/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-cyan-500" /> New Reports
                        </CardTitle>
                        <div className="flex gap-3">
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="Search by ID or name..."
                                    className="bg-slate-950/50 border-white/5 pl-12 h-12 text-white placeholder:text-white/10 rounded-2xl focus:border-cyan-500/50 transition-all font-bold"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => toast.info("Report filters coming soon")}
                                variant="outline"
                                className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-white/20 font-black uppercase tracking-widest">Finding reports...</p>
                            </div>
                        ) : filteredResults.length > 0 ? (
                            filteredResults.map((result) => (
                                <div key={result.id} className="p-8 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group cursor-pointer border-l-4 border-transparent hover:border-cyan-500">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-all duration-500 border",
                                            result.status === 'Critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-glow-rose" :
                                                result.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}>
                                            <FlaskConical className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-white text-lg group-hover:text-cyan-400 transition-colors italic tracking-tight">{result.patient_name}</h4>
                                                {result.status === 'Critical' && (
                                                    <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{result.test_name || 'Medical Test'}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">Rank: Normal</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Status</p>
                                            <span className={cn(
                                                "inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500",
                                                result.status === 'Critical' ? "bg-rose-500/20 text-rose-500 border-rose-500/40" :
                                                    result.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {result.status}
                                            </span>
                                        </div>
                                        <div className="hidden lg:block text-right">
                                            <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Date</p>
                                            <p className="text-sm font-black text-white tracking-widest">{result.uploaded_at?.split(' ')[0]}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                onClick={() => toast.info("Opening report details...")}
                                                variant="ghost"
                                                className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest gap-2 text-white/40 hover:bg-white/10 hover:text-white px-6 border border-white/5"
                                            >
                                                Open
                                            </Button>
                                            {(result.status !== 'Approved' && result.status !== 'delivered') && (
                                                <Button
                                                    onClick={() => handleApprove(result.id)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-2xl shadow-glow-emerald border-none"
                                                >
                                                    Sign Off
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center">
                                <p className="text-white/20 font-black uppercase tracking-widest">No reports found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
