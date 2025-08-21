import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreateCenter from "./pages/CreateCenter";
import CenterList from "./pages/CenterList";
import Pricing from "./pages/Pricing";
import PricingForm from "./pages/PricingForm";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
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

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/pricing/setup", element: <PricingForm /> },
    { path: "/about", element: <AboutUs /> },
    { path: "/contact", element: <ContactUs /> },
    { path: "/login", element: <Auth /> },
    { path: "/get-started", element: <GetStarted /> },
    { path: "/auth", element: <Auth /> },
    {
      path: "/student",
      element: (
        <ProtectedRoute roles={["student"]}>
          <StudentDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/creator",
      element: (
        <ProtectedRoute roles={["creator"]}>
          <CreatorDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/business",
      element: (
        <ProtectedRoute roles={["business"]}>
          <BusinessDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/creator/upload",
      element: (
        <ProtectedRoute roles={["creator"]}>
          <CreatorUpload />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/creator/contents",
      element: (
        <ProtectedRoute roles={["creator"]}>
          <CreatorContents />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/creator/content/:id",
      element: (
        <ProtectedRoute roles={["creator"]}>
          <CreatorContentDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/creator/sales",
      element: (
        <ProtectedRoute roles={["creator"]}>
          <CreatorSales />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/centers",
      element: (
        <ProtectedRoute>
          <CenterList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/centers/create",
      element: (
        <ProtectedRoute>
          <CreateCenter />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/settings",
      element: (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      ),
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
