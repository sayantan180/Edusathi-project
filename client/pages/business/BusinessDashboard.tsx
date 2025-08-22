import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { LayoutDashboard, User, CreditCard, FileText, HelpCircle, Settings } from "lucide-react";
import Pricing from "./Pricing";

export default function BusinessDashboard() {
  const [profile, setProfile] = useState<{name?: string; email?: string; role?: string} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const p =
      sessionStorage.getItem("userProfile") ||
      localStorage.getItem("userProfile") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  function logout() {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");
      storage.removeItem("accessToken");
      storage.removeItem("refreshToken");
      storage.removeItem("user");
      storage.removeItem("userProfile");
      storage.removeItem("isLoggedIn");
      storage.removeItem("userRole");
    }
    navigate("/auth?role=business", { replace: true });
  }

  // Build navigation for RoleDashboardLayout
  const navigationItems = [
    { title: "Dashboard", href: "/business", icon: LayoutDashboard, isActive: location.pathname === "/business", isExpandable: false as const },
    { title: "Profile", href: "/business/account", icon: User, isActive: location.pathname.startsWith("/business/account"), isExpandable: false as const },
    { title: "Subscription Plan", href: "/business/subscription-plan", icon: CreditCard, isActive: location.pathname.startsWith("/business/subscription-plan"), isExpandable: false as const },
    { title: "Setup Details", href: "/business/setup", icon: Settings, isActive: location.pathname.startsWith("/business/setup"), isExpandable: false as const },
    { title: "Subscription Details", href: "/business/subscription-details", icon: FileText, isActive: location.pathname.startsWith("/business/subscription-details"), isExpandable: false as const },
    { title: "Help & Contact", href: "/business/contact", icon: HelpCircle, isActive: location.pathname.startsWith("/business/contact"), isExpandable: false as const },
  ];

  return (
    <RoleDashboardLayout
      title="Business Dashboard"
      navigationItems={navigationItems}
      headerActions={<Button size="sm" variant="destructive" onClick={logout}>Logout</Button>}
    >
      {/* Main content */}
      <div className="space-y-6">
        { location.pathname.startsWith("/business/subscription-plan") ? (
          <div>
            <Pricing />
          </div>
        ) : location.pathname.startsWith("/business/account") ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Your business account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p><strong>Admin:</strong> {profile?.name || "-"}</p>
                  <p><strong>Email:</strong> {profile?.email || "-"}</p>
                  <p><strong>Role:</strong> {profile?.role || "business"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Team & Analytics</CardTitle>
                <CardDescription>Manage members and view reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">No data yet. Invite your team to get started.</p>
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/setup") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Setup Details</CardTitle>
                <CardDescription>Complete your business profile and onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Business profile configuration</li>
                  <li>Payment setup</li>
                  <li>Branding and contact info</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/subscription-details") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Your current plan and billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">Plan: —</p>
                <p className="text-slate-700">Status: —</p>
                <p className="text-slate-700">Next billing: —</p>
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/contact") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Help & Contact Us</CardTitle>
                <CardDescription>We are here to help you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-2">Email: support@example.com</p>
                <p className="text-slate-700">You can also reach us via the contact page.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Organization profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p><strong>Admin:</strong> {profile?.name || "-"}</p>
                  <p><strong>Email:</strong> {profile?.email || "-"}</p>
                  <p><strong>Role:</strong> {profile?.role || "business"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Team & Analytics</CardTitle>
                <CardDescription>Manage members and view reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">No data yet. Invite your team to get started.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </RoleDashboardLayout>
  );
}
