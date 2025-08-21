import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function Auth() {
  const [params] = useSearchParams();
  const role = (params.get("role") || "student").toLowerCase();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roleTitle = useMemo(() => {
    if (role === "creator") return "Creator";
    if (role === "business") return "Business";
    return "Student";
  }, [role]);

  useEffect(() => {
    // Reset forms when role changes
    setName("");
    setEmail("");
    setPassword("");
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "register") {
        const res = await apiPost<{
          user: { id: string; name: string; email: string; role: string };
          access_token: string;
          refresh_token: string;
        }>("/api/auth/register", { name, email, password, role });
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        localStorage.setItem("userProfile", JSON.stringify(res.user));
      } else {
        const res = await apiPost<{
          user: { id: string; name: string; email: string; role: string };
          access_token: string;
          refresh_token: string;
        }>("/api/auth/login", { email, password });
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        localStorage.setItem("userProfile", JSON.stringify(res.user));
      }

      // Redirect by role or pending redirect
      const redirect = localStorage.getItem("postLoginRedirect");
      if (redirect) {
        localStorage.removeItem("postLoginRedirect");
        navigate(redirect, { replace: true });
        return;
      }
      const path = role === "creator" ? "/creator" : role === "business" ? "/business" : "/student";
      navigate(path, { replace: true });
    } catch (err: any) {
      alert(err?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{mode === "register" ? "Create account" : "Welcome back"}</CardTitle>
          <CardDescription>
            {roleTitle} • {mode === "register" ? "Register to continue" : "Login to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 mb-5">
            <Button variant={mode === "register" ? "default" : "outline"} onClick={() => setMode("register")}>Register</Button>
            <Button variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>Login</Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" disabled={isLoading}>
              {isLoading ? (mode === "register" ? "Creating..." : "Signing in...") : (mode === "register" ? "Create account" : "Sign in")}
            </Button>

            <div className="text-center text-sm text-slate-600">
              <Link to={`/get-started`} className="hover:underline">Change role</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
