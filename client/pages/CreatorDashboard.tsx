import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/src/contexts/AuthContext";
import CreatorUpload from "./CreatorUpload";
import CreatorContents from "./CreatorContents";
import CreatorSales from "./CreatorSales";
import { useNavigate } from "react-router-dom";

export default function CreatorDashboard() {
  const { user, updateAvatar } = useAuth();
  const [section, setSection] = useState<"profile" | "upload" | "contents" | "sales">("profile");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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
    navigate("/auth?role=creator", { replace: true });
  }

  const onUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      setUploading(true);
      await updateAvatar(avatarFile);
      setAvatarFile(null);
    } catch (e) {
      // noop
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Creator Dashboard</h1>
          {/* <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate("/profile")}>Profile</Button>
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <Card className="rounded-2xl sticky top-6">
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>Manage your creator space</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button variant={section === "profile" ? "default" : "outline"} onClick={() => setSection("profile")}>Profile</Button>
                  <Button variant={section === "upload" ? "default" : "outline"} onClick={() => setSection("upload")}>Upload Content</Button>
                  <Button variant={section === "contents" ? "default" : "outline"} onClick={() => setSection("contents")}>Manage Contents</Button>
                  <Button variant={section === "sales" ? "default" : "outline"} onClick={() => setSection("sales")}>View Sales</Button>
                  <Button variant="secondary" onClick={() => navigate("/profile")}>Account</Button>
                  <div className="h-px bg-slate-200 my-1" />
                  <Button variant="destructive" onClick={logout}>Logout</Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <main className="md:col-span-9 space-y-6">
            {section === "profile" && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your creator info</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || "U"} />
                      <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div>
                        <Label htmlFor="avatar">Profile picture</Label>
                        <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                      </div>
                      <div>
                        <Button size="sm" disabled={!avatarFile || uploading} onClick={onUploadAvatar}>
                          {uploading ? "Uploading..." : "Upload Avatar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Name:</strong> {user?.name || "-"}</p>
                    <p><strong>Email:</strong> {user?.email || "-"}</p>
                    <p><strong>Role:</strong> {user?.role || "creator"}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {section === "upload" && (
              <CreatorUpload embedded onNavigateSection={setSection} />
            )}

            {section === "contents" && (
              <CreatorContents embedded onNavigateSection={setSection} />
            )}

            {section === "sales" && (
              <CreatorSales embedded />
            )}
          </main>
        </div>
        {/* <div className="flex items-center justify-end mt-4">
          <Button variant="destructive" onClick={logout}>Logout</Button>
        </div> */}
      </div>
    </div>
  );
}
