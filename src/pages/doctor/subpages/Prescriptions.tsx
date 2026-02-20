import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ClipboardList,
    Search,
    Plus,
    ChevronRight,
    User,
    Pill,
    History,
    ExternalLink,
    Filter
} from "lucide-react";

import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";

export default function DoctorPrescriptions() {
    const [searchQuery, setSearchQuery] = useState("");
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/prescriptions/read.php`);
                const data = await res.json();
                if (data.success) {
                    setPrescriptions(data.prescriptions);
                }
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    const filteredPrescriptions = prescriptions.filter(rx =>
        rx.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.id?.toString().includes(searchQuery) ||
        rx.medication?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">Medicine List</h1>
                    <p className="text-white/60 font-medium mt-1">Manage what medicines your patients are taking.</p>
                </div>
                <Button
                    onClick={() => toast.info("New medicine tool coming soon")}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-glow-cyan transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Give New Medicine
                </Button>
            </div>

            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8 border-b border-white/5 bg-slate-800/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-cyan-500" /> Latest Medicines
                        </CardTitle>
                        <div className="flex gap-3">
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="Search by patient name..."
                                    className="bg-slate-950/50 border-white/5 pl-12 h-12 text-white placeholder:text-white/10 rounded-2xl focus:border-cyan-500/50 transition-all font-bold"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => toast.info("Filter options coming soon")}
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
                                <p className="text-white/20 font-black uppercase tracking-widest">Finding medicines...</p>
                            </div>
                        ) : filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map((rx) => (
                                <div key={rx.id} className="p-8 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center font-black text-2xl text-white/10 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 border border-white/5">
                                            <Pill className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white text-lg group-hover:text-cyan-400 transition-colors italic tracking-tight">{rx.patient_name}</h4>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-[10px] font-black text-cyan-500/80 uppercase tracking-widest">{rx.medication}</p>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">How to take: {rx.dosage}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Date Given</p>
                                            <p className="text-sm font-black text-white tracking-widest">{rx.created_at?.split(' ')[0]}</p>
                                        </div>
                                        <Button
                                            onClick={() => toast.info(`Preparing print copy for #${rx.id}...`)}
                                            variant="ghost"
                                            className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest gap-2 text-white/40 hover:bg-white/10 hover:text-white px-6 border border-white/5"
                                        >
                                            Print <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center">
                                <p className="text-white/20 font-black uppercase tracking-widest">No medicines found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
