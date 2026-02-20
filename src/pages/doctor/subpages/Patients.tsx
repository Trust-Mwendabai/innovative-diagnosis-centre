import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    Filter,
    ChevronRight,
    UserCircle2,
    Activity,
    FileText
} from "lucide-react";

export default function DoctorPatients() {
    const [searchQuery, setSearchQuery] = useState("");

    const patients = [
        { id: "PAT-5001", name: "Trust Mwendabai", gender: "Male", age: "28", lastVisit: "2026-02-15", condition: "Post-op Recovery" },
        { id: "PAT-5002", name: "Chileshe Mulenga", gender: "Female", age: "34", lastVisit: "2026-02-10", condition: "Hypertension" },
        { id: "PAT-5003", name: "Sarah Phiri", gender: "Female", age: "42", lastVisit: "2026-02-18", condition: "Diabetes Management" },
        { id: "PAT-5004", name: "John Banda", gender: "Male", age: "50", lastVisit: "2026-02-12", condition: "Annual Checkup" },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic">Clinical Registry</h1>
                <p className="text-white/60 font-bold mt-1">Access patient history, vitals, and diagnostic documentation.</p>
            </div>

            <Card className="glass-card border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                <Users className="h-6 w-6 text-cyan-500" />
                            </div>
                            <CardTitle className="text-2xl font-black text-white italic tracking-tight">Patient Directory</CardTitle>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="PID or Name..."
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
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-white/5">
                        {patients.map((patient) => (
                            <div key={patient.id} className="p-8 hover:bg-white/5 transition-all duration-300 group cursor-pointer border-white/5">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center font-black text-3xl text-white/10 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 border border-white/5 shadow-2xl overflow-hidden relative">
                                        <UserCircle2 className="h-12 w-12" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-white text-xl group-hover:text-cyan-400 transition-colors italic tracking-tight truncate">{patient.name}</h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{patient.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{patient.gender}, {patient.age}yrs</span>
                                        </div>
                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                                                <Activity className="h-3 w-3" /> {patient.condition}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                <FileText className="h-3 w-3" /> Last Visit: {patient.lastVisit}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="rounded-2xl h-10 w-10 p-0 text-white/20 hover:text-cyan-500 hover:bg-cyan-500/10 transition-all border border-white/5">
                                        <ChevronRight className="h-5 w-5" />
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
