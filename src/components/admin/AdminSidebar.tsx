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
    { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
    { icon: CalendarDays, label: "Appointments", path: "/admin/appointments" },
    { icon: Users, label: "Patients", path: "/admin/patients" },
    { icon: Microscope, label: "Tests & Packages", path: "/admin/tests" },
    { icon: FileCheck, label: "Results Center", path: "/admin/results" },
    { icon: MapPin, label: "Branches", path: "/admin/branches" },
    { icon: Layout, label: "Content Manager", path: "/admin/content" },
    { icon: Newspaper, label: "Blog Manager", path: "/admin/blog" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { icon: BarChart3, label: "Reports & BI", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/admin");
    };

    return (
        <div
            className={cn(
                "relative flex flex-col h-screen border-r border-white/5 bg-slate-950 text-white/80 transition-all duration-300 overflow-visible z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="flex items-center gap-3 p-8 mb-4">
                <div className="flex items-center justify-center min-w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] shadow-glow-gold rotate-3">
                    <Stethoscope className="w-5 h-5 text-white -rotate-3" />
                </div>
                {!isCollapsed && (
                    <span className="text-xl font-black tracking-tighter text-white">IDC <span className="text-[hsl(var(--gold))]">PRO</span></span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 custom-scrollbar overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex items-center w-full gap-3 px-3 py-3.5 rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white/5 text-white"
                                    : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute left-0 w-1 h-6 bg-[hsl(var(--gold))] rounded-r-full shadow-glow-gold"
                                />
                            )}
                            <item.icon className={cn(
                                "w-5 h-5 transition-all duration-300",
                                isActive ? "text-[hsl(var(--gold))] scale-110" : "group-hover:scale-110 group-hover:text-[hsl(var(--saffron))]"
                            )} />
                            {!isCollapsed && (
                                <span className={cn(
                                    "font-bold text-xs uppercase tracking-widest",
                                    isActive ? "opacity-100" : "opacity-100"
                                )}>
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 mt-auto">
                <div className="rounded-[2rem] bg-white/5 border border-white/5 p-4 overflow-hidden mb-2">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 mb-6 px-1">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] flex items-center justify-center text-xs font-black text-white shadow-lg">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black text-white truncate uppercase tracking-tighter">{user?.name || "Administrator"}</span>
                                <span className="text-[10px] text-white/30 truncate font-bold">{user?.role || "System Access"}</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center w-full gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-200",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-widest">Terminate Session</span>}
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-20 -right-3 w-6 h-6 rounded-lg bg-gradient-to-b from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-transform active:scale-95"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </div>
    );
}
