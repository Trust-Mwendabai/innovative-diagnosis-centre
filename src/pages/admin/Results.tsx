import { useState, useEffect } from "react";
import {
    FileCheck,
    Search,
    Upload,
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    User,
    Calendar,
    Filter,
    ArrowRight,
    ShieldCheck,
    FileText,
    AlertCircle,
    MoreVertical,
    Download,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

interface TestResult {
    id: string;
    appointment_id: string;
    patient_name: string;
    test_name: string;
    appointment_date: string;
    result_pdf: string;
    status: string;
    uploaded_at: string;
    technician_name: string;
    comments?: string;
}

export default function Results() {
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("pending");

    // Upload and Verify states
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
    const [appointments, setAppointments] = useState<any[]>([]);

    const [uploadForm, setUploadForm] = useState({
        appointment_id: "",
        patient_id: "",
        file: null as File | null
    });

    const [verifyForm, setVerifyForm] = useState({
        status: "verified",
        comments: ""
    });

    useEffect(() => {
        fetchResults();
        fetchAppointmentsForUpload();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/results/read.php`);
            const data = await res.json();
            if (data.success) setResults(data.results);
        } catch (error) {
            toast.error("Error fetching results");
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointmentsForUpload = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/appointments/read.php`);
            const data = await res.json();
            if (data.success) {
                // Only show confirmed or pending for upload? 
                // Actually, only confirmed/pending that don't have results yet.
                setAppointments(data.appointments.filter((a: any) => a.status !== 'cancelled' && a.status !== 'completed'));
            }
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.file || !uploadForm.appointment_id) return;

        const formData = new FormData();
        formData.append("report", uploadForm.file);
        formData.append("appointment_id", uploadForm.appointment_id);

        // Find patient_id from appointments list
        const apt = appointments.find(a => a.id === uploadForm.appointment_id);
        if (apt) formData.append("patient_id", apt.patient_id);

        try {
            const response = await fetch(`${API_BASE_URL}/results/upload.php`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Result uploaded successfully");
                setIsUploadOpen(false);
                setUploadForm({ appointment_id: "", patient_id: "", file: null });
                fetchResults();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Upload failed");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedResult) return;

        try {
            const response = await fetch(`${API_BASE_URL}/results/verify.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedResult.id, ...verifyForm }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(`Result ${verifyForm.status}`);
                setIsVerifyOpen(false);
                fetchResults();
            }
        } catch (error) {
            toast.error("Verification failed");
        }
    };

    const filtered = results.filter(r => {
        const matchesStatus = activeTab === "all" || r.status === activeTab;
        const matchesSearch = r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
            r.test_name?.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Results Center</h1>
                    <p className="text-slate-400 font-medium">Verify lab reports and manage technician uploads.</p>
                </div>
                <Button className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20" onClick={() => setIsUploadOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-light border-white/5 shadow-premium p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Pending Verification</p>
                            <p className="text-2xl font-black text-white">{results.filter(r => r.status === 'pending').length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="glass-light border-white/5 shadow-premium p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Verified Today</p>
                            <p className="text-2xl font-black text-white">{results.filter(r => r.status === 'verified').length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="glass-light border-white/5 shadow-premium p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Reports</p>
                            <p className="text-2xl font-black text-white">{results.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="pending" onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-800/40 border border-white/5 p-1 h-14 rounded-2xl mb-8">
                    <TabsTrigger value="pending" className="rounded-xl px-8 h-full font-bold flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-slate-400 hover:text-white transition-colors">
                        Pending <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[10px]">{results.filter(r => r.status === 'pending').length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="verified" className="rounded-xl px-8 h-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white text-slate-400 hover:text-white transition-colors">Verified</TabsTrigger>
                    <TabsTrigger value="all" className="rounded-xl px-8 h-full font-bold data-[state=active]:bg-primary data-[state=active]:text-white text-slate-400 hover:text-white transition-colors">All History</TabsTrigger>
                </TabsList>

                <Card className="glass-light border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-xl font-black text-white">Lab Reports Queue</CardTitle>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase text-emerald-500">
                                    <Activity className="h-3 w-3" /> Live
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search patient or test..."
                                    className="pl-9 w-full sm:w-80 bg-slate-900/50 border-white/10 focus:bg-slate-900 text-white h-11 rounded-xl placeholder:text-slate-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="py-32 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-slate-400 font-bold animate-pulse">Decrypting Medical Data...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-32 bg-white/5">
                                <AlertCircle className="w-20 h-20 text-slate-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white">Clear Workspace</h3>
                                <p className="text-slate-400 font-medium">No results matching the current criteria.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="py-6 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">Patient & Test</TableHead>
                                            <TableHead className="py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Uploaded By</TableHead>
                                            <TableHead className="py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Reference</TableHead>
                                            <TableHead className="py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
                                            <TableHead className="py-6 px-8 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Management</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((r) => (
                                            <TableRow key={r.id} className="group hover:bg-white/5 transition-colors border-white/5">
                                                <TableCell className="py-6 px-8">
                                                    <div>
                                                        <div className="font-black text-white group-hover:text-primary transition-colors text-base">{r.patient_name}</div>
                                                        <div className="text-xs text-slate-500 font-bold whitespace-nowrap">{r.test_name || 'General Diagnostic'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white border border-slate-700">
                                                            {r.technician_name?.charAt(0) || 'T'}
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-300">{r.technician_name || 'System Tech'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6">
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5 text-blue-500" /> {r.appointment_date}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase">APT-ID: {r.appointment_id}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6">
                                                    <span className={cn(
                                                        "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                                        r.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            r.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                                'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                                    )}>
                                                        {r.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-primary hover:bg-primary/10 rounded-xl" title="View PDF">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {r.status === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-9 w-9 p-0 text-emerald-500 hover:bg-emerald-500/10 rounded-xl"
                                                                onClick={() => { setSelectedResult(r); setIsVerifyOpen(true); }}
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Tabs>

            {/* Upload Modal */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-xl bg-slate-900 border-slate-700 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-slate-800/50 border-b border-slate-700">
                        <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
                            <Upload className="h-6 w-6 text-primary" /> Upload Lab Report
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Appointment</Label>
                            <select
                                className="w-full h-12 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                value={uploadForm.appointment_id}
                                onChange={(e) => setUploadForm({ ...uploadForm, appointment_id: e.target.value })}
                                required
                            >
                                <option value="" className="text-slate-400">Choose Pending Appointment</option>
                                {appointments.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} - {a.date} (#{a.id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Report Document (PDF/JPG/PNG)</Label>
                            <div className="border-2 border-dashed border-slate-700 rounded-[2rem] p-12 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all group relative bg-slate-800/20">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                                />
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors border border-slate-700">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <span className="font-bold">{uploadForm.file ? uploadForm.file.name : "Click to select or drag and drop"}</span>
                                <p className="text-[10px] text-slate-500 mt-2">Maximum file size: 10MB</p>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-3 border-t border-slate-800">
                            <Button type="button" variant="ghost" className="py-6 px-10 rounded-2xl font-bold text-slate-400 hover:text-white" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                            <Button type="submit" className="flex-1 py-7 rounded-2xl gradient-primary shadow-xl shadow-primary/20 text-lg font-black text-white" disabled={!uploadForm.file}>
                                Submit For Verification
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Verify Modal */}
            <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
                <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-emerald-500/10 border-b border-emerald-500/10">
                        <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-emerald-500" /> Result Verification
                        </DialogTitle>
                        <p className="text-sm text-slate-400 font-medium">Reviewing report for <span className="font-black text-white">{selectedResult?.patient_name}</span></p>
                    </DialogHeader>
                    <form onSubmit={handleVerify} className="p-8 space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Decision*</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className={cn(
                                            "py-4 rounded-2xl border-2 font-black flex items-center justify-center gap-2 transition-all",
                                            verifyForm.status === 'verified' ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                                        )}
                                        onClick={() => setVerifyForm({ ...verifyForm, status: 'verified' })}
                                    >
                                        <CheckCircle className="h-4 w-4" /> Approve
                                    </button>
                                    <button
                                        type="button"
                                        className={cn(
                                            "py-4 rounded-2xl border-2 font-black flex items-center justify-center gap-2 transition-all",
                                            verifyForm.status === 'rejected' ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                                        )}
                                        onClick={() => setVerifyForm({ ...verifyForm, status: 'rejected' })}
                                    >
                                        <XCircle className="h-4 w-4" /> Reject
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Internal Comments</Label>
                                <textarea
                                    className="w-full min-h-[120px] rounded-2xl border border-slate-700 bg-slate-800 p-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-500"
                                    placeholder="Add notes for the medical team..."
                                    value={verifyForm.comments}
                                    onChange={(e) => setVerifyForm({ ...verifyForm, comments: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-3 border-t border-slate-800">
                            <Button type="button" variant="ghost" className="py-6 px-10 rounded-2xl font-bold text-slate-400 hover:text-white" onClick={() => setIsVerifyOpen(false)}>Back</Button>
                            <Button type="submit" className={cn(
                                "flex-1 py-7 rounded-2xl shadow-xl text-lg font-black text-white",
                                verifyForm.status === 'verified' ? "gradient-primary shadow-primary/20" : "bg-slate-800 text-white shadow-slate-900/20"
                            )}>
                                Confirm Action
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
