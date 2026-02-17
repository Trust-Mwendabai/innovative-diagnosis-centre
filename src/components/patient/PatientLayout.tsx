import React from "react";
import PatientSidebar from "./PatientSidebar";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-row font-sans selection:bg-[hsl(var(--gold))]/30 selection:text-white overflow-hidden">
            {/* Sidebar remains fixed */}
            <PatientSidebar />

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--gold))]/5 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-8 min-h-screen">
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
