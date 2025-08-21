import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional allowed roles
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

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
    return <Navigate to={authPath} replace state={{ from: location }} />;
  }

  if (roles && user && !roles.includes(user.role)) {
    const defaultPath =
      user.role === "creator" ? "/creator" : user.role === "business" ? "/business" : "/student";
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
}
