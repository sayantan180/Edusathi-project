import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<{name?: string; email?: string; role?: string} | null>(null);

  useEffect(() => {
    const p = localStorage.getItem("userProfile");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Student Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal info</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p><strong>Name:</strong> {profile?.name || "-"}</p>
                <p><strong>Email:</strong> {profile?.email || "-"}</p>
                <p><strong>Role:</strong> {profile?.role || "student"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Enrolled and recommended courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">No courses yet. Explore and enroll to start learning.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
