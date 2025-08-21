import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Auth() {
  const [params] = useSearchParams();
  const role = (params.get("role") || "student").toLowerCase();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

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
    setErrorMsg("");
  }, [role]);

  const { login, register, user: authedUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = mode === "register"
        ? await register(name, email, password, role)
        : await login(email, password);
      const defaultPath =
        user.role === "creator" ? "/creator" : user.role === "business" ? "/business" : "/student";
      const fromState: any = (location.state as any)?.from;
      const fromPath = fromState && typeof fromState === "object"
        ? `${fromState.pathname || ""}${fromState.search || ""}${fromState.hash || ""}`
        : undefined;
      const safeFrom = fromPath && !fromPath.startsWith("/auth") && !fromPath.startsWith("/login") ? fromPath : undefined;
      navigate(safeFrom || defaultPath, { replace: true });
    } catch (err: any) {
      if (err?.status === 409) {
        setErrorMsg("An account with this email already exists. Please sign in.");
        setMode("login");
        setPassword("");
      } else {
        setErrorMsg(err?.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated (e.g., after a successful redirect back), navigate out of /auth
  useEffect(() => {
    if (!authedUser) return;
    const defaultPath =
      authedUser.role === "creator" ? "/creator" : authedUser.role === "business" ? "/business" : "/student";
    const fromState: any = (location.state as any)?.from;
    const fromPath = fromState && typeof fromState === "object"
      ? `${fromState.pathname || ""}${fromState.search || ""}${fromState.hash || ""}`
      : undefined;
    const safeFrom = fromPath && !fromPath.startsWith("/auth") && !fromPath.startsWith("/login") ? fromPath : undefined;
    navigate(safeFrom || defaultPath, { replace: true });
  }, [authedUser]);

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
          <div className="flex justify-center gap-2 mb-3">
            <Button variant={mode === "register" ? "default" : "outline"} onClick={() => { setMode("register"); setErrorMsg(""); }}>Register</Button>
            <Button variant={mode === "login" ? "default" : "outline"} onClick={() => { setMode("login"); setErrorMsg(""); }}>Login</Button>
          </div>
          {errorMsg && (
            <div className="text-center text-sm text-red-600 mb-3">{errorMsg}</div>
          )}

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
