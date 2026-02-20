import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Users,
    Search,
    Filter,
    ChevronRight,
    UserCircle2,
    Activity,
    FileText
} from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function DoctorPatients() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/patients/read.php`);
                const data = await res.json();
                if (data.success) {
                    setPatients(data.patients);
                }
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id?.toString().includes(searchQuery)
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">My Patients</h1>
                <p className="text-white/60 font-medium mt-1">Check on all your patients and their history.</p>
            </div>

            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8 border-b border-white/5 bg-slate-800/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Users className="h-6 w-6 text-cyan-500" />
                            <CardTitle className="text-white font-black uppercase tracking-widest text-xs">Patient List</CardTitle>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                                <Input
                                    placeholder="Search by name..."
                                    className="bg-slate-950/50 border-white/5 pl-12 h-12 text-white placeholder:text-white/10 rounded-2xl focus:border-cyan-500/50 transition-all font-bold"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => toast.info("Search filters coming soon")}
                                variant="outline"
                                className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-white/5">
                        {loading ? (
                            <div className="col-span-2 p-20 text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-white/20 font-black uppercase tracking-widest">Finding patients...</p>
                            </div>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <div key={patient.id} className="p-8 hover:bg-white/5 transition-all duration-300 group cursor-pointer border-white/5">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center font-black text-3xl text-white/10 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 border border-white/5 shadow-2xl overflow-hidden relative">
                                            <UserCircle2 className="h-12 w-12" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-white text-xl group-hover:text-cyan-400 transition-colors italic tracking-tight truncate">{patient.name}</h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">#{patient.id}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">{patient.gender} • {patient.age || 'N/A'}yrs</span>
                                            </div>
                                            <div className="mt-6 space-y-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/60">
                                                    <Activity className="h-3 w-3" /> Patient Case: Routine
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                    <FileText className="h-3 w-3" /> Last Visit: {patient.lastVisit || 'Today'}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => navigate('/doctor/results')}
                                            variant="ghost"
                                            className="rounded-2xl h-10 w-10 p-0 text-white/20 hover:text-cyan-500 hover:bg-cyan-500/10 transition-all border border-white/5"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 p-20 text-center">
                                <p className="text-white/20 font-black uppercase tracking-widest">No patients found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
