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
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import Tests from "./pages/admin/Tests";
import Results from "./pages/admin/Results";
import Branches from "./pages/admin/Branches";
import Content from "./pages/admin/Content";
import AdminBlog from "./pages/admin/Blog";
import Notifications from "./pages/admin/Notifications";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

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

const PatientWrapper = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Even if authenticated, ensure it's a patient or admin (admins can view patient dashboards)
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
          <Routes>
            {/* Auth Routes (No layout) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/login" element={<PatientLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes - Protected by AdminLayout */}
            <Route element={<AdminWrapper />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/appointments" element={<Dashboard />} />
              <Route path="/admin/patients" element={<Patients />} />
              <Route path="/admin/tests" element={<Tests />} />
              <Route path="/admin/results" element={<Results />} />
              <Route path="/admin/branches" element={<Branches />} />
              <Route path="/admin/content" element={<Content />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/notifications" element={<Notifications />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* Patient Routes - Protected by PatientWrapper */}
            <Route element={<PatientWrapper />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
