import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Clock, UserCheck, Building } from "lucide-react";

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    appointment: any;
}

export default function RescheduleModal({ isOpen, onClose, onSuccess, appointment }: RescheduleModalProps) {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        doctor_id: "",
        branch_id: ""
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                date: appointment.date || "",
                time: appointment.time || "",
                doctor_id: appointment.doctor_id || "",
                branch_id: appointment.branch_id || ""
            });
            fetchDoctors();
        }
    }, [appointment]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/doctors.php`);
            const data = await res.json();
            if (data.success) setDoctors(data.doctors || []);
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/appointments/update.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: appointment.id,
                    ...formData
                }),
            });

            if (response.ok) {
                toast.success("Appointment updated successfully");
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to update appointment");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] glass-light border-white/20 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden dark:bg-slate-900">
                <DialogHeader className="p-8 bg-slate-100/50 dark:bg-slate-950/50 border-b border-white/10">
                    <DialogTitle className="text-2xl font-black flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tighter">
                        <Calendar className="h-6 w-6 text-primary" />
                        Reschedule & Assign
                    </DialogTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">
                        Updating appointment for <span className="text-primary font-black">{appointment?.name}</span>
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white/40 dark:bg-slate-900/40">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 block">New Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    type="date"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 block">New Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    type="time"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 block">Assign Doctor</Label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                <select
                                    className="w-full h-11 pl-10 rounded-xl border border-white/30 bg-white/80 dark:bg-slate-800/80 px-3 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none transition-all shadow-sm"
                                    value={formData.doctor_id}
                                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                                >
                                    <option value="" className="dark:bg-slate-900">Select Doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id} className="dark:bg-slate-900">
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-6 gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-12 px-8 rounded-2xl border-white/20 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 px-12 rounded-2xl flex-1 gradient-primary text-white font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                        >
                            {loading ? "Saving..." : "Update Appointment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
