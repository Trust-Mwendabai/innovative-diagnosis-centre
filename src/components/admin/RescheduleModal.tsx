import { useState, useEffect } from "react";
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
    const [staff, setStaff] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        staff_id: "",
        branch_id: ""
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                date: appointment.date || "",
                time: appointment.time || "",
                staff_id: appointment.staff_id || "",
                branch_id: appointment.branch_id || ""
            });
            fetchStaff();
        }
    }, [appointment]);

    const fetchStaff = async () => {
        try {
            const res = await fetch("http://localhost/IDC/api/staff/read.php");
            const data = await res.json();
            if (data.success) setStaff(data.staff);
        } catch (error) {
            console.error("Error fetching staff", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost/IDC/api/appointments/update.php", {
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
            <DialogContent className="sm:max-w-[450px] glass border-white/20 shadow-2xl rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="p-8 bg-blue-500/5 border-b border-white/10">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-primary" />
                        Reschedule & Assign
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Updating appointment for <span className="font-bold text-slate-900">{appointment?.name}</span>
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    type="date"
                                    required
                                    className="pl-10 glass-input"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    type="time"
                                    required
                                    className="pl-10 glass-input"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Assign Staff / Technician</Label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <select
                                    className="w-full h-11 pl-10 rounded-xl border border-white/20 bg-white/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    value={formData.staff_id}
                                    onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                                >
                                    <option value="">Select Personnel</option>
                                    {staff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading} className="py-6 px-8 rounded-2xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="py-6 px-12 rounded-2xl flex-1 gradient-primary shadow-lg shadow-primary/20">
                            {loading ? "Saving..." : "Update Appointment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
