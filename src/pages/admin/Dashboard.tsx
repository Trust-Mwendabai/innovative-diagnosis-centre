import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Search,
    Activity,
    Users,
    Download,
    Filter,
    Plus,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Home,
    Building2,
    ClipboardCheck,
    UserCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import AddAppointmentModal from "@/components/admin/AddAppointmentModal";
import RescheduleModal from "@/components/admin/RescheduleModal";

interface Appointment {
    id: string;
    name: string;
    phone: string;
    date: string;
    time: string;
    location_type: string;
    status: string;
    email: string;
    staff_id?: string;
    staff_name?: string;
    doctor_id?: string;
    doctor_name?: string;
}

interface Doctor {
    id: string;
    name: string;
}

interface Stats {
    counts: {
        total: number;
        today: number;
        this_week: number;
        patients: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    trend: { date: string; count: number }[];
    distribution: { location_type: string; count: number }[];
}

export default function Dashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
    const [isAssigning, setIsAssigning] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
        fetchActivities();
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/doctors.php`);
            const data = await res.json();
            if (data.success) {
                // Since api/admin/doctors.php returns {success:true, doctors:[...]} or {success:true, data:[...]}
                // Looking at previous view_file of doctors.php, it returns data.doctors
                setDoctors(data.doctors || []);
            }
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/appointments/read.php`),
                fetch(`${API_BASE_URL}/appointments/stats.php`)
            ]);
            const appData = await appRes.json();
            const statsData = await statsRes.json();

            if (appData.success) setAppointments(appData.appointments);
            if (statsData.success) setStats(statsData);
        } catch (error) {
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/activity/read.php?limit=5`);
            const data = await res.json();
            if (data.success) setActivities(data.activities);
        } catch (error) {
            console.error("Error fetching activities", error);
        }
    };

    const assignDoctor = async (appointment_id: string, doctor_id: string) => {
        setIsAssigning(appointment_id);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/assign_doctor.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointment_id, doctor_id }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Doctor assigned successfully");
                fetchData();
                fetchActivities();
            } else {
                toast.error(data.message || "Failed to assign doctor");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setIsAssigning(null);
        }
    };

    const exportToCSV = () => {
        const headers = ["ID", "Patient", "Email", "Phone", "Date", "Time", "Type", "Status"];
        const rows = appointments.map(a => [
            a.id, a.name, a.email, a.phone, a.date, a.time, a.location_type, a.status
        ]);

        let csvString = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const universalBOM = "\uFEFF";
        const blob = new Blob([universalBOM + csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `IDC_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Exported to CSV");
    };

    const filtered = (appointments || []).filter(a => {
        const nameMatch = a.name?.toLowerCase().includes(search.toLowerCase()) || false;
        const phoneMatch = a.phone?.includes(search) || false;
        const matchesSearch = nameMatch || phoneMatch;
        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-muted-foreground font-medium">Overview of diagnostic appointments and activity logs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass py-5 px-6 border-white/20 bg-white/40" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="gradient-primary py-5 px-6 shadow-lg shadow-primary/20" onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> New Booking
                    </Button>
                </div>
            </div>

            <AddAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { fetchData(); fetchActivities(); }}
            />

            {selectedAppointment && (
                <RescheduleModal
                    isOpen={isRescheduleOpen}
                    onClose={() => { setIsRescheduleOpen(false); setSelectedAppointment(null); }}
                    onSuccess={() => { fetchData(); fetchActivities(); }}
                    appointment={selectedAppointment}
                />
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="glass-light border-white/20 hover:scale-[1.02] transition-transform shadow-premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Bookings</CardTitle>
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.counts.total}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                <span className="text-emerald-600">+{stats.counts.today} today</span> • {stats.counts.this_week} this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass-light border-white/20 hover:scale-[1.02] transition-transform shadow-premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Patients</CardTitle>
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Users className="h-4 w-4 text-purple-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.counts.patients}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Registered records</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-light border-white/20 hover:scale-[1.02] transition-transform shadow-premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Pending Action</CardTitle>
                            <div className="p-2 rounded-lg bg-amber-500/10">
                                <Clock className="h-4 w-4 text-amber-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.counts.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Needs confirmation</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-light border-white/20 hover:scale-[1.02] transition-transform shadow-premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Completed Tests</CardTitle>
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.counts.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Results delivered</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area (LHS) */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Booking Trends Chart */}
                    {stats && (
                        <Card className="glass-light border-white/20 shadow-xl overflow-hidden rounded-[2.5rem]">
                            <CardHeader className="p-8 border-b border-white/10 bg-white/30 dark:bg-slate-900/40">
                                <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter text-slate-900 dark:text-white">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Booking Analytical Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.trend}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: '800' }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: '800' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '20px',
                                                    border: 'none',
                                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                                    padding: '16px',
                                                    fontWeight: 'bold',
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(10px)',
                                                    color: '#0f172a'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#3b82f6"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorCount)"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Appointments Table */}
                    <Card className="glass-light border-white/20 shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="p-8 border-b border-white/10 bg-slate-100/50 dark:bg-slate-900/60">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Appointment Management</CardTitle>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-1">Search, filter, and manage all your clinic bookings.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                        <Input
                                            placeholder="Search patients..."
                                            className="pl-9 w-full sm:w-64 bg-white/80 dark:bg-slate-800/80 border-white/30 focus:bg-white text-slate-900 dark:text-white h-11 rounded-xl font-bold"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-slate-500" />
                                        <select
                                            className="h-11 rounded-xl border border-white/30 bg-white/80 dark:bg-slate-800/80 px-4 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-white/40 dark:bg-slate-950/40">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 gap-4">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-slate-600 dark:text-slate-300 font-black animate-pulse">Loading dashboard data...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-32 bg-white/20">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Activity className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No records found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters or search keywords.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-200/50 dark:bg-slate-800/50">
                                            <TableRow className="hover:bg-transparent border-white/10">
                                                <TableHead className="py-6 px-8 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Patient Detail</TableHead>
                                                <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Schedule</TableHead>
                                                <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Collection</TableHead>
                                                <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Assigned Doctor</TableHead>
                                                <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Status</TableHead>
                                                <TableHead className="py-6 px-8 text-right text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((apt) => (
                                                <TableRow key={apt.id} className="group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors border-white/5">
                                                    <TableCell className="py-6 px-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                                                                {apt.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors text-base">{apt.name}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                                                                    <UserCircle className="h-3 w-3" /> ID: {apt.id} • {apt.phone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
                                                                <Calendar className="h-4 w-4 text-blue-500" /> {apt.date}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
                                                                <Clock className="h-4 w-4" /> {apt.time}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className={cn(
                                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border shadow-sm",
                                                            apt.location_type === 'home'
                                                                ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                                                                : "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                                                        )}>
                                                            {apt.location_type === 'home' ? <Home className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                                                            {apt.location_type.toUpperCase()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="flex flex-col gap-1">
                                                            {isAssigning === apt.id ? (
                                                                <div className="text-xs font-bold text-primary animate-pulse italic">Assigning...</div>
                                                            ) : (
                                                                <select
                                                                    className="h-9 w-full min-w-[140px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-2 text-[10px] font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                                                                    value={apt.doctor_id || ""}
                                                                    onChange={(e) => assignDoctor(apt.id, e.target.value)}
                                                                >
                                                                    <option value="">Unassigned</option>
                                                                    {doctors.map(doc => (
                                                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                            {apt.doctor_name && (
                                                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1 mt-1 px-1">
                                                                    <CheckCircle className="h-2 w-2" /> Current: {apt.doctor_name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <span className={cn(
                                                            "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                            apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800' :
                                                                apt.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                                                                    apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800' :
                                                                        'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 animate-pulse-glow'
                                                        )}>
                                                            {apt.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-6 px-8 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-10 px-4 gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-black"
                                                                onClick={() => { setSelectedAppointment(apt); setIsRescheduleOpen(true); }}
                                                            >
                                                                <Calendar className="h-4 w-4" /> Manage
                                                            </Button>
                                                            {apt.status === 'pending' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-10 w-10 p-0 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-xl"
                                                                    onClick={() => updateStatus(apt.id, 'confirmed')}
                                                                    title="Confirm Now"
                                                                >
                                                                    <CheckCircle className="h-5 w-5" />
                                                                </Button>
                                                            )}
                                                            {apt.status !== 'cancelled' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-10 w-10 p-0 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-xl"
                                                                    onClick={() => updateStatus(apt.id, 'cancelled')}
                                                                    title="Cancel Booking"
                                                                >
                                                                    <XCircle className="h-5 w-5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Content Area (RHS) */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Collection Type Distribution */}
                    {stats && stats.distribution && (
                        <Card className="glass-light border-white/20 shadow-xl overflow-hidden rounded-[2.5rem]">
                            <CardHeader className="p-8 border-b border-white/10 bg-white/30 dark:bg-slate-900/40">
                                <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter text-slate-900 dark:text-white">
                                    <Activity className="h-5 w-5 text-emerald-500" />
                                    Collection Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[250px] w-full flex flex-col items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.distribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="count"
                                                nameKey="location_type"
                                                strokeWidth={0}
                                            >
                                                {stats.distribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '16px',
                                                    border: 'none',
                                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                                    padding: '12px',
                                                    fontWeight: 'bold',
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    color: '#0f172a'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-8 w-full space-y-3">
                                        {stats.distribution.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: COLORS[index % COLORS.length] }} />
                                                    {item.location_type}
                                                </div>
                                                <span className="text-slate-900 dark:text-white font-black">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Activity Feed */}
                    <Card className="glass-light border-white/20 shadow-xl overflow-hidden rounded-[2.5rem] bg-slate-100/30 dark:bg-slate-900/30">
                        <CardHeader className="p-8 border-b border-white/10 bg-white/30 dark:bg-slate-900/40">
                            <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter text-slate-900 dark:text-white">
                                <Activity className="h-5 w-5 text-secondary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {activities.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-black">
                                    No recent activity
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {activities.map((act, i) => (
                                        <div key={act.id} className="flex gap-4 relative group">
                                            {i !== activities.length - 1 && (
                                                <div className="absolute left-[15px] top-[40px] bottom-[-32px] w-[2px] bg-gradient-to-b from-slate-300 dark:from-slate-700 to-transparent" />
                                            )}
                                            <div className="z-10 w-8 h-8 rounded-2xl bg-white dark:bg-slate-800 shadow-premium border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            </div>
                                            <div className="space-y-1 pt-0.5">
                                                <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-primary transition-colors">{act.action}</p>
                                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                                                    {act.details}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                                    <span className="text-[hsl(var(--gold))]">{act.staff_name || 'System'}</span>
                                                    <span>•</span>
                                                    <span>{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
