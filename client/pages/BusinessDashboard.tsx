import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header with Profile option */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Business Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar with Profile + Logout */}
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-4 self-start">
            <div className="mb-4">
              <div className="font-semibold leading-5">{profile?.name || "Business Admin"}</div>
              <div className="text-xs text-slate-600">{profile?.email || "-"}</div>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" onClick={() => navigate("/pricing")} className="justify-start">Subscription Plan</Button>
              <Button variant="outline" onClick={() => navigate("#")} className="justify-start">Setup Details</Button>
              <Button variant="outline" onClick={() => navigate("#")} className="justify-start">Subscription Details</Button>
              <Button variant="outline" onClick={() => navigate("/contact")} className="justify-start">Help & Contact Us</Button>
              <Button variant="destructive" onClick={logout}>Logout</Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="space-y-6">
            {location.pathname.startsWith("/business/subscription-plan") ? (
              <div>
                <Pricing />
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
          </main>
        </div>

        {/* Footer with Logout */}
        {/* <div className="flex items-center justify-end">
          <Button variant="destructive" onClick={logout}>Logout</Button>
        </div> */}
      </div>
    </div>
  );
}
