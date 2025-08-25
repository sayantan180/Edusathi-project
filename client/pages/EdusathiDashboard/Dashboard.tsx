import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Plus, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AdminAPI } from '@/Api/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ businesses: number; students: number; creators: number; totalUsers: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await AdminAPI.roleStats();
        if (mounted) {
          setStats({
            businesses: Number(data?.collections?.businesses ?? 0),
            students: Number(data?.collections?.students ?? 0),
            creators: Number(data?.collections?.creators ?? 0),
            totalUsers: Number(data?.totalUsers ?? 0),
          });
        }
      } catch (e) {
        console.warn('Failed to fetch role stats', e);
        if (mounted) {
          setStats({ businesses: 0, students: 0, creators: 0, totalUsers: 0 });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your Edusathi  management dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Business */}
          <div className="group relative rounded-xl bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-cyan-500/30 p-[1px] transition-transform duration-200 hover:-translate-y-1">
            <Card className="border-transparent bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Business</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '—' : stats?.businesses ?? 0}</div>
                <p className="text-xs text-muted-foreground">Total businesses registered</p>
              </CardContent>
            </Card>
          </div>

          {/* Total Students */}
          <div className="group relative rounded-xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-indigo-500/30 p-[1px] transition-transform duration-200 hover:-translate-y-1">
            <Card className="border-transparent bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '—' : stats?.students ?? 0}</div>
                <p className="text-xs text-muted-foreground">Registered students</p>
              </CardContent>
            </Card>
          </div>

          {/* Total Creators */}
          <div className="group relative rounded-xl bg-gradient-to-r from-fuchsia-500/30 via-rose-500/25 to-amber-500/30 p-[1px] transition-transform duration-200 hover:-translate-y-1">
            <Card className="border-transparent bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '—' : stats?.creators ?? 0}</div>
                <p className="text-xs text-muted-foreground">Registered creators</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Users (total registered) */}
          <div className="group relative rounded-xl bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-fuchsia-500/30 p-[1px] transition-transform duration-200 hover:-translate-y-1">
            <Card className="border-transparent bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '—' : stats?.totalUsers ?? 0}</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started by creating your first educational center
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="#">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Sub Center
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/centers">
                  <Building className="mr-2 h-4 w-4" />
                  View All Centers
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest center management activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent activity to display
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
