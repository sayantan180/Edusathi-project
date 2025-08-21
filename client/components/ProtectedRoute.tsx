import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional allowed roles
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const targetRole = roles && roles.length > 0 ? roles[0] : undefined;
  const authPath = targetRole ? `/auth?role=${targetRole}` : "/auth";

  if (!isAuthenticated) {
    return <Navigate to={authPath} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={authPath} replace />;
  }

  return <>{children}</>;
}
