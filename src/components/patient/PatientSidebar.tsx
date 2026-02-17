import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    History,
    User,
    CreditCard,
    Bell,
    BookOpen,
    LogOut,
    ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", path: "/patient/appointments" },
    { icon: FileText, label: "Test Results", path: "/patient/results" },
    { icon: History, label: "Medical History", path: "/patient/history" },
    { icon: User, label: "My Profile", path: "/patient/profile" },
    { icon: CreditCard, label: "Billing", path: "/patient/billing" },
    { icon: Bell, label: "Notifications", path: "/patient/notifications" },
    { icon: BookOpen, label: "Health Guru", path: "/patient/resources" },
];

export default function PatientSidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="w-80 h-screen glass border-r border-white/10 flex flex-col sticky top-0">
            {/* Logo Section */}
            <div className="p-8 border-b border-white/5 bg-white/5">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center shadow-glow-gold rotate-3 transition-transform group-hover:rotate-0">
                        <span className="text-white font-black text-xl -rotate-3 group-hover:rotate-0 transition-transform">IDC</span>
                    </div>
                    <div>
                        <h2 className="text-white font-black text-lg font-heading tracking-tight leading-none uppercase">Patient</h2>
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Guardian Vault</span>
                    </div>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-white/10"
                                    : "hover:bg-white/5 border border-transparent"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 w-1 h-full bg-[hsl(var(--gold))]" />
                            )}
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-[hsl(var(--gold))]" : "text-white/40 group-hover:text-white"
                            )} />
                            <span className={cn(
                                "font-black uppercase tracking-widest text-[10px]",
                                isActive ? "text-white" : "text-white/40 group-hover:text-white"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Log out */}
            <div className="p-6 border-t border-white/5">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full flex items-center justify-start gap-4 h-14 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 group border border-transparent hover:border-white/5"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Security Lock</span>
                </Button>
            </div>
        </div>
    );
}
