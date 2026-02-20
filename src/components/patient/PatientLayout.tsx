import { useState, useEffect } from "react";
import PatientSidebar from "./PatientSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-[hsl(var(--gold))]/30 selection:text-white">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className={cn(
                    "transition-all duration-500 ease-in-out",
                    isCollapsed ? "w-24" : "w-80"
                )}>
                    <PatientSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                </div>
            )}

            {/* Mobile Header */}
            {isMobile && (
                <header className="h-20 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center shadow-glow-gold rotate-3">
                            <span className="text-white font-black text-sm -rotate-3">IDC</span>
                        </div>
                        <span className="text-white font-black text-sm uppercase tracking-tighter">Guardian Vault</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/5 rounded-xl h-10 w-10"
                        >
                            <Link to="/patient/profile">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-white hover:bg-white/5 rounded-xl h-10 w-10"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </header>
            )}

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-80 bg-slate-950 border-r border-white/10">
                    <PatientSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content Area */}
            <main className="flex-1 relative scroll-smooth bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--gold))]/5 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen">
                    {children}

                    {/* Minimalist Footer */}
                    <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                            &copy; {new Date().getFullYear()} IDC Innovative Diagnosis Centre
                        </p>
                        <div className="flex gap-8">
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Security Pact</a>
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacy Shield</a>
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">24/7 Support</a>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
