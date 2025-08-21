import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileData {
  name?: string;
  email?: string;
  role?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const p = localStorage.getItem("userProfile");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/auth?role=student" replace />;

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userProfile");
    navigate("/auth?role=student", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Account</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/student")}>Back to Dashboard</Button>
            <Button variant="destructive" onClick={logout}>Logout</Button>
          </div>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-600">Name: </span>
                <span className="font-medium">{profile?.name || "-"}</span>
              </div>
              <div>
                <span className="text-slate-600">Email: </span>
                <span className="font-medium">{profile?.email || "-"}</span>
              </div>
              <div>
                <span className="text-slate-600">Role: </span>
                <span className="font-medium">{profile?.role || "student"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Navigate to common sections</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/my-courses")}>My Courses</Button>
            <Button variant="secondary" onClick={() => navigate("/student/courses")}>Browse Courses</Button>
            <Link to="/catalog#materials" className="text-sm text-blue-600">Materials</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
