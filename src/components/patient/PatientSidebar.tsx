import React, { useState, useEffect } from "react";
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
    ChevronLeft,
    PanelLeftClose,
    PanelLeftOpen,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { API_BASE_URL } from "@/lib/config";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", path: "/patient/appointments" },
    { icon: FileText, label: "Test Results", path: "/patient/results" },
    { icon: History, label: "Medical History", path: "/patient/history" },
    { icon: User, label: "My Profile", path: "/patient/profile" },
    { icon: CreditCard, label: "Billing", path: "/patient/billing" },
    { icon: Bell, label: "Notifications", path: "/patient/notifications" },
    { icon: BookOpen, label: "Health Guru", path: "/patient/resources" },
    { icon: TrendingUp, label: "Health Trends", path: "/patient/trends" },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
    onNavigate?: () => void;
}

export default function PatientSidebar({ isCollapsed, onToggle, onNavigate }: SidebarProps) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const userId = user?.id || '';
                const res = await fetch(`${API_BASE_URL}/notifications/read.php?user_id=${userId}&role=patient`);
                const data = await res.json();
                if (data.success) {
                    const unreadCount = (data.notifications || []).filter((n: any) => n.status !== 'read').length;
                    setNotifCount(unreadCount);
                }
            } catch (e) {
                console.error('Failed to fetch notification count:', e);
            }
        };
        fetchCount();
    }, [user?.id]);

    return (
        <div className={cn(
            "h-screen glass border-r border-white/10 flex flex-col sticky top-0 transition-all duration-500 ease-in-out z-50",
            isCollapsed ? "w-24" : "w-80"
        )}>
            {/* Logo Section */}
            <div className={cn(
                "p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative group",
                isCollapsed && "p-4 justify-center"
            )}>
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center shadow-glow-gold rotate-3 transition-transform group-hover:rotate-0 flex-shrink-0">
                        <span className="text-white font-black text-xl -rotate-3 group-hover:rotate-0 transition-transform">IDC</span>
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in whitespace-nowrap">
                            <h2 className="text-white font-black text-lg font-heading tracking-tight leading-none uppercase">Patient</h2>
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Portal</span>
                        </div>
                    )}
                </Link>

                {/* Desktop Toggle Button */}
                {!onNavigate && onToggle && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className={cn(
                            "text-white/20 hover:text-white hover:bg-white/5 transition-all",
                            isCollapsed ? "absolute -right-4 top-10 bg-slate-900 border border-white/10 rounded-full h-8 w-8 scale-0 group-hover:scale-100 z-50 text-white" : "h-10 w-10 rounded-xl"
                        )}
                    >
                        {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </Button>
                )}
            </div>

            {/* Navigation links */}
            <nav className={cn(
                "flex-1 overflow-y-auto p-6 space-y-2",
                isCollapsed && "p-4"
            )}>
                <TooltipProvider delayDuration={0}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const content = (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-[hsl(var(--gold))]/10 to-transparent border border-white/10"
                                        : "hover:bg-white/5 border border-transparent",
                                    isCollapsed && "px-0 justify-center h-14 w-14 mx-auto"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 w-1 h-full bg-[hsl(var(--gold))]" />
                                )}
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors flex-shrink-0",
                                    isActive ? "text-[hsl(var(--gold))]" : "text-white/40 group-hover:text-white"
                                )} />
                                {!isCollapsed && (
                                    <span className={cn(
                                        "font-black uppercase tracking-widest text-[10px] whitespace-nowrap animate-fade-in flex-1",
                                        isActive ? "text-white" : "text-white/40 group-hover:text-white"
                                    )}>
                                        {item.label}
                                    </span>
                                )}
                                {item.label === "Notifications" && notifCount > 0 && (
                                    <span className={cn(
                                        "bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse",
                                        isCollapsed ? "absolute -top-1 -right-1 w-5 h-5" : "min-w-[22px] h-5 px-1.5"
                                    )}>
                                        {notifCount > 99 ? '99+' : notifCount}
                                    </span>
                                )}
                            </Link>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip key={item.path}>
                                    <TooltipTrigger asChild>
                                        {content}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 border-white/10 text-white font-black uppercase text-[9px] tracking-widest ml-4">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return content;
                    })}
                </TooltipProvider>
            </nav>

            {/* Footer Log out */}
            <div className={cn("p-6 border-t border-white/5", isCollapsed && "p-4")}>
                {isCollapsed ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    onClick={logout}
                                    className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl text-white/40 hover:text-white hover:bg-white/5 group border border-transparent hover:border-white/5 p-0"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-900 border-white/10 text-white font-black uppercase text-[9px] tracking-widest ml-4">
                                Logout
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full flex items-center justify-start gap-4 h-14 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 group border border-transparent hover:border-white/5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-black uppercase tracking-widest text-[10px] whitespace-nowrap">Logout</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
