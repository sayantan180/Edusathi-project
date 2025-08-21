import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
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
import CreatorUpload from "./pages/CreatorUpload";
import CreatorContents from "./pages/CreatorContents";
import CreatorSales from "./pages/CreatorSales";
import CreatorContentDetail from "./pages/CreatorContentDetail";
import Catalog from "./pages/Catalog";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/pricing/setup" element={<PricingForm />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business"
        element={
          <ProtectedRoute roles={["business"]}>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/catalog" element={<Catalog />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute roles={["student"]}>
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
        path="/dashboard/creator/upload"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/contents"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorContents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/content/:id"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorContentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/sales"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorSales />
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
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
