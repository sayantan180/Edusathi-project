import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { LayoutDashboard, User, CreditCard, FileText, HelpCircle, Settings, LayoutTemplate } from "lucide-react";
import Pricing from "./Pricing";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstituteLanding from "@/components/templates/InstituteLanding";
import SplitLanding from "@/components/templates/SplitLanding";
import MinimalSpotlightLanding from "@/components/templates/MinimalSpotlightLanding";
import FeatureFirstLanding from "@/components/templates/FeatureFirstLanding";

export default function BusinessDashboard() {
  const [profile, setProfile] = useState<{name?: string; email?: string; role?: string} | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [planPurchased, setPlanPurchased] = useState<boolean>(false);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    plan?: string;
    status?: string;
    subscriptionStartAt?: string | null;
    expiresAt?: string | null;
  } | null>(null);
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

  useEffect(() => {
    const u = localStorage.getItem("businessAvatarUrl") || undefined;
    setAvatarUrl(u);
  }, []);

  useEffect(() => {
    setPlanPurchased(localStorage.getItem("planPurchased") === "true");
  }, []);

  // Fetch subscription details for current business by email
  useEffect(() => {
    const email = profile?.email;
    if (!email) return;
    setSubError(null);
    setSubLoading(true);
    fetch(`/api/centers/lookup?email=${encodeURIComponent(email)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setSubscription({
          plan: data?.plan,
          status: data?.status,
          subscriptionStartAt: data?.subscriptionStartAt || null,
          expiresAt: data?.expiresAt || null,
        });
      })
      .catch((_e) => {
        setSubscription(null);
        setSubError("No active subscription found.");
      })
      .finally(() => setSubLoading(false));
  }, [profile?.email]);

  const onUploadAvatar = () => {
    if (!avatarFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem("businessAvatarUrl", dataUrl);
      setAvatarUrl(dataUrl);
      setAvatarFile(null);
    };
    reader.readAsDataURL(avatarFile);
  };

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

  const chooseTemplate = (id: string) => {
    localStorage.setItem("businessTemplate", id);
    navigate("/business/website");
  };

  // Build navigation for RoleDashboardLayout
  const navigationItems = [
    { title: "Dashboard", href: "/business", icon: LayoutDashboard, isActive: location.pathname === "/business", isExpandable: false as const },
    { title: "Profile", href: "/business/account", icon: User, isActive: location.pathname.startsWith("/business/account"), isExpandable: false as const },
    { title: "Subscription Plan", href: "/business/subscription-plan", icon: CreditCard, isActive: location.pathname.startsWith("/business/subscription-plan"), isExpandable: false as const },
    { title: "Setup Details", href: "/business/setup", icon: Settings, isActive: location.pathname.startsWith("/business/setup"), isExpandable: false as const },
    { title: "Template", href: "/business/templates", icon: LayoutTemplate, isActive: location.pathname.startsWith("/business/templates"), isExpandable: false as const },
    { title: "Subscription Details", href: "/business/subscription-details", icon: FileText, isActive: location.pathname.startsWith("/business/subscription-details"), isExpandable: false as const },
    { title: "Help & Contact", href: "/business/contact", icon: HelpCircle, isActive: location.pathname.startsWith("/business/contact"), isExpandable: false as const },
  ];

  return (
    <RoleDashboardLayout
      title="Business Dashboard"
      navigationItems={navigationItems}
      sidebarProfile={
        <div className="flex items-center gap-3">
          <button className="rounded-full" onClick={() => navigate("/business/account")} title="Profile">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={profile?.name || "B"} />
              <AvatarFallback>{(profile?.name || profile?.email || "B").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-1">{profile?.name || "Business User"}</span>
            <span className="text-xs text-muted-foreground">View profile</span>
          </div>
        </div>
      }
      sidebarFooter={<Button className="w-full" size="sm" variant="destructive" onClick={logout}>Logout</Button>}
    >
      {/* Main content */}
      <div className="space-y-6">
        { location.pathname.startsWith("/business/subscription-plan") ? (
          <div>
            <Pricing />
          </div>
        ) : location.pathname.startsWith("/business/templates") ? (
          planPurchased ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1,2,3,4].map((n) => (
                <Card key={n} className="rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle>Template {n}</CardTitle>
                    <CardDescription>Select to create your website home</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-32 rounded-lg border bg-gradient-to-r from-slate-100 to-slate-200">
                      <h1 className="text-3xl font-bold text-center m-10">Choose your Template</h1>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button>Apply</Button>
                      <Button onClick={() => chooseTemplate(`t${n}`)}>View Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Templates Locked</CardTitle>
                <CardDescription>Purchase a plan to unlock website templates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/business/subscription-plan")}>View Plans</Button>
              </CardContent>
            </Card>
          )
        ) : location.pathname.startsWith("/business/website") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Your Business Website</CardTitle>
                <CardDescription>Public home generated from your selected template.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const t = localStorage.getItem("businessTemplate") || "t1";
                  if (t === "t1") return <InstituteLanding brandName={profile?.name || "Your Institute"} />;
                  if (t === "t2") return <SplitLanding brandName={profile?.name || "Your Institute"} />;
                  if (t === "t3") return <MinimalSpotlightLanding brandName={profile?.name || "Your Institute"} />;
                  return <FeatureFirstLanding brandName={profile?.name || "Your Institute"} />;
                })()}
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/account") ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Your business account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={profile?.name || "B"} />
                    <AvatarFallback>{(profile?.name || profile?.email || "B").slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-2">
                    <div>
                      <Label htmlFor="biz-avatar">Profile picture</Label>
                      <Input id="biz-avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                      <Button size="sm" onClick={onUploadAvatar} disabled={!avatarFile}>Upload Avatar</Button>
                    </div>
                  </div>
                </div>
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
                {subLoading ? (
                  <p className="text-slate-700">Loading subscription...</p>
                ) : subError ? (
                  <p className="text-slate-700">{subError}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-slate-700"><strong>Plan:</strong> {subscription?.plan || "—"}</p>
                    <p className="text-slate-700"><strong>Status:</strong> {(subscription?.status || "—").toString()}</p>
                    <p className="text-slate-700"><strong>Next billing:</strong> {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</p>
                  </div>
                )}
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
