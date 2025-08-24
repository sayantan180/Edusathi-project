import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { toast } = useToast();
  const [params] = useSearchParams();
  const role = (params.get("role") || "student").toLowerCase();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingRole, setPendingRole] = useState(role);

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
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setRemember(false);
    setOtpStep(false);
    setOtp("");
    setPendingEmail("");
    setPendingRole((params.get("role") || "student").toLowerCase());
  }, [role]);
  
  useEffect(() => {
    // Reset password fields when switching between register/login
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
  }, [mode]);
  const { login, register, verifyOtp } = useAuth();

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function isStrongPassword(v: string) {
    // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
  }

  const validateRegister = () => {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
      return false;
    }
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Enter a valid email address.", variant: "destructive" });
      return false;
    }
    if (!isStrongPassword(password)) {
      toast({
        title: "Weak password",
        description: "Use at least 8 chars with uppercase, lowercase and a number.",
        variant: "destructive",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", description: "Please re-enter the same password.", variant: "destructive" });
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "register") {
        if (!validateRegister()) { setIsLoading(false); return; }
        const res = await register(name, email, password, role, remember);
        if (res && res.otpRequired) {
          setPendingEmail(res.email);
          setPendingRole(res.role);
          setOtpStep(true);
          setOtp("");
          toast({ title: "OTP sent", description: "Check your email for the 6-digit code." });
          return; // Wait for OTP verification
        }
      } else {
        try {
          await login(email, password, remember, role);
        } catch (err: any) {
          const msg = String(err?.message || "").toLowerCase();
          if (msg.includes("otp") || msg.includes("verify")) {
            setPendingEmail(email);
            setPendingRole(role);
            setOtpStep(true);
            toast({ title: "Verification required", description: "Please enter the OTP sent to your email." });
            return;
          }
          throw err;
        }
      }

      // Success toast
      toast({
        title: mode === "register" ? "Account created" : "Logged in",
        description: mode === "register" ? "Welcome! Your account has been created." : "Welcome back!",
      });

      // Clear form fields after successful auth
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRemember(false);

      // Redirect by role or pending redirect
      const redirect = localStorage.getItem("postLoginRedirect");
      if (redirect) {
        localStorage.removeItem("postLoginRedirect");
        navigate(redirect, { replace: true });
        return;
      }
      // Prefer actual stored role from auth over URL param
      const storedRole =
        sessionStorage.getItem("userRole") ||
        localStorage.getItem("userRole") ||
        (() => {
          const u = sessionStorage.getItem("user") || localStorage.getItem("user");
          try { return u ? (JSON.parse(u)?.role as string | null) : null; } catch { return null; }
        })() || role;
      const finalRole = (storedRole || "student").toLowerCase();
      const path = finalRole === "creator" ? "/creator" : finalRole === "business" ? "/business" : "/student";
      navigate(path, { replace: true });
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Enter full OTP", description: "OTP must be 6 digits.", variant: "destructive" });
      return;
    }
    setVerifying(true);
    try {
      await verifyOtp(pendingEmail || email, (pendingRole || role).toLowerCase(), otp, remember);
      toast({ title: "Verified", description: "Your account has been verified." });
      setOtpStep(false);
      setOtp("");

      // Navigate based on role
      const storedRole =
        sessionStorage.getItem("userRole") ||
        localStorage.getItem("userRole") ||
        (pendingRole || role);
      const finalRole = (storedRole || "student").toLowerCase();
      const path = finalRole === "creator" ? "/creator" : finalRole === "business" ? "/business" : "/student";
      navigate(path, { replace: true });
    } catch (err: any) {
      toast({ title: "OTP verification failed", description: err?.message || "Invalid or expired OTP.", variant: "destructive" });
    } finally {
      setVerifying(false);
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

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {mode === "register" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" autoComplete="name" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete={mode === "register" ? "email" : "username"} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" autoComplete={mode === "register" ? "new-password" : "current-password"} />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <Label htmlFor="confirm">Confirm password</Label>
                <div className="relative">
                  <Input id="confirm" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" autoComplete="new-password" />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <Label htmlFor="remember" className="text-sm text-slate-700">Remember me</Label>
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" disabled={isLoading}>
              {isLoading ? (mode === "register" ? "Creating..." : "Signing in...") : (mode === "register" ? "Create account" : "Sign in")}
            </Button>

            <div className="text-center text-sm text-slate-600">
              <Link to={`/get-started`} className="hover:underline">Change role</Link>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* OTP Step */}
      {otpStep && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md rounded-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold">Verify OTP</CardTitle>
              <CardDescription>Enter the 6-digit code sent to {pendingEmail || email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0,1,2,3,4,5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex gap-2">
                <Button className="w-full" disabled={verifying || otp.length !== 6} onClick={onVerifyOtp}>
                  {verifying ? "Verifying..." : "Verify"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => setOtpStep(false)} disabled={verifying}>
                  Cancel
                </Button>
              </div>
              <div className="text-xs text-slate-500 mt-3">OTP valid for 10 minutes. Check spam folder if not received.</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
