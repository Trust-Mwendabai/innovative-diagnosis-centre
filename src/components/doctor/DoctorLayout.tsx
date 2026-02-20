import { ReactNode } from "react";
import DoctorSidebar from "./DoctorSidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { InteractiveBackground } from "@/components/InteractiveBackground";

export default function DoctorLayout({ children }: { children: ReactNode }) {
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
        <div className="flex h-screen bg-slate-950 overflow-hidden relative font-sans">
            <InteractiveBackground />
            <DoctorSidebar />
            <main className="flex-1 overflow-y-auto bg-slate-950/50 backdrop-blur-3xl relative z-10 scroll-smooth">
                {/* Visual Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10 -z-10" />

                <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
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
