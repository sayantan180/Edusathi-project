import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreateCenter from "./pages/CreateCenter";
import CenterList from "./pages/CenterList";
import Pricing from "./pages/Pricing";
import PricingForm from "./pages/PricingForm";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
// import Admin from "./pages/admin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Admin from "./pages/admin";
import Settings from "./pages/Settings";
import GetStarted from "./pages/GetStarted";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import Catalog from "./pages/Catalog";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pricing/setup" element={<PricingForm />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/auth" element={<Auth />} />
         
          <Route path="/creator" element={<CreatorDashboard />} />
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/centers"
            element={
              <ProtectedRoute>
                <CenterList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/centers/create"
            element={
              <ProtectedRoute>
                <CreateCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
           <Route path="/student/*" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
