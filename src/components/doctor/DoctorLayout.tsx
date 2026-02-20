import { ReactNode, useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, Stethoscope, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorLayout({ children }: { children: ReactNode }) {
    const isMobile = useIsMobile();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'doctor') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans selection:bg-cyan-500/30 selection:text-white">
            <InteractiveBackground />

            {/* Desktop Sidebar */}
            {!isMobile && <DoctorSidebar />}

            {/* Mobile Header */}
            {isMobile && (
                <header className="h-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 rotate-3">
                            <Stethoscope className="text-white h-5 w-5 -rotate-3" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-sm uppercase tracking-tighter leading-none">IDC Doctor</span>
                            <span className="text-[8px] font-black uppercase text-cyan-500/60 tracking-widest mt-1">Medical Portal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/5 rounded-xl h-10 w-10 border border-white/5 bg-white/5"
                        >
                            <Link to="/doctor/settings">
                                <User className="h-5 w-5 text-cyan-500" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-white hover:bg-white/5 rounded-xl h-10 w-10 border border-white/5 bg-white/5"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </header>
            )}

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-80 bg-slate-950 border-r border-white/5">
                    <DoctorSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            <main className="flex-1 overflow-y-auto bg-slate-950/50 backdrop-blur-3xl relative z-10 scroll-smooth">
                {/* Visual Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10 -z-10" />

                <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
                    {children}

                    {/* Footer */}
                    <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                            &copy; {new Date().getFullYear()} IDC Medical Practitioner Portal
                        </p>
                        <div className="flex gap-8">
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure Connection</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">HIPAA Compliant</span>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
