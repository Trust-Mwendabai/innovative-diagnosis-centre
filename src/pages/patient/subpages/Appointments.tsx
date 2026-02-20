import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    FlaskConical,
    Home,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/config";
import { History } from "lucide-react";

const steps = ["Select Test", "Location & Type", "Schedule"];

export default function PatientAppointments() {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [tests, setTests] = useState([]);
    const [packages, setPackages] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingHistory, setBookingHistory] = useState([]);

    // Booking Form State
    const [selectedTest, setSelectedTest] = useState(null);
    const [locationType, setLocationType] = useState('branch');
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const [testsRes, packagesRes, branchesRes, summaryRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/tests/read.php`),
                    fetch(`${API_BASE_URL}/packages/read.php`),
                    fetch(`${API_BASE_URL}/branches/read.php`),
                    fetch(`${API_BASE_URL}/patients/summary.php?id=${user?.id}`)
                ]);

                const [testsData, packagesData, branchesData, summaryData] = await Promise.all([
                    testsRes.json().catch(() => ({ success: false, tests: [] })),
                    packagesRes.json().catch(() => ({ success: false, packages: [] })),
                    branchesRes.json().catch(() => ({ success: false, branches: [] })),
                    summaryRes.json().catch(() => ({ success: false, recent_bookings: [] }))
                ]);

                if (testsData.success) setTests(testsData.tests);
                if (packagesData.success) setPackages(packagesData.packages);
                if (branchesData.success) setBranches(branchesData.branches);
                if (summaryData.success) setBookingHistory(summaryData.recent_bookings);

                if (!testsData.success && !packagesData.success && !branchesData.success && !summaryData.success) {
                    toast.error("Unable to connect to service. Please try again later.");
                }

                setLoading(false);
            } catch (error) {
                console.error("Critical error fetching appointments data:", error);
                toast.error("Failed to load appointments. Please check your connection.");
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const handleBooking = async () => {
        if (!selectedTest || !selectedDate || !selectedTime || (locationType === 'branch' && !selectedBranch)) {
            toast.error("Please complete all fields");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/appointments/create.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patient_id: user?.id,
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    test_id: selectedTest.id,
                    branch_id: locationType === 'branch' ? selectedBranch.id : null,
                    date: selectedDate,
                    time: selectedTime,
                    location_type: locationType,
                    status: 'pending'
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Appointment booked successfully!");
                setCurrentStep(0);
                // Refresh history
                const historyRes = await fetch(`${API_BASE_URL}/patients/details.php?id=${user?.id}`);
                const historyData = await historyRes.json();
                if (historyData.success) setBookingHistory(historyData.history);
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch (error) {
            toast.error("Server error. Please try again.");
        }
    };

    const nextStep = () => {
        if (currentStep === 0 && !selectedTest) {
            toast.error("Please select a test or package first");
            return;
        }
        if (currentStep === 1 && locationType === 'branch' && !selectedBranch) {
            toast.error("Please select a branch");
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white pt-4">
            {/* Page Header */}
            <div>
                <h1 className="text-5xl font-black font-heading tracking-tighter">
                    My <span className="text-[hsl(var(--gold))]">Appointments</span>
                </h1>
                <p className="text-white/40 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">Book a new test or view your schedule</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Main Booking Wizard */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="glass-card border-white/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    {steps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                                                i <= currentStep ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold" : "bg-white/5 text-white/20 border border-white/5"
                                            )}>
                                                {i + 1}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest hidden sm:inline",
                                                i <= currentStep ? "text-white" : "text-white/20"
                                            )}>{step}</span>
                                            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-white/10" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {currentStep === 0 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                                <input
                                                    type="text"
                                                    placeholder="SEARCH FOR TESTS..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 pl-12 pr-4 text-[10px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all"
                                                />
                                            </div>
                                            <Button variant="outline" className="h-12 border-white/10 bg-white/5 rounded-2xl">
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {loading ? (
                                                [1, 2, 3, 4].map((i) => (
                                                    <Card key={i} className="glass-card border-white/10 p-6 flex flex-col justify-between h-32">
                                                        <div className="space-y-3">
                                                            <Skeleton className="h-3 w-16" />
                                                            <Skeleton className="h-6 w-40" />
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-6 w-6 rounded-full" />
                                                        </div>
                                                    </Card>
                                                ))
                                            ) : (
                                                <>
                                                    {/* Packages Section */}
                                                    {packages.map((pkg) => (
                                                        <div
                                                            key={`pkg-${pkg.id}`}
                                                            onClick={() => setSelectedTest({ ...pkg, type: 'package' })}
                                                            className={cn(
                                                                "p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden",
                                                                selectedTest?.id === pkg.id && selectedTest?.type === 'package'
                                                                    ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/40 shadow-glow-gold"
                                                                    : "bg-white/5 border-white/10 hover:border-white/30"
                                                            )}
                                                        >
                                                            <div className="flex items-start justify-between relative z-10">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="bg-[hsl(var(--saffron))]/20 text-[hsl(var(--saffron))] text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">Package</span>
                                                                        {pkg.is_popular && <span className="bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter animate-pulse">Hot</span>}
                                                                    </div>
                                                                    <h4 className="font-black text-white text-lg leading-tight uppercase tracking-tighter">{pkg.name}</h4>
                                                                    <p className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-widest truncate max-w-[200px]">{pkg.description}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-white font-black text-xl tracking-tighter">ZMW {pkg.price}</p>
                                                                    <CheckCircle2 className={cn("h-6 w-6 mt-2 ml-auto transition-all", selectedTest?.id === pkg.id ? "text-[hsl(var(--gold))]" : "text-white/5")} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Tests Section */}
                                                    {tests.map((test) => (
                                                        <div
                                                            key={`test-${test.id}`}
                                                            onClick={() => setSelectedTest({ ...test, type: 'test' })}
                                                            className={cn(
                                                                "p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden",
                                                                selectedTest?.id === test.id && selectedTest?.type === 'test'
                                                                    ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/40 shadow-glow-gold"
                                                                    : "bg-white/5 border-white/10 hover:border-white/30"
                                                            )}
                                                        >
                                                            <div className="flex items-start justify-between relative z-10">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">{test.category || 'Diagnostic'}</span>
                                                                    </div>
                                                                    <h4 className="font-black text-white text-lg leading-tight uppercase tracking-tighter">{test.name}</h4>
                                                                    <p className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-widest">{test.time_estimate || '24h Result'}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-white font-black text-xl tracking-tighter">ZMW {test.price}</p>
                                                                    <CheckCircle2 className={cn("h-6 w-6 mt-2 ml-auto transition-all", selectedTest?.id === test.id ? "text-[hsl(var(--gold))]" : "text-white/5")} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 1 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div
                                                onClick={() => setLocationType('branch')}
                                                className={cn(
                                                    "p-8 rounded-[2rem] border transition-all cursor-pointer text-center group",
                                                    locationType === 'branch' ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/40" : "bg-white/5 border-white/10 hover:border-white/30"
                                                )}
                                            >
                                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                                                    <MapPin className={cn("h-8 w-8", locationType === 'branch' ? "text-[hsl(var(--gold))]" : "text-white/20")} />
                                                </div>
                                                <h4 className="font-black text-white text-xl uppercase tracking-tighter">Centre Visit</h4>
                                                <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Visit our high-tech labs</p>
                                            </div>

                                            <div
                                                onClick={() => {
                                                    setLocationType('home');
                                                    setSelectedBranch(null);
                                                }}
                                                className={cn(
                                                    "p-8 rounded-[2rem] border transition-all cursor-pointer text-center group relative overflow-hidden",
                                                    locationType === 'home' ? "bg-blue-500/10 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white/5 border-white/10 hover:border-white/30"
                                                )}
                                            >
                                                <div className="absolute top-4 right-4 bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">Premium</div>
                                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                                                    <Home className={cn("h-8 w-8", locationType === 'home' ? "text-blue-400" : "text-white/20")} />
                                                </div>
                                                <h4 className="font-black text-white text-xl uppercase tracking-tighter">Home Collection</h4>
                                                <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Expert Phlebotomists at your door</p>
                                            </div>
                                        </div>

                                        {locationType === 'branch' && (
                                            <div className="space-y-4">
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Select Clinic Branch</h5>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {branches.map((branch) => (
                                                        <div
                                                            key={branch.id}
                                                            onClick={() => setSelectedBranch(branch)}
                                                            className={cn(
                                                                "p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between",
                                                                selectedBranch?.id === branch.id ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/40" : "bg-white/5 border-white/10 hover:border-white/30"
                                                            )}
                                                        >
                                                            <div>
                                                                <h6 className="font-black text-white text-sm uppercase tracking-tighter">{branch.name}</h6>
                                                                <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-widest truncate max-w-[150px]">{branch.address}</p>
                                                            </div>
                                                            <MapPin className={cn("h-4 w-4", selectedBranch?.id === branch.id ? "text-[hsl(var(--gold))]" : "text-white/10")} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Select Appointment Date</h5>
                                                <input
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full bg-white/5 border border-white/10 rounded-3xl h-16 px-6 text-[10px] font-black tracking-widest uppercase focus:border-[hsl(var(--gold))]/50 outline-none transition-all appearance-none"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Select Time</h5>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"].map((time) => (
                                                        <div
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={cn(
                                                                "h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer text-[10px] font-black tracking-tighter",
                                                                selectedTime === time ? "bg-[hsl(var(--gold))] text-slate-950 shadow-glow-gold border-transparent" : "bg-white/5 border-white/10 hover:border-white/30 text-white/60"
                                                            )}
                                                        >
                                                            {time}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <Card className="bg-[hsl(var(--emerald-india))]/5 border border-[hsl(var(--emerald-india))]/20 rounded-3xl p-6">
                                            <h6 className="text-[10px] font-black uppercase text-[hsl(var(--emerald-india))] tracking-[0.3em] mb-4">Appointment Summary</h6>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                                <div>
                                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Selected Test</p>
                                                    <p className="text-sm font-black text-white uppercase truncate">{selectedTest?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Location</p>
                                                    <p className="text-sm font-black text-white uppercase">{locationType === 'home' ? 'Home' : selectedBranch?.name.split(' ')[0]}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Appointment Date</p>
                                                    <p className="text-sm font-black text-white uppercase">{selectedDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total Fee</p>
                                                    <p className="text-sm font-black text-[hsl(var(--gold))] uppercase">ZMW {selectedTest?.price}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                        <CardHeader className="p-8 border-t border-white/5 bg-white/5 flex flex-row items-center justify-between">
                            <Button
                                variant="ghost"
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="h-14 px-8 rounded-2xl text-white/40 hover:text-white font-black uppercase tracking-widest disabled:opacity-0 transition-all"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                            </Button>

                            {currentStep < steps.length - 1 ? (
                                <Button
                                    onClick={nextStep}
                                    className="h-14 px-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest transition-all"
                                >
                                    Proceed <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleBooking}
                                    className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-slate-950 font-black uppercase tracking-widest shadow-glow-gold hover:scale-[1.05] transition-all"
                                >
                                    Confirm Appointment <CheckCircle2 className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                    </Card>
                </div>

                {/* Sidebar History */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="glass-card border-white/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5">
                            <CardTitle className="text-xl font-black font-heading text-white flex items-center gap-3 uppercase tracking-tighter">
                                <History className="h-6 w-6 text-[hsl(var(--gold))]" />
                                Visit History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="p-6 border-b border-white/5 space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-3 w-12 rounded-full" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-5 w-32" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-12 rounded-lg" />
                                            <Skeleton className="h-6 w-12 rounded-lg" />
                                        </div>
                                    </div>
                                ))
                            ) : bookingHistory.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {bookingHistory.map((booking) => (
                                        <div key={booking.id} className="p-6 hover:bg-white/5 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                    booking.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                        booking.status === 'confirmed' ? "bg-[hsl(var(--saffron))]/10 text-[hsl(var(--saffron))] border-[hsl(var(--saffron))]/20" :
                                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                )}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-[10px] font-black text-white/20">{booking.date}</span>
                                            </div>
                                            <h6 className="font-black text-white text-sm uppercase tracking-tighter truncate">{booking.test_name || 'DIAGNOSTIC'}</h6>
                                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" className="h-8 px-3 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/60">
                                                    Track
                                                </Button>
                                                {booking.status === 'pending' && (
                                                    <Button variant="ghost" className="h-8 px-3 rounded-lg text-[8px] font-black uppercase tracking-widest bg-red-500/5 hover:bg-red-500/10 text-red-400/60">
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <History className="h-6 w-6 text-white/10" />
                                    </div>
                                    <p className="text-white/20 font-black uppercase text-[10px] tracking-widest">No previous records found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none bg-gradient-to-br from-[hsl(var(--saffron))]/10 to-transparent p-1 rounded-[2.5rem]">
                        <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.4rem] p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-[hsl(var(--saffron))]" />
                                <h5 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Reschedule Policy</h5>
                            </div>
                            <p className="text-white/40 text-[10px] leading-relaxed font-bold uppercase tracking-wider">
                                Cancellation or rescheduling is allowed up to <span className="text-[hsl(var(--saffron))]">24 HOURS</span> prior to the scheduled slot.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
