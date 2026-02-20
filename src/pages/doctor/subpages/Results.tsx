import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FlaskConical,
    Search,
    Filter,
    ChevronRight,
    FileCheck,
    AlertCircle,
    Download
} from "lucide-react";

export default function DoctorResults() {
    const [searchQuery, setSearchQuery] = useState("");

    const results = [
        { id: "RES-9001", patient: "Trust Mwendabai", test: "Lipid Profile", date: "2026-02-18", status: "Critical", confidence: "98%" },
        { id: "RES-9002", patient: "Chileshe Mulenga", test: "Full Blood Count", date: "2026-02-17", status: "Normal", confidence: "94%" },
        { id: "RES-9003", patient: "Sarah Phiri", test: "HBA1C Monitoring", date: "2026-02-16", status: "Review Required", confidence: "91%" },
        { id: "RES-9004", patient: "John Banda", test: "Liver Function", date: "2026-02-15", status: "Normal", confidence: "96%" },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">Diagnostic Results</h1>
                    <p className="text-white/60 font-bold mt-1">Review, validate and sign off on laboratory diagnostics.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl px-6">
                        <Download className="mr-2 h-4 w-4" /> Export Logs
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-glow-emerald transition-all">
                        <FileCheck className="mr-2 h-4 w-4" /> Batch Sign
                    </Button>
                </div>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight">Analysis Queue</CardTitle>
                        <div className="flex gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="Reference ID..."
                                    className="pl-12 h-12 w-64 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {results.map((res) => (
                            <div key={res.id} className="p-8 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-all duration-500 border",
                                        res.status === 'Critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-glow-rose" :
                                            res.status === 'Normal' ? "bg-white/5 text-white/10 border-white/5 group-hover:bg-cyan-500 group-hover:text-white" :
                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        <FlaskConical className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-white text-lg group-hover:text-cyan-400 transition-colors italic tracking-tight">{res.patient}</h4>
                                            {res.status === 'Critical' && (
                                                <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{res.test}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">Confidence: {res.confidence}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Status</p>
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500",
                                            res.status === 'Critical' ? "bg-rose-500/20 text-rose-500 border-rose-500/40" :
                                                res.status === 'Normal' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}>
                                            {res.status}
                                        </span>
                                    </div>
                                    <div className="hidden lg:block text-right">
                                        <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Generated</p>
                                        <p className="text-sm font-black text-white tracking-widest">{res.date}</p>
                                    </div>
                                    <Button variant="ghost" className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest gap-2 text-white/40 hover:bg-white/10 hover:text-white px-8 border border-white/5">
                                        Review <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
