import { useState } from "react";
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
    History
} from "lucide-react";

export default function DoctorPrescriptions() {
    const [searchQuery, setSearchQuery] = useState("");

    const prescriptions = [
        { id: "PRC-8001", patient: "Trust Mwendabai", medication: "Amoxicillin 500mg", dosage: "3x Daily", duration: "7 Days", date: "2026-02-19" },
        { id: "PRC-8002", patient: "Chileshe Mulenga", medication: "Lisinopril 10mg", dosage: "1x Daily", duration: "30 Days", date: "2026-02-15" },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">Prescriptions</h1>
                    <p className="text-white/60 font-bold mt-1">Manage medical orders and patient treatment plans.</p>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-glow-cyan transition-all">
                    <Plus className="mr-2 h-4 w-4" /> New Prescription
                </Button>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight">Active Orders</CardTitle>
                        <div className="flex gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="Patient name..."
                                    className="pl-12 h-12 w-64 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {prescriptions.map((prc) => (
                            <div key={prc.id} className="p-8 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center font-black text-2xl text-white/10 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 border border-white/5">
                                        <Pill className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg group-hover:text-cyan-400 transition-colors italic tracking-tight">{prc.patient}</h4>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-[10px] font-black text-cyan-500/80 uppercase tracking-widest">{prc.medication}</p>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{prc.dosage} • {prc.duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Issued</p>
                                        <p className="text-sm font-black text-white tracking-widest">{prc.date}</p>
                                    </div>
                                    <Button variant="ghost" className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest gap-2 text-white/40 hover:bg-white/10 hover:text-white px-6 border border-white/5">
                                        View History <History className="h-4 w-4" />
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
