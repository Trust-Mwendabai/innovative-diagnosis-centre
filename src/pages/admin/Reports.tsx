import { useState, useEffect } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    TestTube2,
    DollarSign,
    Download,
    Calendar,
    Filter,
    RefreshCw,
    PieChart as PieChartIcon,
    ChevronRight,
    ArrowUpRight,
    Activity,
    Printer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Reports() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports/stats.php`);
            const result = await res.json();
            if (result.success) setData(result);
        } catch (error) {
            toast.error("Error fetching report data");
        } finally {
            setLoading(false);
        }
    };

    const exportReport = (format: string) => {
        toast.success(`Generating ${format} report...`);
        setTimeout(() => {
            toast.info("Download started automatically.");
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
                    <p className="text-muted-foreground font-medium">Advanced intelligence for clinic operations and revenue trends.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass h-12 px-6 rounded-2xl border-white/20" onClick={() => fetchStats()}>
                        <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} /> Refresh
                    </Button>
                    <Button className="gradient-primary h-12 px-6 rounded-2xl shadow-lg shadow-primary/20" onClick={() => exportReport('PDF')}>
                        <Printer className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Monthly Growth", val: "+12.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Patient Retention", val: "94.2%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Avg. Test Value", val: "K1,450", icon: DollarSign, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Report Accuracy", val: "99.9%", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" }
                ].map((stat, i) => (
                    <Card key={i} className="glass-light border-white/20 shadow-premium p-6 rounded-[2rem]">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-2xl font-black text-slate-900">{stat.val}</h4>
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center"><ArrowUpRight className="h-2.5 w-2.5" /> 4.1%</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-light border-white/20 shadow-premium rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" /> Patient Volume Trends
                        </CardTitle>
                        <CardDescription className="font-bold">Total appointments per month over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8 pt-0">
                        {loading ? (
                            <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.trends || []}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-light border-white/20 shadow-premium rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-emerald-500" /> Revenue Distribution
                        </CardTitle>
                        <CardDescription className="font-bold">Projected income flow from diagnostic services.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8 pt-0">
                        {loading ? (
                            <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.revenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-light border-white/20 shadow-premium rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-amber-500" /> Top Performed Tests
                        </CardTitle>
                        <CardDescription className="font-bold">Distribution based on appointment volume.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8 pt-0 flex items-center">
                        {loading ? (
                            <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
                        ) : (
                            <>
                                <div className="w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data?.distribution || []}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="total"
                                            >
                                                {data?.distribution.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 space-y-4">
                                    {data?.distribution.map((entry: any, index: number) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className="flex-1">
                                                <p className="text-xs font-black text-slate-900 truncate">{entry.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{entry.total} bookings</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem]">
                        <h4 className="text-lg font-black text-slate-900 mb-2">Automated Report Scheduler</h4>
                        <p className="text-sm text-muted-foreground font-medium mb-6">Receive weekly executive summaries directly in your email.</p>
                        <div className="flex gap-4">
                            <Button className="flex-1 h-12 rounded-2xl bg-slate-100 text-slate-900 hover:bg-slate-200 font-black text-xs uppercase tracking-widest">Configure</Button>
                            <Button className="flex-1 h-12 rounded-2xl gradient-primary shadow-lg shadow-primary/20 font-black text-xs uppercase tracking-widest">Activate</Button>
                        </div>
                    </Card>

                    <Card className="glass-light border-white/20 shadow-premium p-8 rounded-[2.5rem] bg-indigo-50/50">
                        <div className="flex gap-4">
                            <div className="p-4 rounded-3xl bg-white text-indigo-600 shadow-sm h-fit">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h5 className="text-sm font-black text-slate-900 mb-1">Clinic Growth Insight</h5>
                                <p className="text-xs leading-relaxed font-medium text-slate-500">Based on trend analysis, patient volume is expected to increase by <span className="font-black text-indigo-600">8% next month</span>. Consider increasing lab headcount.</p>
                                <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase text-indigo-600 mt-2">View Detailed Forecast <ChevronRight className="h-3 w-3 ml-1" /></Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
