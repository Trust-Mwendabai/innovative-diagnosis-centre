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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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
        if (!data) {
            toast.error("No data available to export.");
            return;
        }

        toast.success(`Generating ${format} report...`);

        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(59, 130, 246);
            doc.text("IDC Diagnostic Intelligence Report", 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.text("Clinic Operations & Revenue Analytics", 14, 35);

            // Stats Summary
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Performance Overview", 14, 50);

            const statsData = [
                ["Monthly Growth", "+12.5%", "+4.1%"],
                ["Patient Retention", "94.2%", "+2.3%"],
                ["Avg. Test Value", "K1,450", "+1.1%"],
                ["Report Accuracy", "99.9%", "Optimal"]
            ];

            (doc as any).autoTable({
                startY: 55,
                head: [["Metric", "Value", "Trend"]],
                body: statsData,
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] },
                styles: { fontStyle: 'bold' }
            });

            let finalY = (doc as any).lastAutoTable.finalY || 100;

            // Trend Data
            if (data.trends && data.trends.length > 0) {
                doc.setFontSize(16);
                doc.text("Patient Volume Trends", 14, finalY + 15);
                const trendRows = data.trends.map((t: any) => [t.month, t.count]);
                (doc as any).autoTable({
                    startY: finalY + 20,
                    head: [["Month", "Appointments"]],
                    body: trendRows,
                    theme: 'striped',
                    headStyles: { fillColor: [59, 130, 246] }
                });
                finalY = (doc as any).lastAutoTable.finalY || finalY + 50;
            }

            // Test Distribution
            if (data.distribution && data.distribution.length > 0) {
                if (finalY > 230) { doc.addPage(); finalY = 20; }
                doc.setFontSize(16);
                doc.text("Top Performed Tests", 14, finalY + 15);
                const distRows = data.distribution.map((d: any) => [d.name, d.total]);
                (doc as any).autoTable({
                    startY: finalY + 20,
                    head: [["Test Name", "Volume"]],
                    body: distRows,
                    theme: 'grid',
                    headStyles: { fillColor: [16, 185, 129] }
                });
            }

            window.open(doc.output('bloburl'), '_blank');
            doc.save(`IDC_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.info("Download started automatically.");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF. Check console for details.");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h1>
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
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</h4>
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center"><ArrowUpRight className="h-2.5 w-2.5" /> 4.1%</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-light border-white/20 shadow-premium rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
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
                                        contentStyle={{
                                            borderRadius: '20px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            fontWeight: 'bold',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            color: '#0f172a'
                                        }}
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
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
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
                                    <Bar
                                        dataKey="revenue"
                                        fill="#10b981"
                                        radius={[10, 10, 0, 0]}
                                        barSize={40}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-light border-white/20 shadow-premium rounded-[2.5rem] overflow-hidden lg:col-span-2">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-amber-500" /> Top Performed Tests
                        </CardTitle>
                        <CardDescription className="font-bold">Distribution based on appointment volume across all diagnostics.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] p-8 pt-0 flex items-center">
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
                                <div className="w-1/2 grid grid-cols-2 gap-4">
                                    {data?.distribution.map((entry: any, index: number) => (
                                        <div key={index} className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-white/40 shadow-sm">
                                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{entry.name}</p>
                                                <p className="text-[10px] font-bold text-emerald-600">{entry.total} bookings</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
