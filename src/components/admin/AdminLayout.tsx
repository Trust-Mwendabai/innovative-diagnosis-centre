import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { InteractiveBackground } from "@/components/InteractiveBackground";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            <InteractiveBackground />
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-[#f8fafc]/5 dark:bg-background/80 relative z-10">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
