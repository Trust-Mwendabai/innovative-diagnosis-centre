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
import { User, Phone, Mail, Calendar, Clock, MapPin, Stethoscope } from "lucide-react";

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAppointmentModal({ isOpen, onClose, onSuccess }: AddAppointmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<{ id: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        location_type: "branch",
        doctor_id: ""
    });

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/doctors.php`);
            const data = await res.json();
            if (data.success) {
                setDoctors(data.doctors || []);
            }
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/appointments/create.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Appointment created successfully");
                onSuccess();
                onClose();
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    date: "",
                    time: "",
                    location_type: "branch",
                    doctor_id: ""
                });
            } else {
                toast.error("Failed to create appointment");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] glass-light border-white/20 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden dark:bg-slate-900">
                <DialogHeader className="p-8 bg-slate-100/50 dark:bg-slate-950/50 border-b border-white/10">
                    <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Appointment</DialogTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Register a patient for a diagnostic test.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white/40 dark:bg-slate-900/40">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Patient Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="name"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="phone"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="+260..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="date"
                                    type="date"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="time"
                                    type="time"
                                    required
                                    className="pl-10 h-11 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="doctor_id" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Assign Doctor (Optional)</Label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                <select
                                    id="doctor_id"
                                    className="w-full h-11 pl-10 bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-900 dark:text-white rounded-xl font-black focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                                    value={formData.doctor_id}
                                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                                >
                                    <option value="">Auto-Assign (Least Busy)</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold italic">Leave blank for automatic assignment based on availability.</p>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-2">Location Type</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, location_type: "branch" })}
                                    className={`flex items-center justify-center gap-2 h-12 rounded-xl border transition-all font-black text-xs tracking-widest uppercase ${formData.location_type === "branch"
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                        : "bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                                        }`}
                                >
                                    <MapPin className="h-4 w-4" /> Branch
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, location_type: "home" })}
                                    className={`flex items-center justify-center gap-2 h-12 rounded-xl border transition-all font-black text-xs tracking-widest uppercase ${formData.location_type === "home"
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                        : "bg-white/80 dark:bg-slate-800/80 border-white/30 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                                        }`}
                                >
                                    <MapPin className="h-4 w-4" /> Home
                                </button>
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
                            {loading ? "Creating..." : "Create Appointment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
