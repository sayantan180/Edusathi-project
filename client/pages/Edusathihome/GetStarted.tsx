import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Building } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  const roles = [
    {
      key: "student",
      title: "Student",
      description: "Learn, track progress, and access personalized content.",
      icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
      color: "from-blue-50 to-blue-100",
    },
    {
      key: "creator",
      title: "Creator",
      description: "Create courses, manage learners, and monetize content.",
      icon: <Users className="w-10 h-10 text-purple-600" />,
      color: "from-purple-50 to-purple-100",
    },
    {
      key: "business",
      title: "Business",
      description: "Manage teams, analytics, and organization-wide learning.",
      icon: <Building className="w-10 h-10 text-emerald-600" />,
      color: "from-emerald-50 to-emerald-100",
    },
  ];

  const selectRole = (role: string) => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-slate-700 hover:text-slate-900 font-semibold">← Back</Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get Started</h1>
            <p className="text-slate-600">Choose your role to continue</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <Card key={r.key} className="rounded-2xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${r.color} mb-4`}>{r.icon}</div>
                <CardTitle className="text-xl">{r.title}</CardTitle>
                <CardDescription>{r.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => selectRole(r.key)}>Continue as {r.title}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
