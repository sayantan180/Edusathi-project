import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BusinessDashboard() {
  const [profile, setProfile] = useState<{name?: string; email?: string; role?: string} | null>(null);

  useEffect(() => {
    const p = localStorage.getItem("userProfile");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("userRole");
  if (!isLoggedIn) return <Navigate to="/auth?role=business" replace />;
  if (role !== "business") return <Navigate to={`/auth?role=${role || 'business'}`} replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Business Dashboard</h1>
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
      </div>
    </div>
  );
}
