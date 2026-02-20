import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    FileCheck,
    Bell,
    ClipboardList
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor/dashboard" },
    { icon: CalendarDays, label: "Appointments", path: "/doctor/appointments" },
    { icon: Users, label: "My Patients", path: "/doctor/patients" },
    { icon: FileCheck, label: "Test Results", path: "/doctor/results" },
    { icon: ClipboardList, label: "Prescriptions", path: "/doctor/prescriptions" },
    { icon: Bell, label: "Notifications", path: "/doctor/notifications" },
    { icon: Settings, label: "Settings", path: "/doctor/settings" },
];

export default function DoctorSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <motion.div
            animate={{ width: isCollapsed ? 100 : 300 }}
            className="h-screen bg-slate-950 border-r border-white/5 sticky top-0 left-0 z-40 hidden lg:flex flex-col shadow-2xl"
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 rotate-3">
                    <Stethoscope className="text-white h-5 w-5 -rotate-3" />
                </div>
                {!isCollapsed && (
                    <div className="animate-fade-in">
                        <h1 className="text-white font-black tracking-tighter text-lg leading-tight">IDC Doctor</h1>
                        <p className="text-cyan-500/60 text-[9px] uppercase tracking-widest font-black">Medical Portal</p>
                    </div>
                )}
            </div>

            <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1 no-scrollbar">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-500 group relative overflow-hidden",
                                isActive
                                    ? "bg-white/5 text-white shadow-xl border border-white/10"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
                                isActive ? "bg-cyan-500 text-white shadow-glow-cyan" : "bg-white/5 group-hover:bg-white/10"
                            )}>
                                <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
                            </div>
                            {!isCollapsed && (
                                <span className={cn(
                                    "font-black text-[10px] uppercase tracking-[0.15em] transition-colors",
                                    isActive ? "text-white" : "text-slate-500"
                                )}>{item.label}</span>
                            )}
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-l-full shadow-glow-cyan"
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Profile Section */}
            {!isCollapsed && (
                <div className="p-4 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 font-black border border-white/10 shrink-0">
                            {user?.name?.charAt(0) || 'D'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-black text-[10px] truncate uppercase tracking-widest">Dr. {user?.name}</p>
                            <p className="text-[8px] font-black uppercase text-cyan-500/50 tracking-widest mt-0.5">Practitioner</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-3 border-t border-white/5 space-y-1.5">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-11 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full h-11 flex items-center gap-3 px-4 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all group font-black uppercase text-[9px] tracking-widest border border-white/5"
                >
                    <LogOut className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && <span>Disconnect</span>}
                </button>
            </div>
        </motion.div>
    );
}
