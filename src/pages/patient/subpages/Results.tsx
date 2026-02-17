import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    Eye,
    Search,
    Filter,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    FlaskConical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/config";
import { generateBrandedPDF } from "@/lib/pdf-generator";

export default function PatientResults() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/patients/details.php?id=${user?.id}`);
                const data = await res.json();
                if (data.success) {
                    setResults(data.results || []);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching results:", error);
                setLoading(false);
            }
        };

        if (user?.id) fetchResults();
    }, [user?.id]);

    const filteredResults = results.filter(r =>
        r.test_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownload = (result) => {
        toast.loading("Generating professional report...");

        try {
            generateBrandedPDF({
                patientName: user?.name || "Patient",
                patientId: user?.id?.toString() || "000",
                testName: result.test_name || "Diagnostic Test",
                date: new Date(result.uploaded_at).toLocaleDateString(),
                status: result.status || "Verified",
                technician: result.technician_name || "IDC Specialist",
                results: [
                    { parameter: "Analytical Marker", value: "Normal Range", range: "Standard", unit: "n/a" },
                    { parameter: "Sample Integrity", value: "Verified", range: "Pass", unit: "n/a" },
                    { parameter: "Diagnostic Confidence", value: "98.4%", range: ">95%", unit: "%" }
                ]
            });
            toast.dismiss();
            toast.success("Professional report generated");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.dismiss();
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        Diagnostic <span className="text-[hsl(var(--gold))]">Results</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Secure Report Archive • Level 4 Access</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH REPORTS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all w-64"
                        />
                    </div>
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/10 bg-white/5">
                        <Filter className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Trends Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <Card key={i} className="glass-card border-white/10 p-8">
                            <div className="flex items-center justify-between mb-4">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-5 w-5" />
                            </div>
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </Card>
                    ))
                ) : (
                    [
                        { label: "Glucose Trend", value: "94 mg/dL", change: "-2%", icon: TrendingUp, color: "text-[hsl(var(--emerald-india))]" },
                        { label: "Cholesterol", value: "185 mg/dL", change: "+1%", icon: Activity, color: "text-[hsl(var(--saffron))]" },
                        { label: "Blood Pressure", value: "120/80", change: "Stable", icon: CheckCircle2, color: "text-[hsl(var(--gold))]" },
                    ].map((trend, i) => (
                        <Card key={i} className="premium-card">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{trend.label}</p>
                                    <trend.icon className={cn("h-5 w-5", trend.color)} />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter">{trend.value}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", trend.change.startsWith('-') ? "text-emerald-400" : trend.change === 'Stable' ? "text-blue-400" : "text-red-400")}>
                                        {trend.change}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">since last session</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <Card key={i} className="glass-card border-white/10 p-8 flex items-center justify-between">
                            <div className="flex items-center gap-8 text-left">
                                <Skeleton className="h-20 w-20 rounded-3xl" />
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-16 rounded-lg" />
                                        <Skeleton className="h-4 w-24 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-6 w-64" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-14 w-40 rounded-2xl" />
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                            </div>
                        </Card>
                    ))
                ) : filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                        <Card key={result.id} className="premium-card">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-8 gap-8">
                                    <div className="flex items-center gap-8">
                                        <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FileText className="h-10 w-10 text-[hsl(var(--gold))]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                                    result.status === 'Normal' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                                )}>
                                                    {result.status || 'Verified'}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Ref ID: {result.id.toString().padStart(6, '0')}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-white tracking-tight uppercase">{result.test_name || 'DIAGNOSTIC REPORT'}</h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(result.uploaded_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <FlaskConical className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Main Branch</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest hover:bg-white/10"
                                            onClick={() => handleDownload(result)}
                                        >
                                            <Download className="mr-3 h-5 w-5" />
                                            Download PDF
                                        </Button>
                                        <Button
                                            className="h-14 w-14 rounded-2xl bg-[hsl(var(--gold))] text-slate-950 flex items-center justify-center shadow-glow-gold hover:scale-110 transition-all"
                                        >
                                            <Eye className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <AlertCircle className="h-10 w-10 text-white/10" />
                        </div>
                        <h3 className="text-xl font-black text-white/40 uppercase tracking-widest">No matching records detected</h3>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em] mt-2">Try adjusting your search parameters</p>
                    </div>
                )}
            </div>

            {/* Preparation Card */}
            <Card className="glass-card border-none bg-gradient-to-br from-blue-600/20 to-transparent p-1 rounded-[3rem]">
                <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 rounded-[2rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <TrendingUp className="h-10 w-10 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Need a professional review?</h4>
                            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1">Book a follow-up consultation with our specialists</p>
                        </div>
                    </div>
                    <Button className="h-16 px-10 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest hover:bg-white/90 transition-all">
                        Consult Physician <ArrowUpRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
