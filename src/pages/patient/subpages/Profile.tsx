import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Key,
    Bell,
    Save,
    Camera,
    CreditCard,
    Fingerprint,
    CheckCircle2,
    Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/config";

export default function PatientProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        blood_group: "",
        weight: "",
        height: ""
    });

    // To restore original data if user cancels edit
    const [originalData, setOriginalData] = useState({ ...formData });

    React.useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                setProfileLoading(false);
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/patients/details.php?id=${user.id}`);
                const data = await res.json();
                if (data.success) {
                    const p = data.patient;
                    const newData = {
                        name: p.name || "",
                        email: p.email || "",
                        phone: p.phone || "",
                        address: p.address || "",
                        dob: p.dob || "",
                        gender: p.gender || "",
                        blood_group: p.blood_group || "",
                        weight: p.weight || "",
                        height: p.height || ""
                    };
                    setFormData(newData);
                    setOriginalData(newData);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile details");
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, [user?.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/patients/update.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user?.id,
                    ...formData
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile updated successfully");
                setOriginalData({ ...formData });
                setIsEditMode(false);
            } else {
                toast.error(data.message || "Could not update profile");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ ...originalData });
        setIsEditMode(false);
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black font-heading tracking-tighter">
                        My <span className="text-[hsl(var(--gold))]">Profile</span>
                    </h1>
                    <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">View and update your personal information</p>
                </div>
                {!isEditMode && !profileLoading && (
                    <Button
                        onClick={() => setIsEditMode(true)}
                        className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] transition-all"
                    >
                        <User className="mr-3 h-4 w-4 text-[hsl(var(--gold))]" />
                        Edit Profile
                    </Button>
                )}
            </div>

            <div className="max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card border-white/10 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-white/5 bg-white/5 relative">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative group">
                                    <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] flex items-center justify-center border-4 border-slate-950 shadow-glow-gold">
                                        <User className="h-12 w-12 text-slate-950" />
                                    </div>
                                    {isEditMode && (
                                        <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center hover:scale-110 transition-all border-4 border-slate-950">
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="text-center md:text-left">
                                    {profileLoading ? (
                                        <div className="space-y-3">
                                            <Skeleton className="h-8 w-48" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{formData.name || "Patient Name"}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                                <p className="text-[10px] font-black text-[hsl(var(--gold))] uppercase tracking-[0.3em]">
                                                    ID: IDC-{user?.id?.toString().padStart(6, '0') || "XXXXXX"}
                                                </p>
                                                <div className="h-1 w-1 rounded-full bg-white/20 hidden md:block" />
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                                    {isEditMode ? "Editing Mode" : "View Mode"}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                        {profileLoading ? (
                                            <Skeleton className="w-full h-16 rounded-2xl" />
                                        ) : isEditMode ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center pl-14 pr-6 rounded-2xl border border-transparent">
                                                <span className="text-sm font-black uppercase tracking-widest text-white">{formData.name || "Not set"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                        {profileLoading ? (
                                            <Skeleton className="w-full h-16 rounded-2xl" />
                                        ) : isEditMode ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="yourname@example.com"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center pl-14 pr-6 rounded-2xl border border-transparent">
                                                <span className="text-sm font-black uppercase tracking-widest text-white">{formData.email || "Not set"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                        {profileLoading ? (
                                            <Skeleton className="w-full h-16 rounded-2xl" />
                                        ) : isEditMode ? (
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="+260 XXX XXX XXX"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center pl-14 pr-6 rounded-2xl border border-transparent">
                                                <span className="text-sm font-black uppercase tracking-widest text-white">{formData.phone || "Not set"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Residential Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                        {profileLoading ? (
                                            <Skeleton className="w-full h-16 rounded-2xl" />
                                        ) : isEditMode ? (
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="Enter your home address"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center pl-14 pr-6 rounded-2xl border border-transparent">
                                                <span className="text-sm font-black uppercase tracking-widest text-white">{formData.address || "Not set"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* DOB & Gender */}
                                <div className="grid grid-cols-2 gap-8 md:col-span-2">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                            {isEditMode ? (
                                                <input
                                                    type="date"
                                                    value={formData.dob}
                                                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all [color-scheme:dark]"
                                                />
                                            ) : (
                                                <div className="w-full h-16 bg-white/2 flex items-center pl-14 pr-6 rounded-2xl border border-transparent">
                                                    <span className="text-sm font-black uppercase tracking-widest text-white">{formData.dob || "Not set"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Gender</label>
                                        <div className="relative">
                                            <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                            {isEditMode ? (
                                                <select
                                                    value={formData.gender}
                                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all appearance-none"
                                                >
                                                    <option value="" className="bg-slate-900">Select Gender</option>
                                                    <option value="male" className="bg-slate-900">Male</option>
                                                    <option value="female" className="bg-slate-900">Female</option>
                                                    <option value="other" className="bg-slate-900">Other</option>
                                                </select>
                                            ) : (
                                                <div className="w-full h-16 bg-white/2 flex items-center pl-14 pr-6 rounded-2xl border border-transparent">
                                                    <span className="text-sm font-black uppercase tracking-widest text-white capitalize">{formData.gender || "Not set"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Health Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:col-span-2 pt-4">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Blood Group</label>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={formData.blood_group}
                                                onChange={e => setFormData({ ...formData, blood_group: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="e.g. O+"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center justify-center rounded-2xl border border-transparent">
                                                <span className="text-sm font-black text-[hsl(var(--gold))]">{formData.blood_group || "--"}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Weight (kg)</label>
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={formData.weight}
                                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="0.0"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center justify-center rounded-2xl border border-transparent">
                                                <span className="text-sm font-black text-white">{formData.weight ? `${formData.weight} kg` : "--"}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Height (cm)</label>
                                        {isEditMode ? (
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={formData.height}
                                                onChange={e => setFormData({ ...formData, height: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                placeholder="0.0"
                                            />
                                        ) : (
                                            <div className="w-full h-16 bg-white/2 flex items-center justify-center rounded-2xl border border-transparent">
                                                <span className="text-sm font-black text-white">{formData.height ? `${formData.height} cm` : "--"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                {isEditMode && (
                                    <div className="md:col-span-2 pt-8 flex flex-col md:flex-row justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="h-16 px-12 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-slate-950 font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all"
                                        >
                                            {loading ? "Updating..." : "Save Changes"} <Save className="ml-3 h-5 w-5" />
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
