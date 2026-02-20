import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Services from "./pages/Services";
import BookTest from "./pages/BookTest";
import TestRecommender from "./pages/TestRecommender";
import Locations from "./pages/Locations";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import PatientLogin from "./pages/Login";
import PatientDashboard from "./pages/patient/Dashboard";
import AdminLogin from "./pages/admin/Login";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Patients = lazy(() => import("./pages/admin/Patients"));
const AdminDoctors = lazy(() => import("./pages/admin/Doctors"));
const Tests = lazy(() => import("./pages/admin/Tests"));
const Results = lazy(() => import("./pages/admin/Results"));
const Branches = lazy(() => import("./pages/admin/Branches"));
const AdminContent = lazy(() => import("./pages/admin/Content"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

// Doctor Dashboard
const DoctorDashboard = lazy(() => import("./pages/doctor/Dashboard"));

import { AuthProvider, useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

import AdminLayout from "@/components/admin/AdminLayout";

const PublicLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const AdminWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

import PatientLayout from "@/components/patient/PatientLayout";

// Patient Portal Subpages
const PatientAppointments = lazy(() => import("./pages/patient/subpages/Appointments"));
const PatientResults = lazy(() => import("./pages/patient/subpages/Results"));
const PatientHistory = lazy(() => import("./pages/patient/subpages/History"));
const PatientProfile = lazy(() => import("./pages/patient/subpages/Profile"));
const PatientBilling = lazy(() => import("./pages/patient/subpages/Billing"));
const PatientNotifications = lazy(() => import("./pages/patient/subpages/Notifications"));
const PatientResources = lazy(() => import("./pages/patient/subpages/Resources"));
const HealthTrends = lazy(() => import("./pages/patient/subpages/HealthTrends"));


const PatientWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--gold))]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <PatientLayout>
      <Outlet />
    </PatientLayout>
  );
};

const DoctorWrapper = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--gold))]"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'doctor') return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

import BlogDetail from "./pages/BlogDetail";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--gold))]"></div>
            </div>
          }>
            <Routes>
              {/* Auth Routes (No layout) */}
              <Route path="/idc-portal-vault" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<PatientLogin />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes - Protected by AdminLayout */}
              <Route element={<AdminWrapper />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/appointments" element={<Dashboard />} />
                <Route path="/admin/patients" element={<Patients />} />
                <Route path="/admin/doctors" element={<AdminDoctors />} />
                <Route path="/admin/tests" element={<Tests />} />
                <Route path="/admin/results" element={<Results />} />
                <Route path="/admin/branches" element={<Branches />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              {/* Doctor Routes - Protected by DoctorWrapper */}
              <Route element={<DoctorWrapper />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              </Route>

              {/* Patient Routes - Protected by PatientWrapper */}
              <Route path="/patient" element={<PatientWrapper />}>
                <Route index element={<Navigate to="/patient/dashboard" replace />} />
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="results" element={<PatientResults />} />
                <Route path="history" element={<PatientHistory />} />
                <Route path="profile" element={<PatientProfile />} />
                <Route path="billing" element={<PatientBilling />} />
                <Route path="notifications" element={<PatientNotifications />} />
                <Route path="resources" element={<PatientResources />} />
                <Route path="trends" element={<HealthTrends />} />

              </Route>

              {/* Public Routes - With Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/book" element={<BookTest />} />
                <Route path="/recommender" element={<TestRecommender />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
