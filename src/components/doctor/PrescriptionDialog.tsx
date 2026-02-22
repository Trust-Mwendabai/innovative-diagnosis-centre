import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import { Pill, ClipboardList, Calendar } from "lucide-react";

interface PrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patientId: number;
    patientName: string;
    onSuccess?: () => void;
}

export function PrescriptionDialog({ open, onOpenChange, patientId, patientName, onSuccess }: PrescriptionDialogProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medication: "",
        dosage: "",
        instructions: "",
        date_prescribed: new Date().toISOString().split("T")[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/prescriptions/create.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctor_id: user.id,
                    patient_id: patientId,
                    ...formData
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Prescription generated successfully");
                onOpenChange(false);
                setFormData({ medication: "", dosage: "", instructions: "", date_prescribed: new Date().toISOString().split("T")[0] });
                onSuccess?.();
            } else {
                toast.error(data.message || "Failed to generate prescription");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card border-white/10 text-white max-w-md rounded-[2.5rem] overflow-hidden p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 pointer-events-none" />

                <DialogHeader className="p-8 border-b border-white/5 relative bg-slate-900/40">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                        <Pill className="h-6 w-6 text-cyan-400 shadow-glow-cyan" />
                        Generate <span className="text-cyan-400">Prescription</span>
                    </DialogTitle>
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mt-2">Patient: {patientName} (#{patientId})</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Medication Name</Label>
                        <div className="relative group">
                            <Pill className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                            <Input
                                required
                                value={formData.medication}
                                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                                className="bg-slate-950/50 border-white/10 pl-12 h-12 rounded-xl focus:border-cyan-500/50 transition-all font-bold"
                                placeholder="e.g. Amoxicillin 500mg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Dosage / Frequency</Label>
                        <div className="relative group">
                            <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                            <Input
                                required
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                className="bg-slate-950/50 border-white/10 pl-12 h-12 rounded-xl focus:border-cyan-500/50 transition-all font-bold"
                                placeholder="e.g. 1 tablet every 8 hours"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Date Prescribed</Label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                            <Input
                                type="date"
                                required
                                value={formData.date_prescribed}
                                onChange={(e) => setFormData({ ...formData, date_prescribed: e.target.value })}
                                className="bg-slate-950/50 border-white/10 pl-12 h-12 rounded-xl focus:border-cyan-500/50 transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Special Instructions</Label>
                        <Textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            className="bg-slate-950/50 border-white/10 min-h-[100px] rounded-xl focus:border-cyan-500/50 transition-all font-bold p-4"
                            placeholder="Take after meals, avoid alcohol..."
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-glow-cyan"
                        >
                            {loading ? "Processing..." : "Authorize Prescription"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
