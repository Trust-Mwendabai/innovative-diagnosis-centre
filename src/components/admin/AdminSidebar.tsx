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
    Microscope,
    FileCheck,
    MapPin,
    Layout,
    Newspaper,
    Bell,
    BarChart3
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "" },
    { icon: CalendarDays, label: "Appointments", path: "/admin/appointments" },
    { icon: Users, label: "Patients", path: "/admin/patients" },
    { icon: Stethoscope, label: "Doctors", path: "/admin/doctors" },
    { icon: Microscope, label: "Medical Tests", path: "/admin/tests" },
    { icon: FileCheck, label: "Test Results", path: "/admin/results" },
    { icon: Newspaper, label: "Blog Manager", path: "/admin/blog" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <motion.div
            animate={{ width: isCollapsed ? 100 : 280 }}
            className="h-screen bg-slate-900 border-r border-slate-800 sticky top-0 left-0 z-40 hidden lg:flex flex-col shadow-2xl"
        >
            <div className="p-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-black text-xl">IDC</span>
                </div>
                {!isCollapsed && (
                    <div className="animate-fade-in">
                        <h1 className="text-white font-black tracking-tighter text-xl">IDC Admin</h1>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Control Node</p>
                    </div>
                )}
            </div>

            <div className="flex-1 px-4 py-8 overflow-y-auto space-y-2 no-scrollbar">
                {sidebarItems.map((item) => {
                    // Check logic for active item
                    const isActive = item.path === ""
                        ? (location.pathname === "/admin" || location.pathname === "/admin/dashboard")
                        : location.pathname.startsWith(item.path);

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path ? item.path : "/admin/dashboard")}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                            {!isCollapsed && (
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            )}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-12 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && <span className="font-bold text-sm">Disconnect</span>}
                </button>
            </div>
        </motion.div>
    );
}
