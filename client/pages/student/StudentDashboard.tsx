import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/Api/api";
import { ChevronDown, LayoutDashboard, List, Video, FileText, GraduationCap, ClipboardList, User } from "lucide-react";
import MyCourses from "./MyCourses";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseItem {
  enrollmentId: string;
  content: {
    id: string;
    title: string;
    description: string;
    type: "pdf" | "video" | "live";
    price: number;
    businessName: string;
    resourceUrl?: string;
    liveLink?: string;
  };
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [allContents, setAllContents] = useState<
    { _id: string; title: string; description: string; type: "pdf" | "video" | "live"; price: number; businessName: string; resourceUrl?: string; liveLink?: string }[]
  >([]);
  const [loadingContents, setLoadingContents] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [openClassRoom, setOpenClassRoom] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const p =
      sessionStorage.getItem("userProfile") ||
      localStorage.getItem("userProfile") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("studentAvatarUrl") || undefined;
    setAvatarUrl(u);
  }, []);

  const onUploadAvatar = () => {
    if (!avatarFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem("studentAvatarUrl", dataUrl);
      setAvatarUrl(dataUrl);
      setAvatarFile(null);
    };
    reader.readAsDataURL(avatarFile);
  };

  useEffect(() => {
    apiGet<{ items: CourseItem[] }>("/api/student/my-courses")
      .then((d) => setCourses(d.items))
      .finally(() => setLoadingCourses(false));
  }, []);

  // fetch catalog contents for sidebar views
  useEffect(() => {
    apiGet<{ items: any[] }>("/api/contents")
      .then((d) => setAllContents(d.items || []))
      .finally(() => setLoadingContents(false));
  }, []);

  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");
  const role = profile?.role || "student";
  if (!token) return <Navigate to="/auth?role=student" replace />;
  if (role !== "student") return <Navigate to={`/auth?role=${role || "student"}`} replace />;

  const initials = (profile?.name || profile?.email || "S").slice(0, 1).toUpperCase();
  const total = courses.length;
  const liveCount = courses.filter((c) => c.content.type === "live").length;
  const videoCount = courses.filter((c) => c.content.type === "video").length;
  const pdfCount = courses.filter((c) => c.content.type === "pdf").length;

  // derive section from route
  const section = useMemo(() => {
    if (location.pathname.startsWith("/student/live")) return "live";
    if (location.pathname.startsWith("/student/courses")) return "courses";
    if (location.pathname.startsWith("/student/materials")) return "materials";
    if (location.pathname.startsWith("/student/mock-tests")) return "mock";
    if (location.pathname.startsWith("/student/my-courses")) return "my-courses";
    if (location.pathname.startsWith("/student/account")) return "account";
    return "home";
  }, [location.pathname]);

  const liveItems = useMemo(() => allContents.filter((i) => i.type === "live"), [allContents]);
  const courseItems = useMemo(() => allContents.filter((i) => i.type === "video"), [allContents]);
  const materialItems = useMemo(() => allContents.filter((i) => i.type === "pdf"), [allContents]);

  function go(path: string) {
    navigate(path);
  }

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
    navigate("/auth?role=student", { replace: true });
  }

  // pick a quick-continue item
  const continueItem = courses.find((c) => c.content.type !== "live" && c.content.resourceUrl) || courses[0];

  // Build navigation for RoleDashboardLayout
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      isActive: location.pathname === "/student",
      isExpandable: false as const,
    },
    {
      title: "Class Room",
      icon: List,
      isExpandable: true as const,
      isOpen: openClassRoom,
      onToggle: () => setOpenClassRoom((v) => !v),
      subItems: [
        { title: "Live Classes", href: "/student/live", icon: Video, isActive: location.pathname.startsWith("/student/live") },
        { title: "Course List", href: "/student/courses", icon: List, isActive: location.pathname.startsWith("/student/courses") },
        { title: "Study Materials", href: "/student/materials", icon: FileText, isActive: location.pathname.startsWith("/student/materials") },
      ],
    },
    { title: "My Courses", href: "/student/my-courses", icon: GraduationCap, isActive: location.pathname.startsWith("/student/my-courses"), isExpandable: false as const },
    { title: "Mock Tests", href: "/student/mock-tests", icon: ClipboardList, isActive: location.pathname.startsWith("/student/mock-tests"), isExpandable: false as const },
    { title: "Account", href: "/student/account", icon: User, isActive: location.pathname.startsWith("/student/account"), isExpandable: false as const },
  ];

  return (
    <RoleDashboardLayout
      title="Student Dashboard"
      navigationItems={navigationItems}
      sidebarProfile={
        <div className="flex items-center gap-3">
          <button className="rounded-full" onClick={() => navigate("/student/account")} title="Profile">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={profile?.name || "S"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-1">{profile?.name || "Student"}</span>
            <span className="text-xs text-muted-foreground">View profile</span>
          </div>
        </div>
      }
      sidebarFooter={<Button className="w-full" size="sm" variant="destructive" onClick={logout}>Logout</Button>}
    >
      {/* Main content (section router) */}
      {section === "home" && (
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Welcome back{profile?.name ? `, ${profile.name}` : ""}</h1>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Jump right into learning</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/my-courses")}>Continue Learning</Button>
                <Button variant="secondary" onClick={() => navigate("/student/courses")}>Browse Courses</Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Account</CardTitle>
                <CardDescription>Profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div><span className="text-slate-500">Name:</span> <span className="font-medium">{profile?.name || "-"}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className="font-medium">{profile?.email || "-"}</span></div>
                  <div><span className="text-slate-500">Role:</span> <span className="font-medium">{profile?.role || "student"}</span></div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="secondary" onClick={() => navigate("/profile")}>Manage Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Enrollments</span>
                <Link to="/my-courses" className="text-sm text-blue-600">View all</Link>
              </CardTitle>
              <CardDescription>Your latest courses</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="text-slate-600">Loading...</div>
              ) : courses.length === 0 ? (
                <div className="text-slate-600">No courses yet. Enroll from the catalog.</div>
              ) : (
                <div className="space-y-3">
                  {courses.slice(0, 4).map((en) => (
                    <div key={en.enrollmentId} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                      <div>
                        <div className="font-medium leading-5 line-clamp-1">{en.content.title}</div>
                        <div className="text-xs text-slate-600">{en.content.type.toUpperCase()} • {en.content.businessName}</div>
                      </div>
                      {en.content.type === "live" && en.content.liveLink ? (
                        <a href={en.content.liveLink} target="_blank" rel="noreferrer">
                          <Button size="sm">Join Now</Button>
                        </a>
                      ) : en.content.resourceUrl ? (
                        en.content.type === "pdf" ? (
                          <a href={en.content.resourceUrl} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="secondary">Open</Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => navigate("/my-courses")}>Open</Button>
                        )
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => navigate("/my-courses")}>Open</Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {section !== "home" && (
        <div>
          {section === "live" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Live Classes</h2>
              {loadingContents ? (
                <div className="text-slate-600">Loading...</div>
              ) : liveItems.length === 0 ? (
                <div className="text-slate-600">No live classes available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveItems.map((c) => (
                    <Card key={c._id} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="line-clamp-1">{c.title}</span>
                          <span className="text-blue-600 font-semibold whitespace-nowrap">₹{c.price}</span>
                        </CardTitle>
                        <CardDescription>by {c.businessName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {c.liveLink ? (
                            <a href={c.liveLink} target="_blank" rel="noreferrer">
                              <Button size="sm">Join Now</Button>
                            </a>
                          ) : (
                            <Button size="sm" variant="secondary" disabled>Link not set</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "courses" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Courses List</h2>
              {loadingContents ? (
                <div className="text-slate-600">Loading...</div>
              ) : courseItems.length === 0 ? (
                <div className="text-slate-600">No courses available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseItems.map((c) => (
                    <Card key={c._id} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="line-clamp-1">{c.title}</span>
                          <span className="text-blue-600 font-semibold whitespace-nowrap">₹{c.price}</span>
                        </CardTitle>
                        <CardDescription>by {c.businessName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button size="sm" variant="secondary" onClick={() => navigate("/catalog#courses")}>View Details</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "materials" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
              {loadingContents ? (
                <div className="text-slate-600">Loading...</div>
              ) : materialItems.length === 0 ? (
                <div className="text-slate-600">No materials available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materialItems.map((c) => (
                    <Card key={c._id} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="line-clamp-1">{c.title}</span>
                          <span className="text-blue-600 font-semibold whitespace-nowrap">₹{c.price}</span>
                        </CardTitle>
                        <CardDescription>by {c.businessName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {c.resourceUrl ? (
                          <a href={c.resourceUrl} target="_blank" rel="noreferrer">
                            <Button size="sm">Get Materials</Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => navigate("/catalog#materials")}>View Details</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "mock" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Mock Tests</h2>
              <div className="text-slate-600 mb-3">Practice tests to evaluate your preparation. (Coming soon)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Full Length Test 1", "Subject Test - Math", "Subject Test - Physics"].map((t, i) => (
                  <Card key={i} className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{t}</CardTitle>
                      <CardDescription>Duration: 60 min • Questions: 50</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" disabled>Start Test (Soon)</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {section === "my-courses" && (
            <div>
              <MyCourses />
            </div>
          )}

          {section === "account" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Account</h2>
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl} alt={profile?.name || "S"} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div>
                        <Label htmlFor="student-avatar">Profile picture</Label>
                        <Input id="student-avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                      </div>
                      <div>
                        <Button size="sm" onClick={onUploadAvatar} disabled={!avatarFile}>Upload Avatar</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-slate-500">Name:</span> <span className="font-medium">{profile?.name || "-"}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="font-medium">{profile?.email || "-"}</span></div>
                    <div><span className="text-slate-500">Role:</span> <span className="font-medium">{profile?.role || "student"}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </RoleDashboardLayout>
  );
}
