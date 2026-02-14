import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Appointments", path: "/book" },
    { label: "Test Recommender", path: "/recommender" },
    { label: "Locations", path: "/locations" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const toggleDark = () => {
        setDark(!dark);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                scrolled
                    ? "h-20 bg-slate-950/90 backdrop-blur-2xl shadow-2xl border-b border-white/10"
                    : "h-24 bg-slate-950/80 backdrop-blur-xl border-b border-white/5"
            )}
        >
            <div className="container h-full flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-3 font-heading text-2xl font-black group"
                >
                    <div className="relative">
                        <div className="h-11 w-11 rounded-[1.25rem] bg-gradient-to-br from-[hsl(var(--saffron))] to-[hsl(var(--gold))] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-glow-gold">
                            <Microscope className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-[1.25rem] bg-[hsl(var(--gold))] opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="gradient-text font-black tracking-tighter text-2xl">IDC</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hidden sm:block">Pure Precision</span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden xl:flex items-center gap-2">
                    {navLinks.map((l) => {
                        const isActive = location.pathname === l.path;
                        return (
                            <Link
                                key={l.path}
                                to={l.path}
                                className={cn(
                                    "relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:text-white group",
                                    isActive ? "text-white bg-white/5" : "text-white/40"
                                )}
                            >
                                {l.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[hsl(var(--gold))] shadow-glow-gold"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDark}
                        className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300"
                        aria-label="Toggle dark mode"
                    >
                        {dark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white/60" />}
                    </button>

                    <Link to="/book">
                        <Button
                            className="h-12 px-8 rounded-2xl bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--gold))] text-white font-black uppercase tracking-widest text-[10px] shadow-glow-gold hover:scale-[1.05] transition-all"
                        >
                            Book Test
                        </Button>
                    </Link>

                    <button
                        onClick={() => setOpen(!open)}
                        className="xl:hidden h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-3xl border-b border-white/10 shadow-3xl xl:hidden z-[-1]"
                    >
                        <nav className="p-8 space-y-2">
                            {navLinks.map((l) => (
                                <Link
                                    key={l.path}
                                    to={l.path}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "block px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
                                        location.pathname === l.path ? "bg-white/5 text-[hsl(var(--gold))]" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
