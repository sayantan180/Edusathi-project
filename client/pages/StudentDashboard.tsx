import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ChevronDown } from "lucide-react";
import MyCourses from "./MyCourses";

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

  useEffect(() => {
    const p =
      sessionStorage.getItem("userProfile") ||
      localStorage.getItem("userProfile") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Mobile header removed: sidebar is static across breakpoints */}

        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate("/student/account")}>Profile</Button>
          </div>
        </div>

        {/* Mobile drawer removed: sidebar always visible */}

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar - static/sticky on all breakpoints */}
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-4 self-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold">
                {initials}
              </div>
              <div>
                <div className="font-semibold leading-5">{profile?.name || "Student"}</div>
                <div className="text-xs text-slate-600">{profile?.email || "-"}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="text-xs text-slate-500">Total</div>
                <div className="font-semibold">{total}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="text-xs text-slate-500">Live</div>
                <div className="font-semibold">{liveCount}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="text-xs text-slate-500">Video/PDF</div>
                <div className="font-semibold">{videoCount + pdfCount}</div>
              </div>
            </div>
            <nav className="space-y-2">
              <Button
                variant={section === "home" ? "default" : "secondary"}
                className="w-full justify-start"
                onClick={() => go("/student")}
              >
                Dashboard Home
              </Button>

              {/* Catalog dropdown (static list) */}
              <div>
                <Button
                  variant={section === "live" || section === "courses" || section === "materials" ? "default" : "secondary"}
                  className="w-full justify-between"
                  onClick={() => setOpenClassRoom((v) => !v)}
                >
                  <span>Class Room</span>
                  <ChevronDown className={openClassRoom ? "h-4 w-4 transition-transform rotate-180" : "h-4 w-4 transition-transform"} />
                </Button>
                {openClassRoom && (
                  <div className="pl-1 space-y-1 mt-2">
                    <Button
                      variant={section === "live" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => go("/student/live")}
                    >
                      • Live Classes
                    </Button>
                    <Button
                      variant={section === "courses" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => go("/student/courses")}
                    >
                      • Course List
                    </Button>
                    <Button
                      variant={section === "materials" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => go("/student/materials")}
                    >
                      • Study Materials
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant={section === "my-courses" ? "default" : "secondary"}
                className="w-full justify-start"
                onClick={() => go("/student/my-courses")}
              >
                My Courses
              </Button>

              <Button
                variant={section === "mock" ? "default" : "secondary"}
                className="w-full justify-start"
                onClick={() => go("/student/mock-tests")}
              >
                Mock Test
              </Button>

              <Button
                variant={section === "account" ? "default" : "secondary"}
                className="w-full justify-start"
                onClick={() => go("/student/account")}
              >
                Account
              </Button>
            </nav>
            <div className="h-px bg-slate-200 my-4" />
            <Button className="w-full" onClick={logout}>Logout</Button>
          </aside>

          {/* Main */}
          <main>
            {/* Section router */}
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
          </main>
        </div>
        {/* Footer with Logout */}
        {/* <div className="flex items-center justify-end mt-4">
          <Button variant="destructive" onClick={logout}>Logout</Button>
        </div> */}
      </div>
    </div>
  );
}
