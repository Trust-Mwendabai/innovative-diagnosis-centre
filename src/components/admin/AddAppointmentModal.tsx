import { useState } from "react";
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
import { User, Phone, Mail, Calendar, Clock, MapPin } from "lucide-react";

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAppointmentModal({ isOpen, onClose, onSuccess }: AddAppointmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        location_type: "branch"
    });

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
                    location_type: "branch"
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
            <DialogContent className="sm:max-w-[500px] glass border-white/20 shadow-2xl rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="p-8 bg-primary/5 border-b border-white/10">
                    <DialogTitle className="text-2xl font-bold gradient-text">New Appointment</DialogTitle>
                    <p className="text-sm text-muted-foreground">Register a patient for a diagnostic test.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Patient Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="name"
                                    required
                                    className="pl-10 glass-input"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="pl-10 glass-input"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="phone"
                                    required
                                    className="pl-10 glass-input"
                                    placeholder="+260..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="date"
                                    type="date"
                                    required
                                    className="pl-10 glass-input"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="time"
                                    type="time"
                                    required
                                    className="pl-10 glass-input"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location Type</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, location_type: "branch" })}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.location_type === "branch"
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                        : "bg-white/50 border-white/20 text-muted-foreground hover:bg-white"
                                        }`}
                                >
                                    <MapPin className="h-4 w-4" /> Branch
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, location_type: "home" })}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.location_type === "home"
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                        : "bg-white/50 border-white/20 text-muted-foreground hover:bg-white"
                                        }`}
                                >
                                    <MapPin className="h-4 w-4" /> Home
                                </button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="outline" type="button" onClick={onClose} disabled={loading} className="py-6 px-8 rounded-2xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="py-6 px-12 rounded-2xl gradient-primary shadow-lg shadow-primary/20">
                            {loading ? "Creating..." : "Create Appointment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
